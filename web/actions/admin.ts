"use server";

import { RegisterFormValues } from "@/components/auth/AdminRegister";
import { api } from "@/config/axios";
import { UserRole } from "@/types/auth";
import axios from "axios";
import { revalidatePath } from "next/cache";

// Response interface for admin registration
export interface AdminRegistrationResponse {
	success: boolean;
	message?: string;
	data?: {
		id: string;
	};
	error?: string;
}
export interface AdminRegistrationProps {
	surname: string;
	otherNames: string;
	email: string;
	phone: string;
	role?: UserRole | null;
	image?: string;
	password: string;
}
export async function registerAdmin(
	data: AdminRegistrationProps
): Promise<AdminRegistrationResponse> {
	try {
		// Prepare the registration payload to match your API handler
		const registrationPayload = {
			surname: data.surname,
			otherNames: data.otherNames,
			name: `${data.surname} ${data.otherNames.split(" ")[0]}`, // Combine names for the name field
			email: data.email,
			phone: data.phone,
			role: data.role || "ADMIN", // Default to ADMIN if no role provided
			image: data.image || null,
			password: data.password,
			status: "ACTIVE", // Set default status
		};

		console.log("Registering admin with data:", registrationPayload);

		// Make API call to register admin using the same endpoint as createUser
		const response = await api.post("/users", registrationPayload);
		console.log(response);

		// Check if the response indicates success
		if (!response.data.success) {
			return {
				success: false,
				error: response.data.message || "Failed to register admin",
			};
		}

		// Revalidate relevant paths
		revalidatePath("/dashboard/users");
		revalidatePath("/dashboard/admins");
		revalidatePath("/auth/login");

		return {
			success: true,
			data: {
				id: response.data.data.id,
			},
			message: response.data.message || "Admin registered successfully",
		};
	} catch (error) {
		console.error("Admin registration error:", error);

		if (axios.isAxiosError(error)) {
			const responseData = error.response?.data;
			const statusCode = error.response?.status;

			// Handle specific error codes from your API
			if (statusCode === 409) {
				if (responseData?.code === "EMAIL_EXISTS") {
					return {
						success: false,
						error:
							"An admin with this email address already exists. Please use a different email.",
					};
				}

				if (responseData?.code === "PHONE_EXISTS") {
					return {
						success: false,
						error:
							"An admin with this phone number already exists. Please use a different phone number.",
					};
				}

				return {
					success: false,
					error:
						responseData?.message ||
						"An admin with these details already exists.",
				};
			}

			if (statusCode === 400) {
				return {
					success: false,
					error:
						responseData?.message ||
						"Invalid data provided. Please check all fields and try again.",
				};
			}

			if (statusCode === 500) {
				if (responseData?.code === "CREATE_ERROR") {
					return {
						success: false,
						error: "Unable to create admin account. Please try again later.",
					};
				}
			}

			// Generic error message for other status codes
			return {
				success: false,
				error:
					responseData?.message ||
					"Failed to register admin. Please try again.",
			};
		}

		// Handle non-Axios errors
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "An unexpected error occurred. Please try again.",
		};
	}
}
