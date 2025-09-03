export interface StudentWelcomeEmailData {
  studentName: string
  schoolName: string
  email: string
  studentNumber: string
  password: string // Add this field
  subdomain: string
  rootDomain?: string
  loginUrl?: string
}

export function getStudentWelcomeEmailSubject(schoolName: string): string {
  return `Welcome to ${schoolName} - Your Student Account is Ready!`
}

export function StudentWelcomeEmailTemplate(data: StudentWelcomeEmailData): string {
  const { studentName, schoolName, email, studentNumber, password, loginUrl, rootDomain } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${schoolName}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #007bff;
            }
            .header h1 {
                color: #007bff;
                margin: 0;
            }
            .content {
                margin-bottom: 30px;
            }
            .credentials {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 5px;
                margin: 20px 0;
                border-left: 4px solid #007bff;
            }
            .credentials h3 {
                margin-top: 0;
                color: #007bff;
            }
            .credential-item {
                margin: 10px 0;
                padding: 8px;
                background-color: white;
                border-radius: 3px;
            }
            .credential-label {
                font-weight: bold;
                color: #555;
            }
            .credential-value {
                font-family: monospace;
                background-color: #e9ecef;
                padding: 4px 8px;
                border-radius: 3px;
                margin-left: 10px;
            }
            .login-button {
                display: inline-block;
                background-color: #007bff;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: bold;
            }
            .login-button:hover {
                background-color: #0056b3;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                font-size: 14px;
                color: #666;
            }
            .important-note {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            .important-note h4 {
                margin-top: 0;
                color: #856404;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 Welcome to ${schoolName}!</h1>
                <p>Your admission has been approved</p>
            </div>
            
            <div class="content">
                <p>Dear <strong>${studentName}</strong>,</p>
                
                <p>Congratulations! Your admission to <strong>${schoolName}</strong> has been approved. We are excited to welcome you to our academic community.</p>
                
                <div class="credentials">
                    <h3>🔐 Your Login Credentials</h3>
                    <div class="credential-item">
                        <span class="credential-label">Student Number:</span>
                        <span class="credential-value">${studentNumber}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">${email}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Temporary Password:</span>
                        <span class="credential-value">${password}</span>
                    </div>
                </div>
                
                <div class="important-note">
                    <h4>⚠️ Important Security Notice</h4>
                    <p>Please change your password immediately after your first login for security purposes. Keep your login credentials safe and do not share them with anyone.</p>
                </div>
                
                <div style="text-align: center;">
                    <a href="${loginUrl}" class="login-button">🚀 Login to Your Account</a>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Click the login button above or visit: <a href="${loginUrl}">${loginUrl}</a></li>
                    <li>Use your email and temporary password to log in</li>
                    <li>Change your password immediately after login</li>
                    <li>Complete your student profile</li>
                    <li>Check for important announcements and course information</li>
                </ol>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our student support team.</p>
                
                <p>Welcome aboard, and we look forward to your success at ${schoolName}!</p>
            </div>
            
            <div class="footer">
                <p><strong>${schoolName}</strong><br>
                Student Portal: <a href="${loginUrl}">${loginUrl}</a><br>
                This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `
}
