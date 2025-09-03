import type { AppRouteHandler } from "@/lib/types";
import { getPrisma } from "prisma/db";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { GetTrackingInfoRoute } from "./tracking.routes";

export const getInfo: AppRouteHandler<GetTrackingInfoRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { trackingNumber } = c.req.valid("param");

  try {
    const info = await prisma.userProfile.findUnique({
      where: { trackingNumber },
      select: {
        id: true,
        gender: true,
        dateOfBirth: true,
        ninNumber: true,
        workplaceAddress: true,
        category: true,
        memberNumber: true,
        trackingNumber: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            isVerified: true,
            status: true
          }
        }
      }
    });

    if (!info) {
      return c.json(
        {
          success: false,
          message: "Tracking Info Is Not Found",
          code: "INFO_NOT_FOUND" as const
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        ...info,
        updatedAt: info.updatedAt.toISOString()
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch information basing on tracking number",
        code: "FETCH_ERROR" as const
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
