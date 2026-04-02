export const emailTemplate = {
    ResetPassword: (otp) => `
    <html>
        <head>
            <meta charset="UTF-8">
                <title>Reset Password - Frienz</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0;">
                <tr>
                    <td align="center">

                        <!-- Main Container -->
                        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

                            <!-- Heading -->
                            <tr>
                                <td align="center" style="font-size:22px; font-weight:bold; color:#333;">
                                    Reset Your Password
                                </td>
                            </tr>

                            <!-- Message -->
                            <tr>
                                <td align="center" style="padding:15px 0; font-size:14px; color:#555;">
                                    We received a request to reset your password for your <b>Frienz</b> account.
                                </td>
                            </tr>

                            <!-- OTP Box -->
                            <tr>
                                <td align="center">
                                    <div style="display:inline-block; background:#f1f5ff; color:#2b59ff; font-size:28px; font-weight:bold; letter-spacing:6px; padding:12px 24px; border-radius:8px;">
                                        ${otp}
                                    </div>
                                </td>
                            </tr>

                            <!-- Expiry -->
                            <tr>
                                <td align="center" style="padding-top:15px; font-size:13px; color:#888;">
                                    This OTP is valid for 15 minutes
                                </td>
                            </tr>

                            <!-- Warning -->
                            <tr>
                                <td align="center" style="font-size:12px; color:#999;">
                                    If you didn’t request this, you can safely ignore this email.
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" style="padding-top:20px; font-size:12px; color:#bbb;">
                                    © 2026 Frienz. All rights reserved.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
    </html>`
}

// < !--Logo -->
//     <tr>
//         <td align="center" style="padding-bottom:20px;">
//             <img src="https://yourdomain.com/logo.png" alt="Frienz Logo" width="120" />
//         </td>
//     </tr>