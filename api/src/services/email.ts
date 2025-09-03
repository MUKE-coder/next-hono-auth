import {
  getWelcomeEmailSubject,
  WelcomeAdminEmailData,
  WelcomeAdminEmailTemplate
} from "./WelcomeAdminEmailTemplate";
import { Resend } from "resend";

export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private apiKey: string;
  private rootDomain: string;

  constructor(
    apiKey: string,
    fromEmail: string = "Lectify <info@lubegajovan.com>",
    rootDomain?: string
  ) {
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is required");
    }

    if (!apiKey.startsWith("re_")) {
      throw new Error(
        "Invalid RESEND_API_KEY format - should start with 're_'"
      );
    }

    this.apiKey = apiKey;
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
    this.rootDomain =
      rootDomain || process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  }

  async sendWelcomeEmail(
    emailData: WelcomeAdminEmailData
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // Enhanced validation
      if (!emailData.email || !emailData.schoolName || !emailData.adminName) {
        console.error("Missing required email data:", {
          hasEmail: !!emailData.email,
          hasSchoolName: !!emailData.schoolName,
          hasAdminName: !!emailData.adminName
        });
        return { success: false, error: "Missing required email data" };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.email)) {
        console.error("Invalid email format:", emailData.email);
        return { success: false, error: "Invalid email format" };
      }

      // Ensure subdomain is provided
      if (!emailData.subdomain) {
        console.error("Subdomain is required for email");
        return { success: false, error: "Subdomain is required" };
      }

      // Generate login URL with fallback
      const loginUrl =
        emailData.loginUrl || this.generateLoginUrl(emailData.subdomain);

      // Create complete email data
      const completeEmailData = {
        ...emailData,
        loginUrl,
        rootDomain: this.rootDomain,
        // Ensure password is provided
        password: emailData.password || "DefaultPassword123!"
      };

      // Generate email content
      const htmlContent = WelcomeAdminEmailTemplate(completeEmailData);
      const subject = getWelcomeEmailSubject(emailData.schoolName);

      // Enhanced logging
      console.log("Preparing to send email:", {
        from: this.fromEmail,
        to: emailData.email,
        subject,
        subdomain: emailData.subdomain,
        hasHtmlContent: !!htmlContent,
        htmlContentLength: htmlContent?.length || 0,
        loginUrl,
        apiKeyValid: this.apiKey.startsWith("re_"),
        rootDomain: this.rootDomain
      });

      // Send email with timeout
      const emailPromise = this.resend.emails.send({
        from: this.fromEmail,
        to: emailData.email,
        subject,
        html: htmlContent
      });

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email send timeout")), 10000)
      );

      const { data, error } = (await Promise.race([
        emailPromise,
        timeoutPromise
      ])) as any;

      if (error) {
        console.error("Resend API error:", {
          error,
          message: error.message,
          name: error.name
        });
        return {
          success: false,
          error: error.message || "Failed to send email"
        };
      }

      console.log("Email sent successfully:", {
        id: data?.id,
        to: emailData.email,
        subject
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error sending welcome email:", {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        emailData: {
          email: emailData.email,
          schoolName: emailData.schoolName,
          subdomain: emailData.subdomain
        }
      });

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes("timeout")) {
          return {
            success: false,
            error: "Email send timeout - please check connectivity"
          };
        }
        if (error.message.includes("API key")) {
          return { success: false, error: "Invalid API key configuration" };
        }
        if (error.message.includes("rate limit")) {
          return {
            success: false,
            error: "Rate limit exceeded - please try again later"
          };
        }
        if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          return {
            success: false,
            error: "Network error - please check connectivity"
          };
        }
        if (error.message.includes("Invalid email")) {
          return { success: false, error: "Invalid recipient email address" };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  // Alias method for backward compatibility
  async sendWelcomeEmailWithFetch(
    emailData: WelcomeAdminEmailData
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    return this.sendWelcomeEmail(emailData);
  }

  // Enhanced login URL generation with validation
  private generateLoginUrl(subdomain: string): string {
    if (!subdomain) {
      throw new Error("Subdomain is required for login URL generation");
    }

    // Clean subdomain
    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

    if (!cleanSubdomain) {
      throw new Error("Invalid subdomain format");
    }

    // Use https in production, http for localhost
    const protocol = this.rootDomain.includes("localhost") ? "http" : "https";
    return `${protocol}://${cleanSubdomain}.${this.rootDomain}/auth/login`;
  }
}

// Export helper functions with enhanced validation
export const generateLoginUrl = (
  subdomain: string,
  rootDomain?: string
): string => {
  if (!subdomain) {
    throw new Error("Subdomain is required");
  }

  const domain =
    rootDomain || process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

  if (!cleanSubdomain) {
    throw new Error("Invalid subdomain format");
  }

  const protocol = domain.includes("localhost") ? "http" : "https";
  return `${protocol}://${cleanSubdomain}.${domain}/auth/login`;
};

export const generateSecurePassword = (length: number = 12): string => {
  if (length < 8) {
    throw new Error("Password length must be at least 8 characters");
  }

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = "";

  // Ensure at least one character from each set
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};
