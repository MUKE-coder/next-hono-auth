import {
  getStudentWelcomeEmailSubject,
  StudentWelcomeEmailData,
  StudentWelcomeEmailTemplate
} from "./StudentWelcomeEmailTemplate";
import { Resend } from "resend";

export class StudentEmailService {
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
    emailData: StudentWelcomeEmailData
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // Validate email data
      if (!emailData.email || !emailData.schoolName || !emailData.studentName) {
        console.error("Invalid email data:", emailData);
        return { success: false, error: "Invalid email data provided" };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.email)) {
        console.error("Invalid email format:", emailData.email);
        return { success: false, error: "Invalid email format" };
      }

      // Use provided loginUrl or generate one
      const loginUrl =
        emailData.loginUrl || this.generateLoginUrl(emailData.subdomain);

      // Create email data with login URL and root domain
      const emailDataWithUrl = {
        ...emailData,
        loginUrl,
        rootDomain: emailData.rootDomain || this.rootDomain
      };

      const htmlContent = StudentWelcomeEmailTemplate(emailDataWithUrl);
      const subject = getStudentWelcomeEmailSubject(emailData.schoolName);

      console.log("Sending student welcome email with payload:", {
        from: this.fromEmail,
        to: emailData.email,
        subject,
        hasHtmlContent: !!htmlContent,
        htmlContentLength: htmlContent?.length || 0,
        studentName: emailData.studentName,
        studentNumber: emailData.studentNumber,
        loginUrl,
        apiKeyPrefix: this.apiKey.substring(0, 8) + "..."
      });

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: emailData.email,
        subject,
        html: htmlContent
      });

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to send student welcome email"
        };
      }

      // console.log("Student welcome email sent successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error sending student welcome email:", error);

      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          return { success: false, error: "Invalid API key" };
        }
        if (error.message.includes("rate limit")) {
          return { success: false, error: "Rate limit exceeded" };
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
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      };
    }
  }

  // Add the method that your handler might be calling
  async sendWelcomeEmailWithFetch(
    emailData: StudentWelcomeEmailData
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    return this.sendWelcomeEmail(emailData);
  }

  // Helper method to generate login URL
  private generateLoginUrl(subdomain: string): string {
    if (!subdomain) {
      throw new Error("Subdomain is required");
    }
    return `http://${subdomain}.${this.rootDomain}/auth/login`;
  }
}

// Export helper functions
export const generateLoginUrl = (
  subdomain: string,
  rootDomain?: string
): string => {
  if (!subdomain) {
    throw new Error("Subdomain is required");
  }
  const domain =
    rootDomain || process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";
  return `http://${subdomain}.${domain}/auth/login`;
};

export const generateSecurePassword = (length: number = 12): string => {
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
