const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Verification</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333333;
          font-size: 24px;
          text-align: center;
        }
        p {
          font-size: 16px;
          color: #555555;
        }
        .otp-code {
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
          color: #ff5722;
        }
        .validity {
          font-size: 14px;
          color: #777777;
          text-align: center;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Your OTP Code</h1>
        <p>Dear User,</p>
        <p>Please use the following One Time Password (OTP) to complete your request. The OTP is valid for 5 minutes.</p>
        <div class="otp-code">${otp}</div>
        <div class="footer">
          <p>&copy; 2024 PixelElite. All Rights Reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  const res = await transporter.sendMail(mailOptions);
};
