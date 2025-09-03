/* eslint-disable style/comma-dangle */
/* eslint-disable style/brace-style */
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { getPrisma } from "prisma/db";

import type { CreateRoute, ListRoute } from "./logs.routes";

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = c.req.valid("json");

  try {
    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
      select: { id: true }
    });

    if (!userExists) {
      return c.json(
        {
          message: "User not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const userLog = await prisma.userLog.create({
      data: {
        name: data.name,
        activity: data.activity,
        time: data.time || new Date().toISOString(),
        ipAddress: data.ipAddress,
        device: data.device,
        userId: data.userId
      }
    });

    return c.json(
      {
        id: userLog.id,
        message: "User log created successfully"
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating user log:", error);
    return c.json(
      {
        message: "Failed to create user log"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { userId } = c.req.valid("param");
  const query = c.req.valid("query");

  const { days = 90 } = query;

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      return c.json(
        {
          message: "User not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Calculate the date cutoff
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const logs = await prisma.userLog.findMany({
      where: {
        userId,
        createdAt: {
          gte: cutoffDate
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return c.json(logs, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    return c.json(
      {
        message: "Failed to fetch user logs"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
