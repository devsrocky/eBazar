
class mailTemplates {

    OTPTemplate(Otp) {
        return `<!doctype html>
                <html lang="en">
                <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width" />
                <title>eBazar OTP</title>
                </head>

                <body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">

                <!-- Wrapper -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" 
                    style="
                        width:100%;
                        max-width:600px;
                        margin:0 auto;
                        background:#ffffff;
                        border-radius:12px;
                        padding:40px 30px;
                        text-align:center;
                        box-shadow:0 4px 12px rgba(0,0,0,0.08);
                    ">
                    <tr>
                    <td align="center">

                        <!-- Card -->
                        <table width="600" cellspacing="0" cellpadding="0" 
                            style="background:#ffffff; border-radius:12px; padding:40px 30px;
                                    box-shadow:0 4px 12px rgba(0,0,0,0.08); text-align:center;">

                        <!-- Title -->
                        <tr>
                            <td style="font-size:22px; font-weight:bold; color:#1e1e1e; padding-bottom:10px;">
                            eBazar Shop — Your OTP
                            </td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                            <td style="font-size:15px; color:#555; padding-bottom:20px;">
                            Hello <strong>Sir</strong>,
                            </td>
                        </tr>

                        <!-- Message -->
                        <tr>
                            <td style="font-size:14px; color:#666; line-height:1.6; padding-bottom:25px;">
                            Use the following OTP to complete your action on eBazar Shop.
                            </td>
                        </tr>

                        <!-- OTP Box -->
                        <tr>
                            <td>
                            <div style="
                                display:inline-block;
                                padding:18px 28px;
                                border-radius:10px;
                                background:#eef2ff;
                                border:1px solid #d4dafe;
                                font-size:32px;
                                letter-spacing:6px;
                                font-weight:700;
                                color:#3740ff;">
                                ${Otp}
                            </div>

                            <div style="font-size:12px; color:#888; margin-top:10px;">
                                Expires in 45 minutes
                            </div>
                            </td>
                        </tr>

                        <!-- Button -->
                        <tr>
                            <td style="padding:30px 0 25px 0;">
                            <a href="{{verify_link}}" 
                                style="
                                background:#3b82f6;
                                color:#ffffff;
                                padding:12px 24px;
                                border-radius:8px;
                                text-decoration:none;
                                font-size:15px;
                                font-weight:600;
                                display:inline-block;
                                box-shadow:0 2px 6px rgba(59,130,246,0.4);
                                ">
                                Verify OTP on eBazar
                            </a>
                            </td>
                        </tr>

                        <!-- Footer Text -->
                        <tr>
                            <td style="font-size:13px; color:#777; padding-bottom:10px; line-height:1.5;">
                            If you didn’t request this, ignore this email or contact support:<br>
                            <a href="mailto:{{support_email}}" 
                                style="color:#3b82f6; text-decoration:none; font-weight:600;">
                                https://devs-rocky.netlify.app
                            </a>
                            </td>
                        </tr>

                        <!-- Footer Copyright -->
                        <tr>
                            <td style="font-size:12px; color:#aaa; padding-top:20px;">
                            © 2025 eBazar Shop. All rights reserved.
                            </td>
                        </tr>

                        </table>
                        <!-- End card -->

                    </td>
                    </tr>
                </table>
                <!-- End wrapper -->

                </body>
                </html>
                `
    }

}

module.exports = mailTemplates;