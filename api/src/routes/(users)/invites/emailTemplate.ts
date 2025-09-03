export function createAdminInvitationTemplate(role: string, link: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UNMU Admin Invitation</title>
    <style>
        /* Reset and base styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #FF0000 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin: 0;
            letter-spacing: 2px;
        }
        
        .tagline {
            color: #e8e8ff;
            font-size: 14px;
            margin: 8px 0 0 0;
            opacity: 0.9;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        
        .main-text {
            font-size: 16px;
            line-height: 1.6;
            color: #555555;
            margin-bottom: 20px;
        }
        
        .role-highlight {
            background-color: #f8f9fa;
            border-left: 4px solid #FF0000;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        
        .role-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin: 0 0 10px 0;
        }
        
        .role-description {
            color: #666666;
            font-size: 14px;
            margin: 0;
        }
        
        /* CTA Button */
        .cta-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #FF0000 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        /* Features list */
        .features {
            margin: 30px 0;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            background-color: #FF0000;
            border-radius: 50%;
            margin-right: 12px;
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .feature-icon::after {
            content: "✓";
            display: block;
            color: white;
            font-size: 12px;
            text-align: center;
            line-height: 20px;
        }
        
        .feature-text {
            font-size: 14px;
            color: #555555;
        }
        
        /* Footer */
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer-text {
            font-size: 13px;
            color: #6c757d;
            margin: 0 0 10px 0;
        }
        
        .footer-link {
            color: #FF0000;
            text-decoration: none;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                max-width: none;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .logo {
                font-size: 28px;
            }
            
            .greeting {
                font-size: 16px;
            }
            
            .main-text {
                font-size: 15px;
            }
            
            .cta-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">UNMU</h1>
            <p class="tagline">Empowering Digital Excellence</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello, ${role},
            </div>
            
            <p class="main-text">
                We're excited to extend this exclusive invitation for you to join UNMU as an Administrator. Your expertise and leadership skills make you an ideal candidate for this important role in our growing platform.
            </p>
            
            <div class="role-highlight">
                <h3 class="role-title">🎯 Your New Administrator Role</h3>
                <p class="role-description">
                    As a UNMU Administrator, you'll have full access to manage users, oversee platform operations, and help shape the future of our community. This role comes with enhanced privileges and the opportunity to make a meaningful impact.
                </p>
            </div>
            
            <p class="main-text">
                Your administrator account will provide you with:
            </p>
            
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon"></div>
                    <div class="feature-text">Complete administrative dashboard access</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon"></div>
                    <div class="feature-text">User management and moderation tools</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon"></div>
                    <div class="feature-text">Advanced analytics and reporting features</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon"></div>
                    <div class="feature-text">Priority support and direct communication channels</div>
                </div>
            </div>
            
            <p class="main-text">
                Ready to get started? Click the button below to visit our platform and complete your administrator registration.
            </p>
            
            <div class="cta-container">
                <a href="${link}" class="cta-button">
                    Accept Invitation & Sign Up
                </a>
            </div>
            
            <p class="main-text">
                If you have any questions about your new role or need assistance during the setup process, please don't hesitate to reach out to our team. We're here to ensure your onboarding experience is smooth and successful.
            </p>
            
            <p class="main-text">
                Welcome to the UNMU team!
            </p>
            
            <p class="main-text" style="margin-top: 30px; font-weight: 500;">
                Best regards,<br>
                The UNMU Team
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                This invitation was sent to you because you've been selected as a UNMU Administrator.
            </p>
            <p class="footer-text">
                Need help? <a href="mailto:support@wesendall.com" class="footer-link">Contact our support team</a>
            </p>
            <p class="footer-text">
                © 2024 UNMU. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;
}
