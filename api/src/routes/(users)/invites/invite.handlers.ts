import type { AppRouteHandler } from "@/lib/types";
import { getPrisma } from "prisma/db";
import { Resend } from "resend";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createAdminInvitationTemplate } from "./emailTemplate";
import { CreateInviteRoute, GetInviteRoute } from "./invite.routes";

// Optimized client info helper
function getClientInfo(c: any) {
  const userAgent = c.req.header("User-Agent") || "Unknown";
  const ipAddress =
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
    c.req.header("X-Real-IP") ||
    c.req.header("CF-Connecting-IP") ||
    "Unknown";
  return { userAgent, ipAddress };
}

// Optimized helper function to log user activities
async function logUserActivity(
  prisma: any,
  userId: string,
  activity: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.userLog.create({
      data: {
        name: "System",
        activity,
        time: new Date().toISOString(),
        ipAddress: ipAddress || "Unknown",
        device: userAgent || "Unknown",
        userId
      }
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}

export const getInvite: AppRouteHandler<GetInviteRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  const { code } = c.req.valid("param");
  const { email } = c.req.valid("query");

  try {
    const invite = await prisma.invite.findFirst({
      where: { code, email }
    });

    if (!invite) {
      return c.json(
        {
          success: false,
          message: "Invite is not found or does not match email",
          code: "INFO_NOT_FOUND" as const
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        ...invite,
        updatedAt: invite.updatedAt.toISOString()
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error fetching invite info:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch invite information",
        code: "FETCH_ERROR" as const
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const createInvite: AppRouteHandler<CreateInviteRoute> = async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const data = c.req.valid("json");
  const { userAgent, ipAddress } = getClientInfo(c);
  const resend = new Resend(c.env.RESEND_API_KEY || "");

  const baseUrl = c.env.FRONTEND_URL;

  // send email after;
  const email = data.email;
  const role = data.role;

  try {
    // Validate unique fields
    const existingChecks = await Promise.all([
      prisma.invite.findUnique({
        where: { email },
        select: { id: true }
      })
    ]);

    const [existingEmail] = existingChecks;

    // first check if email is already used or assigned to auser
    const email_exists = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (email_exists) {
      return c.json(
        {
          success: false,
          message: "Email already is being used",
          code: "EMAIL_EXISTS" as const
        },
        HttpStatusCodes.CONFLICT
      );
    }

    if (existingEmail) {
      const link = `${baseUrl}/auth/admin/register?invitecode=${existingEmail.id}&email=${data.email}&role=ADMIN`;

      if (c.env.NODE_ENV === "development") {
        // In development, just log the link instead of sending an email
        console.log(`Invite link for ${data.email} 🟩: ${link}`);

        return c.json(
          {
            success: true,
            message: "Invite initiated (skipped email in development mode)",
            data: {
              // You might want to return some dummy data or an indicator
              id: "DEV_MODE_INVITE",
              invitedBy: "DEV_MODE_USER"
            }
          },
          HttpStatusCodes.CREATED
        );
      }

      const { error } = await resend.emails.send({
        from: "UNMU <invite@desishub.com>",
        to: [email],
        subject: "Invitation To Be Part Of UNMU",
        html: createAdminInvitationTemplate(role, link)
      });

      return c.json(
        {
          success: false,
          message:
            "We already sent you an invite. Please Check email, we have sent a new one.",
          code: "EMAIL_EXISTS" as const
        },
        HttpStatusCodes.CONFLICT
      );
    }

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        invitedBy: data.invitedBy,
        email: data.email,
        code: data.code,
        role: data.role
      },
      select: {
        id: true,
        invitedBy: true
      }
    });

    const link = `${baseUrl}/auth/admin/register?invitecode=${invite.id}&email=${data.email}&role=ADMIN`;

    if (c.env.NODE_ENV === "development") {
      // In development, just log the link instead of sending an email
      console.log(`Invite link for ${data.email} 🟩: ${link}`);

      return c.json(
        {
          success: true,
          message: "Invite initiated (skipped email in development mode)",
          data: {
            // You might want to return some dummy data or an indicator
            id: "DEV_MODE_INVITE",
            invitedBy: "DEV_MODE_USER"
          }
        },
        HttpStatusCodes.CREATED
      );
    }

    const { error } = await resend.emails.send({
      from: "UNMU <invite@desishub.com>",
      to: [email],
      subject: "Invitation To Be Part Of UNMU",
      html: createAdminInvitationTemplate(role, link)
    });

    if (error) {
      // console.error("Email send error:", error);
      return c.json(
        {
          success: false,
          message: `Failed to send email invite: , ${error}`,
          code: "RESEND_INVITE_ERROR" as const
        },
        HttpStatusCodes.NETWORK_AUTHENTICATION_REQUIRED
      );
    }

    // Log activity
    await logUserActivity(
      prisma,
      invite.invitedBy,
      `Invite has been initiated`,
      ipAddress,
      userAgent
    );
    return c.json(
      {
        success: true,
        message: "Invite has been initiated successfully",
        data: {
          id: invite.id,
          invitedBy: invite.invitedBy
        }
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating invite:", error);
    return c.json(
      {
        success: false,
        message: "Failed to create invite",
        code: "CREATE_INVITE_ERROR" as const
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
