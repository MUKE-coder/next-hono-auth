"use client";

import { AddressInfoDialog } from "@/components/profile/address-info-dialog";
import { EmploymentInfoDialog } from "@/components/profile/employment-info-dialog";
import { MembershipInfoDialog } from "@/components/profile/membership-info-dialog";
import { PersonalInfoDialog } from "@/components/profile/personal-info-dialog";
import { RoleInfoDialog } from "@/components/profile/role-info-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSingleUserData } from "@/hooks/useUsers";
import { IUser } from "@/types";
import { Briefcase, Edit3, Eye, MapPin, User, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditLoading from "./loading";

export default function ProfilePage({
	userId,
	userRole,
}: {
	userId: string;
	userRole?: string;
}) {
	const { data, isFetching, isLoading } = useSingleUserData(userId);
	// console.log('User Data 🟩🟩🟩', data);

	useEffect(() => {
		if (isFetching || isLoading) {
			// console.log('Fetching user data...');
		}
	}, [isFetching, isLoading]);

	useEffect(() => {
		if (!isFetching && data) {
			// console.log('User Data 🟩🟩🟩', data);
		}
	}, [isFetching, data]);

	const searchParams = useSearchParams();
	const router = useRouter();
	const [editMode, setEditMode] = useState(false);
	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		if (data) {
			setUser(data);
		}
	}, [data]);

	useEffect(() => {
		const editParam = searchParams.get("edit");
		// `edit=true` means we are in edit mode
		setEditMode(editParam === "true");
	}, [searchParams]);

	const toggleMode = () => {
		const newMode = !editMode; // If currently in editMode (true), newMode becomes false (view)
		setEditMode(newMode);
		// If newMode is true, append ?edit=true. If newMode is false, remove ?edit=true.
		const url = newMode
			? `/dashboard/users/${userId}?edit=true`
			: `/dashboard/users/${userId}`;
		router.push(url);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ACTIVE":
				return "bg-green-100 text-green-800";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800";
			case "SUSPENDED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case "ADMIN":
				return "bg-purple-100 text-purple-800";
			case "MODERATOR":
				return "bg-blue-100 text-blue-800";
			case "MEMBER":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<>
			{isLoading ? (
				<EditLoading />
			) : (
				<>
					<div className="min-h-screen py-8">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between mb-8">
								<div>
									<h1 className="text-3xl font-bold text-gray-900">
										{editMode ? "Edit Profile" : "Profile View"}
									</h1>
									<p className="text-gray-600 mt-1">
										{editMode
											? "Update your profile information"
											: "View your profile information"}
									</p>
								</div>
								<Button
									onClick={toggleMode}
									variant={editMode ? "outline" : "default"}
									className="flex items-center gap-2"
								>
									{editMode ? (
										<>
											<Eye className="h-4 w-4" />
											View Profile
										</>
									) : (
										<>
											<Edit3 className="h-4 w-4" />
											Edit Profile
										</>
									)}
								</Button>
							</div>

							<Card className="mb-8">
								<CardContent className="pt-6">
									<div className="flex items-center space-x-6">
										<Avatar className="h-24 w-24">
											<AvatarImage
												src={user?.image || "/placeholder.svg"}
												alt={user?.name || "User"}
											/>
											<AvatarFallback className="text-lg">
												{user?.surname?.charAt(0)}
												{user?.otherNames?.charAt(0)}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<h2 className="text-2xl font-bold text-gray-900">
												{user?.name}
											</h2>
											<p className="text-gray-600">{user?.email}</p>
											<p className="text-gray-600">{user?.phone}</p>
											<div className="flex items-center gap-2 mt-2">
												<Badge className={getRoleColor(user?.role as string)}>
													{user?.role}
												</Badge>
												<Badge
													className={getStatusColor(user?.status as string)}
												>
													{user?.status}
												</Badge>
												{user?.isVerified && (
													<Badge className="bg-blue-100 text-blue-800">
														Verified
													</Badge>
												)}
											</div>
										</div>
										{/* Role Dialog */}
										{userRole === "ADMIN" && (
											<>
												{editMode && (
													<RoleInfoDialog user={user} onUpdate={setUser}>
														<Button variant="ghost" size="sm">
															<Edit3 className="h-4 w-4" />
														</Button>
													</RoleInfoDialog>
												)}
											</>
										)}
									</div>
								</CardContent>
							</Card>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Personal Information */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="flex items-center gap-2">
											<User className="h-5 w-5" />
											Personal Information
										</CardTitle>
										{editMode && (
											<PersonalInfoDialog user={user} onUpdate={setUser}>
												<Button variant="ghost" size="sm">
													<Edit3 className="h-4 w-4" />
												</Button>
											</PersonalInfoDialog>
										)}
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Full Name
											</label>
											<p className="text-gray-900">{user?.name}</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Gender
											</label>
											<p className="text-gray-900">
												{user?.profile?.gender || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Date of Birth
											</label>
											<p className="text-gray-900">
												{user?.profile?.dateOfBirth
													? new Date(
															user?.profile.dateOfBirth
													  ).toLocaleDateString()
													: "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												NIN
											</label>
											<p className="text-gray-900">
												{user?.nin || "Not specified"}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Address Information */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="flex items-center gap-2">
											<MapPin className="h-5 w-5" />
											Address Information
										</CardTitle>
										{editMode && (
											<AddressInfoDialog user={user} onUpdate={setUser}>
												<Button variant="ghost" size="sm">
													<Edit3 className="h-4 w-4" />
												</Button>
											</AddressInfoDialog>
										)}
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Home Address
											</label>
											<p className="text-gray-900">
												{user?.profile?.homeAddress || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Workplace Address
											</label>
											<p className="text-gray-900">
												{user?.profile?.workplaceAddress || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												District
											</label>
											<p className="text-gray-900">
												{user?.profile?.district || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Region
											</label>
											<p className="text-gray-900">
												{user?.profile?.region?.name || "Not specified"}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Employment Information */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="flex items-center gap-2">
											<Briefcase className="h-5 w-5" />
											Employment Information
										</CardTitle>
										{editMode && (
											<EmploymentInfoDialog user={user} onUpdate={setUser}>
												<Button variant="ghost" size="sm">
													<Edit3 className="h-4 w-4" />
												</Button>
											</EmploymentInfoDialog>
										)}
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Job Title
											</label>
											<p className="text-gray-900">
												{user?.profile?.title || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Employee Number
											</label>
											<p className="text-gray-900">
												{user?.profile?.employeeNo || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Category
											</label>
											<p className="text-gray-900">
												{user?.profile?.category || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Present Salary
											</label>
											<p className="text-gray-900">
												{user?.profile?.presentSalary
													? `UGX ${user?.profile.presentSalary.toLocaleString()}`
													: "Not specified"}
											</p>
										</div>
									</CardContent>
								</Card>

								{/* Membership Information */}
								<Card>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="flex items-center gap-2">
											<Users className="h-5 w-5" />
											Membership Information
										</CardTitle>
										{editMode && (
											<MembershipInfoDialog user={user} onUpdate={setUser}>
												<Button variant="ghost" size="sm">
													<Edit3 className="h-4 w-4" />
												</Button>
											</MembershipInfoDialog>
										)}
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Member Number
											</label>
											<p className="text-gray-900">
												{user?.profile?.memberNumber || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Tracking Number
											</label>
											<p className="text-gray-900">
												{user?.profile?.trackingNumber || "Not specified"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Vote Name
											</label>
											<p className="text-gray-900">
												{user?.profile?.voteName?.name ||
													"Not specified ,This Field is not editable"}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Member Since
											</label>
											<p className="text-gray-900">
												{user?.createdAt
													? new Date(user?.createdAt).toLocaleDateString()
													: "Not specified"}
											</p>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
