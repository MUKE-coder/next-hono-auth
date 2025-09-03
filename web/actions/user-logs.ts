// actions/user-logs.ts
"use server";

import { getServerAccessToken, validateSession } from "./auth";

const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

// User Log interfaces
export interface UserLogCreateProps {
  name: string;
  activity: string;
  time?: string;
  ipAddress?: string | null;
  device?: string | null;
  userId: string;
}

export interface UserLog {
  id: string;
  name: string;
  activity: string;
  time: string;
  ipAddress: string | null;
  device: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to get device info
function getDeviceInfo() {
  // In a real implementation, you'd parse the User-Agent header from the request
  // For server actions, you might need to pass this from the client
  return {
    device: "Web Browser",
    ipAddress: "127.0.0.1", // Would be extracted from request headers
  };
}

// Create user log
export async function createUserLog(data: UserLogCreateProps) {
  try {
    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const deviceInfo = getDeviceInfo();

    const logData = {
      ...data,
      time: data.time || new Date().toISOString(),
      ipAddress: data.ipAddress || deviceInfo.ipAddress,
      device: data.device || deviceInfo.device,
    };

    const response = await fetch(`${API_BASE_URL}/user-logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user log");
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error creating user log:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create user log",
    };
  }
}

// Get user logs for a specific user
export async function getUserLogs(userId: string, days: number = 90) {
  try {
    // Validate session first (this will auto-refresh tokens if needed)
    const sessionValidation = await validateSession();

    if (!sessionValidation.isValid) {
      throw new Error("Invalid session - please login again");
    }

    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      throw new Error("No access token available");
    }

    const response = await fetch(
      `${API_BASE_URL}/user-logs/${userId}?days=${days}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();

      // If it's an auth error, the token might be invalid
      if (response.status === 401) {
        throw new Error("Authentication failed - please login again");
      }

      throw new Error(error.message || "Failed to fetch user logs");
    }

    const logs: UserLog[] = await response.json();

    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch user logs",
      data: [],
    };
  }
}

// Create login log (helper function)
export async function createLoginLog(
  userId: string,
  userName: string,
  deviceInfo?: { device?: string; ipAddress?: string }
) {
  const logData: UserLogCreateProps = {
    name: "User Login",
    activity: `${userName} logged into the system`,
    userId,
    time: new Date().toISOString(),
    device: deviceInfo?.device || "Web Browser",
    ipAddress: deviceInfo?.ipAddress || "127.0.0.1",
  };

  return await createUserLog(logData);
}
