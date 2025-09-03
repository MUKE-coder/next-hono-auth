"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Download,
	Printer,
	Mail,
	Phone,
	MapPin,
	Calendar,
	CreditCard,
	Building2,
	Hash,
	DollarSign,
	User,
	Shield,
	Clock,
	CheckCircle,
	XCircle,
	AlertTriangle,
	Loader2,
	Edit,
	MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Import our hooks and PDF component
import { useUserDetailsWithUtils } from "@/hooks/useUserDetails";

// React PDF imports
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { UserDetailPDF } from "@/app/(dashboard)/dashboard/members/components/UserDetailPDF";
import Link from "next/link";

interface UserDetailPageProps {
	userId: string;
}

export default function UserProfile({ userId }: UserDetailPageProps) {
	const [showPDFPreview, setShowPDFPreview] = useState(false);
	const { user, isLoading, error, utils, refetch } =
		useUserDetailsWithUtils(userId);

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 text-lg">Loading profile...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center max-w-md">
					<AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">
						Unable to Load Profile
					</h2>
					<p className="text-gray-600 mb-6">
						{error?.message || "Profile not found"}
					</p>
					<div className="space-x-3">
						<Button onClick={() => refetch()} variant="outline">
							Try Again
						</Button>
						<Button onClick={() => window.history.back()}>Go Back</Button>
					</div>
				</div>
			</div>
		);
	}

	const handlePrint = () => {
		setShowPDFPreview(true);
	};

	const getStatusIcon = () => {
		switch (user.status) {
			case "ACTIVE":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "PENDING":
				return <Clock className="w-4 h-4 text-yellow-600" />;
			case "SUSPENDED":
				return <XCircle className="w-4 h-4 text-red-600" />;
			case "INACTIVE":
				return <XCircle className="w-4 h-4 text-gray-600" />;
			default:
				return <AlertTriangle className="w-4 h-4 text-gray-600" />;
		}
	};

	const getStatusBadge = () => {
		const configs = {
			ACTIVE: "bg-green-100 text-green-800 border-green-200",
			PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
			SUSPENDED: "bg-red-100 text-red-800 border-red-200",
			INACTIVE: "bg-gray-100 text-gray-800 border-gray-200",
		};

		const config = configs[user.status] || configs.INACTIVE;

		return (
			<Badge
				variant="outline"
				className={`${config} font-medium flex items-center gap-1.5`}
			>
				{getStatusIcon()}
				{user.status}
			</Badge>
		);
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<motion.div
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6 }}
				className="bg-white border-b border-gray-200 sticky top-0 z-40"
			>
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<div>
								<h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
								<p className="text-gray-600">
									Your complete profile information
								</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<PDFDownloadLink
								document={<UserDetailPDF user={user} />}
								fileName={`${utils.getFullName()}-profile.pdf`}
							>
								{({ loading }) => (
									<Button variant="outline" disabled={loading}>
										<Download className="w-4 h-4 mr-2" />
										{loading ? "Generating..." : "Download PDF"}
									</Button>
								)}
							</PDFDownloadLink>

							<Button onClick={handlePrint} variant="outline">
								<Printer className="w-4 h-4 mr-2" />
								Preview PDF
							</Button>

							<Button variant="outline">
								<Link
									href={`/user-dashboard/user-profile/edit`}
									className="flex items-center justify-center gap-2"
								>
									<Edit className="w-4 h-4 mr-2" />
									Edit Profile
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-6 py-8">
				<motion.div
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					className="space-y-8"
				>
					{/* Profile Header */}
					<motion.div variants={itemVariants}>
						<Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0">
							<CardContent className="p-8">
								<div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">
									<Avatar className="w-24 h-24 border-4 border-white/20">
										<AvatarImage
											src={user.image || "/placeholder.svg"}
											alt={utils.getFullName()}
										/>
										<AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
											{utils
												.getFullName()
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1 space-y-4">
										<div>
											<h2 className="text-3xl font-bold mb-2">
												{utils.getFullName()}
											</h2>
											<p className="text-red-100 text-lg">
												{utils.getTitleLabel()}
											</p>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
											<div className="flex items-center space-x-2">
												<Hash className="w-4 h-4 text-red-200" />
												<span className="text-red-100">ID:</span>
												<span className="font-mono font-semibold">
													{user.profile.memberNumber}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Building2 className="w-4 h-4 text-red-200" />
												<span className="text-red-100">Category:</span>
												<span className="font-semibold">
													{utils.getCategoryLabel()}
												</span>
											</div>
											<div className="flex items-center space-x-2">
												<Calendar className="w-4 h-4 text-red-200" />
												<span className="text-red-100">Registered for:</span>
												<span className="font-semibold">
													{utils.getMembershipDuration()}
												</span>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											{getStatusBadge()}
											{user.isVerified && (
												<Badge className="bg-green-100 text-green-800 border-green-200">
													<CheckCircle className="w-3 h-3 mr-1" />
													Verified
												</Badge>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Information Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Personal Information */}
						<motion.div variants={itemVariants}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<User className="w-5 h-5 text-red-600" />
										Personal Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Surname
											</label>
											<p className="text-gray-900 font-medium">
												{user.surname}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Other Names
											</label>
											<p className="text-gray-900 font-medium">
												{user.otherNames}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Gender
											</label>
											<p className="text-gray-900 font-medium">
												{user.profile.gender}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Age
											</label>
											<p className="text-gray-900 font-medium">
												{utils.getAge()} years old
											</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Date of Birth
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<Calendar className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium">
												{new Date(user.profile.dateOfBirth).toLocaleDateString(
													"en-GB",
													{
														day: "numeric",
														month: "long",
														year: "numeric",
													}
												)}
											</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											National ID (NIN)
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<CreditCard className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium font-mono">
												{user.profile.ninNumber}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Contact Information */}
						<motion.div variants={itemVariants}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Phone className="w-5 h-5 text-green-600" />
										Contact Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<label className="text-sm font-medium text-gray-500">
											Email Address
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<Mail className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium">{user.email}</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Phone Number
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<Phone className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium">{user.phone}</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											District
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<MapPin className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium">
												{user.profile.district}
											</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Home Address
										</label>
										<div className="flex items-start space-x-2 mt-1">
											<MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
											<p className="text-gray-900 font-medium leading-relaxed">
												{user.profile.homeAddress}
											</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Workplace Address
										</label>
										<div className="flex items-start space-x-2 mt-1">
											<Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
											<p className="text-gray-900 font-medium leading-relaxed">
												{user.profile.workplaceAddress}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Employment Information */}
						<motion.div variants={itemVariants}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Building2 className="w-5 h-5 text-purple-600" />
										Employment Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Professional Title
											</label>
											<p className="text-gray-900 font-medium">
												{utils.getTitleLabel()}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Category
											</label>
											<p className="text-gray-900 font-medium">
												{utils.getCategoryLabel()}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Employee Number
											</label>
											<p className="text-gray-900 font-medium font-mono">
												{user.profile.employeeNo}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Computer Number
											</label>
											<p className="text-gray-900 font-medium font-mono">
												{user.profile.computerNumber}
											</p>
										</div>
									</div>

									<div>
										<label className="text-sm font-medium text-gray-500">
											Present Salary
										</label>
										<div className="flex items-center space-x-2 mt-1">
											<DollarSign className="w-4 h-4 text-gray-400" />
											<p className="text-gray-900 font-medium text-lg">
												{utils.getFormattedSalary()}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Membership Information */}
						<motion.div variants={itemVariants}>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Shield className="w-5 h-5 text-red-600" />
										Account Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Account Number
											</label>
											<p className="text-gray-900 font-medium font-mono text-lg">
												{user.profile.memberNumber}
											</p>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Tracking Number
											</label>
											<p className="text-gray-900 font-medium font-mono">
												{user.profile.trackingNumber}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Registration Date
											</label>
											<div className="flex items-center space-x-2 mt-1">
												<Calendar className="w-4 h-4 text-gray-400" />
												<p className="text-gray-900 font-medium">
													{new Date(user.createdAt).toLocaleDateString(
														"en-GB",
														{
															day: "numeric",
															month: "long",
															year: "numeric",
														}
													)}
												</p>
											</div>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Account Age
											</label>
											<div className="flex items-center space-x-2 mt-1">
												<Clock className="w-4 h-4 text-gray-400" />
												<p className="text-gray-900 font-medium">
													{utils.getMembershipDuration()}
												</p>
											</div>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-gray-500">
												Status
											</label>
											<div className="mt-1">{getStatusBadge()}</div>
										</div>
										<div>
											<label className="text-sm font-medium text-gray-500">
												Verification
											</label>
											<div className="mt-1">
												{user.isVerified ? (
													<Badge className="bg-green-100 text-green-800 border-green-200">
														<CheckCircle className="w-3 h-3 mr-1" />
														Verified
													</Badge>
												) : (
													<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
														<Clock className="w-3 h-3 mr-1" />
														Pending
													</Badge>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</motion.div>
			</div>

			{/* PDF Preview Modal */}
			{showPDFPreview && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-lg max-w-4xl w-full h-[90vh] flex flex-col">
						<div className="flex items-center justify-between p-4 border-b">
							<h3 className="text-lg font-semibold">PDF Preview</h3>
							<Button
								variant="ghost"
								onClick={() => setShowPDFPreview(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<XCircle className="w-5 h-5" />
							</Button>
						</div>
						<div className="flex-1 p-4">
							<PDFViewer width="100%" height="100%">
								<UserDetailPDF user={user} />
							</PDFViewer>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
