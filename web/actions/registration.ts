"use server";

import { Step2FormData } from "@/app/(auth)/auth/register/components/steps/StepTwo";
// import { PersonalInfoProfile } from "@/app/(user-dashboard)/user-dashboard/user-profile/components/tabs/personal";
import { api, API_BASE_URL } from "@/config/axios";

import axios from "axios";
import { revalidatePath } from "next/cache";

// Types for server actions
interface CreateMemberWithProfileData {
  surname: string;
  otherNames: string;
  email: string;
  phone: string;
  image?: string | null;
  password: string;
}

interface UpdatePersonalInfoData {
  gender?: "MALE" | "FEMALE";
  dateOfBirth?: string;
  passportPhoto?: string;
  homeAddress?: string;
  district?: string;
}

interface UpdateWorkplaceInfoData {
  regionId?: string;
  voteNameId?: string;
  title?: string;
  employeeNo?: string;
  workplaceAddress?: string;
  lastStep: number;
}

interface UpdateJobDetailsData {
  presentSalary?: number;
  computerNumber?: string;
  category?: string;
  lastStep: number;
}

export async function createMemberWithProfile(
  data: CreateMemberWithProfileData
) {
  try {
    // Prepare the registration payload to match your API handler
    const registrationPayload = {
      surname: data.surname,
      otherNames: data.otherNames,
      name: `${data.surname} ${data.otherNames.split(" ")[0]}`, // Combine names for the name field
      email: data.email,
      phone: data.phone,
      role: "USER", // Set role as MEMBER
      image: data.image || null,
      password: data.password,
      status: "PENDING", // Set status as PENDING for members
    };

    console.log("Creating member with data:", registrationPayload);

    // Make API call to create member
    const response = await axios.post(
      `${API_BASE_URL}/api/members`,
      registrationPayload
    );

    // Check if the response indicates success
    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Failed to create member account",
      };
    }

    // Revalidate relevant paths
    revalidatePath("/register");
    revalidatePath("/dashboard/members");

    return {
      success: true,
      data: {
        userId: response.data.data.userId,
        profileId: response.data.data.profileId,
        trackingNumber: response.data.data.trackingNumber,
      },
      message: response.data.message || "Member account created successfully",
    };
  } catch (error) {
    console.error("Member registration error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      // Handle specific error codes from your API
      if (statusCode === 409) {
        if (responseData?.code === "EMAIL_EXISTS") {
          return {
            success: false,
            error:
              "A member with this email address already exists. Please use a different email or try to resume your registration.",
          };
        }

        if (responseData?.code === "PHONE_EXISTS") {
          return {
            success: false,
            error:
              "A member with this phone number already exists. Please use a different phone number or try to resume your registration.",
          };
        }

        return {
          success: false,
          error:
            responseData?.message ||
            "A member with these details already exists.",
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
            error: "Unable to create member account. Please try again later.",
          };
        }
      }

      // Generic error message for other status codes
      return {
        success: false,
        error:
          responseData?.message ||
          "Failed to create member account. Please try again.",
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

// Server Action: Update Personal Info (Step 2)
export async function updatePersonalInfo(
  profileId: string,
  data: Step2FormData
) {
  try {
    const updatePayload = {
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      ninNumber: data.ninNumber,
      homeAddress: data.homeAddress,
      workplaceAddress: data.workplaceAddress,
      district: data.district,
    };

    console.log(
      "Updating personal info for profile:",
      profileId,
      updatePayload
    );

    // Make API call to update profile
    const response = await api.patch(`/members/${profileId}`, updatePayload);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Failed to update personal information",
      };
    }

    // Revalidate relevant paths
    revalidatePath(`/auth/register/${profileId}`);

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.message || "Personal information updated successfully",
    };
  } catch (error) {
    console.error("Update personal info error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return {
          success: false,
          error: "Profile not found. Please start registration again.",
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

      return {
        success: false,
        error:
          responseData?.message ||
          "Failed to update personal information. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to update personal information. Please try again.",
    };
  }
}

// Server Action: Update Workplace Info (Step 3)
export async function updateWorkplaceInfo(
  profileId: string,
  data: UpdateWorkplaceInfoData
) {
  try {
    const updatePayload = {
      regionId: data.regionId,
      voteNameId: data.voteNameId,
      title: data.title,
      employeeNo: data.employeeNo,
      lastStep: data.lastStep,
    };

    console.log(
      "Updating workplace info for profile:",
      profileId,
      updatePayload
    );

    // Make API call to update profile
    const response = await api.patch(`/members/${profileId}`, updatePayload);

    if (!response.data.success) {
      return {
        success: false,
        error:
          response.data.message || "Failed to update workplace information",
      };
    }

    // Revalidate relevant paths
    revalidatePath(`/auth/register/${profileId}`);

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.message || "Workplace information updated successfully",
    };
  } catch (error) {
    console.error("Update workplace info error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return {
          success: false,
          error: "Profile not found. Please start registration again.",
        };
      }

      if (statusCode === 409) {
        if (responseData?.code === "EMPLOYEE_NO_EXISTS") {
          return {
            success: false,
            error:
              "Employee number already exists. Please check and try again.",
          };
        }
      }

      if (statusCode === 400) {
        return {
          success: false,
          error:
            responseData?.message ||
            "Invalid data provided. Please check all fields and try again.",
        };
      }

      return {
        success: false,
        error:
          responseData?.message ||
          "Failed to update workplace information. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to update workplace information. Please try again.",
    };
  }
}

