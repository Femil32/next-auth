import bcrypyjs from "bcryptjs";
import nodemailer from "nodemailer";
import User from "@/models/userModel";

interface MailerProps {
  email: string;
  emailType: "RESET" | "VERIFY";
  userId: string;
}

export const sendMail = async ({ email, emailType, userId }: MailerProps) => {
  try {
    const hashedToken = await bcrypyjs.hashSync(userId.toString(), 10);

    switch (emailType) {
      case "RESET":
        await User.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        });
        break;
      case "VERIFY":
        await User.findByIdAndUpdate(userId, {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        });
        break;
    }
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "demo@demo.demo",
      to: email,
      subject: emailType === "RESET" ? "Reset Password" : "Verify Email",
      html: `<p>Click <a href="${process.env.DOMAIN}/auth/${
        emailType === "VERIFY" ? "verify-email" : "reset-password"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or
      <br />
      <br />
      <p>Copy this link and paste it in your browser: ${
        process.env.DOMAIN
      }/auth/${
        emailType === "VERIFY" ? "verify-email" : "reset-password"
      }?token=${hashedToken}


      </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
