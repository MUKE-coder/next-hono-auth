"use client";

import EditLoading from "@/app/(dashboard)/dashboard/users/[id]/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSingleUserData } from "@/hooks/useUsers";
import { IUser } from "@/types";
import {
	ArrowLeft,
	Briefcase,
	Building2,
	Calendar,
	Edit,
	Hash,
	MapPin,
	User,
	Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PersonalInfoDialog } from "./personal-info-dialog";
import { AddressInfoDialog } from "./address-info-dialog";
import { EmploymentInfoDialog } from "./employment-info-dialog";
import { MembershipInfoDialog } from "./membership-info-dialog";
import Link from "next/link";

export default function ProfilePage({ userId }: { userId: string }) {
	const { data, isLoading } = useSingleUserData(userId);
	const [user, setUser] = useState<IUser | null>(null);

	useEffect(() => {
		if (data) {
			setUser(data);
		}
	}, [data]);

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

	if (isLoading) {
		return <EditLoading />;
	}

	return (
		<div className="min-h-screen py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<Link
						href="/user-dashboard/user-profile"
						className="group inline-flex items-center gap-2 text-gray-900 hover:text-gray-800 transition-colors duration-200 font-medium"
						aria-label="Go back to previous page"
					>
						<ArrowLeft
							className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
							aria-hidden="true"
						/>
						<span>Back</span>
					</Link>
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
							<p className="text-gray-600 mt-1">
								Update your profile information
							</p>
						</div>
					</div>
				</div>

				<Card className="mb-8 bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
					<CardContent className="p-8">
						<div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
							<Avatar className="w-24 h-24 border-4 border-white/20">
								<AvatarImage
									src={user?.image || "/placeholder.svg"}
									alt={user?.name || "User"}
								/>
								<AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
									{user?.surname?.charAt(0)}
									{user?.otherNames?.charAt(0)}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1 space-y-4">
								<div>
									<h2 className="text-3xl font-bold mb-2">
										{user?.name || "User"}
									</h2>
									<div className="flex items-center gap-2">
										<Badge className={getStatusColor(user?.status as string)}>
											{user?.status}
										</Badge>
										{user?.isVerified && (
											<Badge className="bg-blue-100 text-blue-800">
												Verified
											</Badge>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
									<div className="flex items-center space-x-2">
										<Hash className="w-4 h-4 text-red-200" />
										<span className="text-red-100">ID:</span>
										<span className="font-mono font-semibold">
											{user?.profile.memberNumber}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Building2 className="w-4 h-4 text-red-200" />
										<span className="text-red-100">Category:</span>
										<span className="font-semibold">
											{user?.profile.category}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<Calendar className="w-4 h-4 text-red-200" />
										<span className="text-red-100">Registered at:</span>
										<span className="font-semibold">
											{user?.createdAt
												? new Date(user.createdAt).toLocaleDateString()
												: "Not specified"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Personal Information */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="flex items-center gap-2">
								<User className="w-5 h-5 text-red-600" />
								Personal Information
							</CardTitle>
							<PersonalInfoDialog user={user} onUpdate={setUser}>
								<Button variant="ghost" size="sm">
									<Edit className="w-4 h-4 mr-2" />
								</Button>
							</PersonalInfoDialog>
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
										? new Date(user?.profile.dateOfBirth).toLocaleDateString()
										: "Not specified"}
								</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-500">NIN</label>
								<p className="text-gray-900">{user?.nin || "Not specified"}</p>
							</div>
						</CardContent>
					</Card>

					{/* Address Information */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="flex items-center gap-2">
								<MapPin className="h-5 w-5 text-green-500" />
								Address Information
							</CardTitle>

							{user && (
								<AddressInfoDialog user={user} onUpdate={setUser}>
									<Button variant="ghost" size="sm">
										<Edit className="w-4 h-4 mr-2" />
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
								<Building2 className="w-5 h-5 text-purple-600" />
								Employment Information
							</CardTitle>
							<EmploymentInfoDialog user={user} onUpdate={setUser}>
								<Button variant="ghost" size="sm">
									<Edit className="w-4 h-4 mr-2" />
								</Button>
							</EmploymentInfoDialog>
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
								<Users className="h-5 w-5 text-blue-500" />
								Membership Information
							</CardTitle>
							<MembershipInfoDialog user={user} onUpdate={setUser}>
								<Button variant="ghost" size="sm">
									<Edit className="w-4 h-4 mr-2" />
								</Button>
							</MembershipInfoDialog>
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
										"Not specified, This Field is not editable"}
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
	);
}
