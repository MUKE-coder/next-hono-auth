// hooks/useDeviceInfo.ts
"use client";

import { useState, useEffect } from "react";

interface DeviceInfo {
  device: string;
  ipAddress: string;
  userAgent: string;
  platform: string;
  browser: string;
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    device: "Unknown Device",
    ipAddress: "127.0.0.1",
    userAgent: "",
    platform: "Unknown",
    browser: "Unknown Browser",
  });

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        // Get user agent
        const userAgent = navigator.userAgent;

        // Parse browser info
        const browser = getBrowserInfo(userAgent);

        // Get platform info
        const platform = navigator.platform || "Unknown";

        // Create device string
        const device = `${browser} on ${platform}`;

        // Try to get IP address (this is limited in browsers for security reasons)
        let ipAddress = "127.0.0.1";
        try {
          // This is a simple way to get the user's public IP
          // In a real app, you might want to use a service like ipapi.co
          const response = await fetch("https://api.ipify.org?format=json");
          const data = await response.json();
          ipAddress = data.ip || "127.0.0.1";
        } catch (error) {
          console.log("Could not fetch IP address:", error);
        }

        setDeviceInfo({
          device,
          ipAddress,
          userAgent,
          platform,
          browser,
        });
      } catch (error) {
        console.error("Error getting device info:", error);
      }
    };

    getDeviceInfo();
  }, []);

  const getDeviceInfo = () => deviceInfo;

  return { deviceInfo, getDeviceInfo };
}

// Helper function to parse browser information
function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    return "Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  } else if (userAgent.includes("Edg")) {
    return "Edge";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "Opera";
  } else {
    return "Unknown Browser";
  }
}
