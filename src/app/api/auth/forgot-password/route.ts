import bcrypyjs from "bcryptjs";
import { connect } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import { sendMail } from "@/helpers/mailer";

connect();

export const POST = async (req: NextResponse) => {
  try {
    const { email } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // const hashedToken = bcrypyjs.hashSync(user._id.toString(), 10);

    // user.forgotPasswordToken = hashedToken;
    // user.forgotPasswordTokenExpiry = Date.now() + 3600000;

    console.log("forgot", user);

    await user.save();

    const sendmail = await sendMail({
      email,
      emailType: "RESET",
      userId: user._id,
    });

    if (!sendmail) {
      return NextResponse.json(
        {
          message: "Email not sent",
          email,
          success: false,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        message: "Email sent successfully",
        email,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