// Server Action: Update Job Details (Step 4)
export async function updateJobDetails(
  profileId: string,
  data: UpdateJobDetailsData
) {
  try {
    const updatePayload = {
      presentSalary: data.presentSalary,
      computerNumber: data.computerNumber,
      category: data.category,
      lastStep: data.lastStep,
    };

    console.log("Updating job details for profile:", profileId, updatePayload);

    // Make API call to update profile and complete registration
    const response = await api.patch(
      `/members/final/${profileId}`,
      updatePayload
    );

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Failed to update job details",
      };
    }

    // Revalidate relevant paths
    revalidatePath(`/auth/register/${profileId}`);
    revalidatePath("/dashboard/members");
    console.log("UPDATED DATA :", response.data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Job details updated successfully",
    };
  } catch (error) {
    console.error("Update job details error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return {
          success: false,
          error: "Profile not found. Please start registration again.",
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

      return {
        success: false,
        error:
          responseData?.message ||
          "Failed to update job details. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to update job details. Please try again.",
    };
  }
}

// Server Action: Resume Registration by Tracking Number
export async function resumeRegistration(trackingNumber: string) {
  try {
    console.log("Resuming registration with tracking number:", trackingNumber);

    // Make API call to get profile by tracking number
    const response = await api.get(`members/${trackingNumber}`);
    console.log(response);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Tracking number not found",
      };
    }

    const profile = response.data.data;

    // Determine next step based on completed data
    let nextStep = 2;
    let completedSteps = [1];

    if (profile.gender || profile.dateOfBirth || profile.homeAddress) {
      completedSteps.push(2);
      nextStep = 3;
    }

    if (profile.regionId || profile.voteNameId || profile.title) {
      completedSteps.push(3);
      nextStep = 4;
    }

    if (profile.presentSalary || profile.memberNumber) {
      completedSteps.push(4);
      nextStep = 4; // Stay on step 4 if completed
    }

    return {
      success: true,
      data: {
        ...profile,
        completedSteps,
        nextStep,
      },
    };
  } catch (error) {
    console.error("Resume registration error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return {
          success: false,
          error: "Tracking number not found. Please check and try again.",
        };
      }

      return {
        success: false,
        error:
          responseData?.message ||
          "Failed to resume registration. Please try again.",
      };
    }

    return {
      success: false,
      error: "Failed to resume registration. Please try again.",
    };
  }
}

// Server Action: Get Profile by ID
export async function getProfileById(profileId: string) {
  try {
    console.log("Getting profile by ID:", profileId);

    // Make API call to get profile
    const response = await axios.get(`${API_BASE_URL}/profiles/${profileId}`);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Profile not found",
      };
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get profile by ID error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      const statusCode = error.response?.status;

      if (statusCode === 404) {
        return {
          success: false,
          error: "Profile not found.",
        };
      }

      return {
        success: false,
        error: responseData?.message || "Failed to fetch profile data.",
      };
    }

    return {
      success: false,
      error: "Failed to fetch profile data.",
    };
  }
}

// Server Action: Get Regions
export async function getRegions() {
  try {
    console.log("Getting regions");

    // Make API call to get regions
    const response = await api.get(`/regions`);

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch regions",
      };
    }
    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Get regions error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      return {
        success: false,
        error: responseData?.message || "Failed to fetch regions.",
      };
    }

    return {
      success: false,
      error: "Failed to fetch regions.",
    };
  }
}

// Server Action: Get Vote Names by Region
export async function getVoteNamesByRegion(regionId: string) {
  try {
    console.log("Getting vote names for region:", regionId);

    // Make API call to get vote names by region
    const response = await axios.get(
      `${API_BASE_URL}/vote-names/region/${regionId}`
    );

    if (!response.data.success) {
      return {
        success: false,
        error: response.data.message || "Failed to fetch workplaces",
      };
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Get vote names by region error:", error);

    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;
      return {
        success: false,
        error: responseData?.message || "Failed to fetch workplaces.",
      };
    }

    return {
      success: false,
      error: "Failed to fetch workplaces.",
    };
  }
}
