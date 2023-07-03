import bcrypyjs from "bcryptjs";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req: NextResponse) => {
  try {
    const { password, token } = await req.json();
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid token",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    const hasedPassword = await bcrypyjs.hashSync(password, 10);

    user.password = hasedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      {
        message: "Password reset successfully",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
};
