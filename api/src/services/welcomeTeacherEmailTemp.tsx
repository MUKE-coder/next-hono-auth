/* eslint-disable style/comma-dangle */

export interface WelcomeTeacherEmailData {
  teacherName: string;
  schoolName: string;
  subdomain: string;
  email: string;
  password: string;
  loginUrl: string;
  rootDomain: any;
  isLocal?: boolean;
}

export const WelcomeTeacherEmailTemplate = ({
  teacherName,
  schoolName,
  email,
  password,
  loginUrl
}: WelcomeTeacherEmailData): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>🎉 Welcome to  ${schoolName}s</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Responsive styles */
        @media only screen and (max-width: 640px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
            .email-content {
                padding: 20px !important;
            }
            .header-content {
                padding: 40px 20px 30px 20px !important;
            }
            .main-content {
                padding: 30px 20px !important;
            }
            .credentials-section {
                padding: 0 20px 20px 20px !important;
            }
            .features-section {
                padding: 0 20px 30px 20px !important;
            }
            .cta-section {
                padding: 0 20px 40px 20px !important;
            }
            .support-section {
                padding: 0 20px 30px 20px !important;
            }
            .footer-section {
                padding: 30px 20px !important;
            }
            .credentials-table {
                padding: 20px !important;
            }
            .credential-row {
                display: block !important;
                width: 100% !important;
                margin-bottom: 16px !important;
            }
            .credential-label {
                display: block !important;
                width: 100% !important;
                margin-bottom: 8px !important;
            }
            .credential-value {
                display: block !important;
                width: 100% !important;
            }
            .feature-icon {
                width: 28px !important;
                height: 28px !important;
                margin-right: 12px !important;
            }
            .feature-content {
                padding-left: 12px !important;
            }
            .social-links {
                margin: 0 auto 20px auto !important;
            }
            .social-link {
                width: 36px !important;
                height: 36px !important;
                line-height: 36px !important;
                font-size: 14px !important;
                margin: 0 6px !important;
            }
            .logo-icon {
                width: 60px !important;
                height: 60px !important;
                margin: 0 auto 20px auto !important;
            }
            .logo-emoji {
                font-size: 28px !important;
            }
            .main-title {
                font-size: 28px !important;
                margin-bottom: 8px !important;
            }
            .main-subtitle {
                font-size: 18px !important;
            }
            .welcome-title {
                font-size: 24px !important;
            }
            .welcome-text {
                font-size: 16px !important;
            }
            .credentials-title {
                font-size: 20px !important;
            }
            .features-title {
                font-size: 20px !important;
            }
            .feature-title {
                font-size: 16px !important;
            }
            .feature-description {
                font-size: 14px !important;
            }
            .cta-button {
                padding: 18px 32px !important;
                font-size: 16px !important;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1a1a1a !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    
    <!-- Preheader Text -->
    <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
        Your ${schoolName} dashboard is ready! Access your admin panel with your credentials.
    </div>
    
    <!-- Main Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f1f5f9; padding: 20px 10px;" class="email-container">
        <tr>
            <td align="center">
                <!-- Email Content Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); overflow: hidden; margin: 0 auto;" class="email-content">
                    
                    <!-- Header Section with Enhanced Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%); padding: 60px 40px 50px 40px; text-align: center; position: relative;" class="header-content">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Logo/Icon -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td align="center">
                                                    <div style="width: 80px; height: 80px; background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; margin: 0 auto 24px auto; display: table-cell; vertical-align: middle; text-align: center; backdrop-filter: blur(10px);" class="logo-icon">
                                                        <span style="font-size: 36px; line-height: 1; display: inline-block; vertical-align: middle;" class="logo-emoji">🎓</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <h1 style="margin: 0 0 12px 0; color: #ffffff; font-size: 36px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" class="main-title">
                                            Welcome to 
                                        </h1>
                                        <p style="margin: 0 0 8px 0; color: #e0e7ff; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;" class="main-subtitle">
                                           ${schoolName}
                                        </p>
                                        <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #fbbf24, #f59e0b); border-radius: 2px; margin: 16px auto 0 auto;"></div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message Section -->
                    <tr>
                        <td style="padding: 50px 40px 30px 40px;" class="main-content">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td>
                                        <h2 style="margin: 0 0 24px 0; color: #1e293b; font-size: 28px; font-weight: 700; line-height: 1.2;" class="welcome-title">
                                            Hello ${teacherName}! 👋
                                        </h2>
                                        <p style="margin: 0 0 32px 0; color: #475569; font-size: 18px; line-height: 1.7; font-weight: 400;" class="welcome-text">
                                            Congratulations!  You have been successfully registered in the <strong style="color: #6366f1; font-weight: 700;">${schoolName}</strong> system. You now have access to all the powerful features of the System like seeng your schedules and more.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Login Credentials Section -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;" class="credentials-section">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; padding: 32px; border: 2px solid #e2e8f0;" class="credentials-table">
                                <tr>
                                    <td>
                                        <h3 style="margin: 0 0 24px 0; color: #1e293b; font-size: 22px; font-weight: 700; text-align: center;" class="credentials-title">
                                            🔐 Your Login Credentials
                                        </h3>
                                        
                                        <!-- Credentials Table -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                            <tr>
                                                <td style="padding: 20px 24px; border-bottom: 1px solid #f1f5f9;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="credential-row">
                                                        <tr>
                                                            <td style="width: 120px; vertical-align: top;" class="credential-label">
                                                                <span style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                                    School URL
                                                                </span>
                                                            </td>
                                                            <td class="credential-value">
                                                                <span style="color: #1e293b; font-size: 16px; font-weight: 600; word-break: break-all;">
                                                                    ${loginUrl}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 24px; border-bottom: 1px solid #f1f5f9;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="credential-row">
                                                        <tr>
                                                            <td style="width: 120px; vertical-align: top;" class="credential-label">
                                                                <span style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                                    Email
                                                                </span>
                                                            </td>
                                                            <td class="credential-value">
                                                                <span style="color: #1e293b; font-size: 16px; font-weight: 600; word-break: break-all;">
                                                                    ${email}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 20px 24px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="credential-row">
                                                        <tr>
                                                            <td style="width: 120px; vertical-align: top;" class="credential-label">
                                                                <span style="color: #64748b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                                    Password
                                                                </span>
                                                            </td>
                                                            <td class="credential-value">
                                                                <span style="color: #1e293b; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace; background-color: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0; display: inline-block;">
                                                                    ${password}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Features Section -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;" class="features-section">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%); border-radius: 16px; padding: 36px; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td>
                                        <h3 style="margin: 0 0 28px 0; color: #1e293b; font-size: 24px; font-weight: 700; text-align: center;" class="features-title">
                                            🚀 What you can do now
                                        </h3>
                                        
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="48" style="vertical-align: top; padding-top: 2px;">
                                                                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto; display: table-cell; vertical-align: middle; text-align: center; box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);" class="feature-icon">
                                                                    <span style="color: #ffffff; font-size: 16px; font-weight: 700; display: inline-block; vertical-align: middle;">✓</span>
                                                                </div>
                                                            </td>
                                                            <td style="padding-left: 16px; vertical-align: top;" class="feature-content">
                                                                <h4 style="margin: 0 0 4px 0; color: #1e293b; font-size: 18px; font-weight: 600;" class="feature-title">
                                                                    Manage Your schedules Efficiently
                                                                </h4>
                                                                <p style="margin: 0; color: #64748b; font-size: 15px; line-height: 1.5;" class="feature-description">
                                                                    See your students, classes, and more in the line of that
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding-bottom: 20px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                        <tr>
                                                            <td width="48" style="vertical-align: top; padding-top: 2px;">
                                                                <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; margin: 0 auto; display: table-cell; vertical-align: middle; text-align: center; box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);" class="feature-icon">
                                                                    <span style="color: #ffffff; font-size: 16px; font-weight: 700; display: inline-block; vertical-align: middle;">📚</span>
                                                                </div>
                                                            </td>
                                                                                                                    </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                
                    </tr>
                    
                    <!-- CTA Button Section -->
                    <tr>
                        <td style="padding: 0 40px 50px 40px;" align="center" class="cta-section">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 12px; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4); transition: all 0.3s ease;">
                                        <a href="${loginUrl}" style="display: inline-block; padding: 20px 40px; color: #ffffff; text-decoration: none; font-size: 18px; font-weight: 700; text-align: center; letter-spacing: 0.5px; border-radius: 12px; transition: all 0.3s ease;" class="cta-button">
                                            🚀 Access Your Dashboard Now
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0 0; color: #64748b; font-size: 14px; text-align: center;">
                                Or copy and paste this URL into your browser:<br>
                                <a href="${loginUrl}" style="color: #6366f1; text-decoration: none; font-weight: 500; word-break: break-all;">${loginUrl}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Support Section -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;" class="support-section">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #f59e0b;">
                                <tr>
                                    <td>
                                        <h4 style="margin: 0 0 12px 0; color: #92400e; font-size: 18px; font-weight: 700;">
                                            💡 Need Help Getting Started?
                                        </h4>
                                        <p style="margin: 0; color: #78350f; font-size: 15px; line-height: 1.6;">
                                            Our dedicated support team is here to help you make the most of Lectify MultiSchool. Don't hesitate to reach out!
                                        </p>
                                        <p style="margin: 12px 0 0 0; color: #78350f; font-size: 15px; font-weight: 600;">
                                            📧 <a href="mailto:support@lectify.com" style="color: #92400e; text-decoration: none;">support@lectify.com</a> | 
                                            📞 <span style="color: #92400e;">+1 (555) 123-4567</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 40px; border-top: 1px solid #e2e8f0;" class="footer-section">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                            <tr>
                                                <td>
                                                    <p style="margin: 0 0 16px 0; color: #475569; font-size: 18px; font-weight: 600; text-align: center;">
                                                        Best regards,
                                                    </p>
                                                    <p style="margin: 0 0 24px 0; text-align: center;">
                                                        <span style="color: #6366f1; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">The Lectify Team</span>
                                                    </p>
                                                    
                                                    <!-- Social Links -->
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 24px auto;" class="social-links">
                                                        <tr>
                                                            <td style="padding: 0 8px;">
                                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #6366f1; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 16px;" class="social-link">📘</a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #1da1f2; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 16px;" class="social-link">🐦</a>
                                                            </td>
                                                            <td style="padding: 0 8px;">
                                                                <a href="#" style="display: inline-block; width: 40px; height: 40px; background-color: #0077b5; border-radius: 50%; text-align: center; line-height: 40px; color: #ffffff; text-decoration: none; font-size: 16px;" class="social-link">💼</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <p style="margin: 0; color: #94a3b8; font-size: 13px; line-height: 1.6; text-align: center;">
                                                        This email was sent because you registered for Lectify MultiSchool.<br>
                                                        If you have any questions, please don't hesitate to contact our support team.<br><br>
                                                        <span style="color: #64748b; font-weight: 500;">© 2024 Lectify MultiSchool. All rights reserved.</span>
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`.trim();
};

export const getWelcomeEmailSubject = (schoolName: string): string => {
  return `🎉 Welcome to  ${schoolName}, Registration Complete!`;
};
