"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUpdateUser } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react"; // Import useEffect
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { IUser } from "@/types";

const personalInfoSchema = z.object({
	surname: z.string().min(1, "Surname is required"),
	otherNames: z.string().optional(),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(10, "Phone number must be at least 10 digits"),
	nin: z
		.string()
		.refine((val) => val === "" || val.length === 14, {
			message: "NIN Number must be either empty or exactly 14 characters long",
		})
		.optional(),
	gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
	dateOfBirth: z.date().optional(),
	ninNumber: z
		.string()
		.refine((val) => val === "" || val.length === 14, {
			message: "NIN Number must be either empty or exactly 14 characters long",
		})
		.optional(),
});

export enum GENDER {
	MALE = "MALE",
	FEMALE = "FEMALE",
	OTHER = "OTHER",
}

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoDialogProps {
	user: IUser | null;
	onUpdate: (user: any) => void;
	children: React.ReactNode;
}

export function PersonalInfoDialog({
	user,
	onUpdate,
	children,
}: PersonalInfoDialogProps) {
	if (!user) {
		return null; // or return a loading spinner or error message
	}
	const updateUserMutation = useUpdateUser();

	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<PersonalInfoFormData>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			surname: user?.surname || "",
			otherNames: user?.otherNames || "",
			email: user?.email || "",
			phone: user?.phone || "",
			nin: user?.nin || "",
			gender: user?.profile?.gender || undefined,
			dateOfBirth: user?.profile?.dateOfBirth
				? new Date(user.profile.dateOfBirth)
				: undefined,
			ninNumber: user?.profile?.ninNumber || "",
		},
	});

	// Get form state to check if fields are dirty
	const { formState } = form;
	const { isDirty, dirtyFields } = formState;

	// Use a ref or state to store the initial values to compare against
	// For simplicity, we'll reinitialize defaultValues on dialog open
	useEffect(() => {
		if (open && user) {
			// Only reset if user exists
			form.reset({
				surname: user.surname || "",
				otherNames: user.otherNames || "",
				email: user.email || "",
				phone: user.phone || "",
				nin: user.nin || "",
				gender: user.profile?.gender || undefined,
				dateOfBirth: user.profile?.dateOfBirth
					? new Date(user.profile.dateOfBirth)
					: undefined,
				ninNumber: user.profile?.ninNumber || "",
			});
		}
	}, [open, user, form]);
	const onSubmit = async (data: PersonalInfoFormData) => {
		setIsLoading(true);

		const userId = user.id;

		try {
			// Create an object to hold only the changed values
			const changedData: any = {};
			const changedProfileData: any = {};

			// Loop through all fields and check if they are dirty
			if (dirtyFields.surname) changedData.surname = data.surname;
			if (dirtyFields.otherNames) changedData.otherNames = data.otherNames;
			if (dirtyFields.email) changedData.email = data.email;
			if (dirtyFields.phone) changedData.phone = data.phone;

			// Handle profile fields
			if (dirtyFields.gender)
				changedProfileData.gender = data.gender as GENDER | undefined;
			if (dirtyFields.dateOfBirth)
				changedProfileData.dateOfBirth = data.dateOfBirth as any;
			if (dirtyFields.ninNumber) changedProfileData.ninNumber = data.ninNumber;

			// Construct the payload with only changed fields
			const updatedUserPayload: {
				user?: Record<string, any>;
				profile?: Record<string, any>;
			} = {};

			if (Object.keys(changedData).length > 0) {
				// Automatically update 'name' if surname or otherNames changed
				if (dirtyFields.surname || dirtyFields.otherNames) {
					changedData.name = `${data.surname} ${data.otherNames}`;
				}
				updatedUserPayload.user = changedData;
			}

			if (Object.keys(changedProfileData).length > 0) {
				updatedUserPayload.profile = changedProfileData;
			}

			// If no fields are dirty, do not proceed with mutation
			if (
				Object.keys(updatedUserPayload.user || {}).length === 0 &&
				Object.keys(updatedUserPayload.profile || {}).length === 0
			) {
				setOpen(false);
				return;
			}

			// console.log('Data To Update ✅', updatedUserPayload);

			await updateUserMutation.mutateAsync({
				userId,
				data: updatedUserPayload,
			});

			// Update the local user object with the new values
			const newUser = { ...user };
			if (updatedUserPayload.user) {
				Object.assign(newUser, updatedUserPayload.user);
			}
			if (updatedUserPayload.profile) {
				newUser.profile = { ...newUser.profile, ...updatedUserPayload.profile };
			}

			onUpdate(newUser); // Pass the updated user object back
			setOpen(false);
			toast.success("Personal information updated successfully!");
		} catch (error) {
			console.error("Update error:", error);
			toast.error("Error; Failed to update personal information.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Personal Information</DialogTitle>
					<DialogDescription>
						Update your personal details here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="surname"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Surname</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="otherNames"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Other Names</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="MALE">Male</SelectItem>
												<SelectItem value="FEMALE">Female</SelectItem>
												{user.profile?.gender === GENDER.OTHER && (
													<SelectItem value="OTHER">Other</SelectItem>
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dateOfBirth"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date of Birth</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="ninNumber"
							render={({ field }) => (
								<FormItem>
									<FormLabel>NIN Number</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								disabled={isLoading}
								variant="outline"
								onClick={() => {
									setOpen(false);
									form.reset(); // Reset form state when dialog is closed by cancel
								}}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isLoading || !isDirty}
								className="bg-red-600 hover:bg-red-700"
							>
								{isLoading ? (
									<span className="flex gap-2 items-center">
										<Loader2 className="animate-spin" /> Saving...
									</span>
								) : (
									<>Save Changes</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
