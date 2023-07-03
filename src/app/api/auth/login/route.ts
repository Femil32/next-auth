import bcrypyjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { connect } from "@/db/dbConfig";

connect();

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypyjs.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid Password." }, { status: 400 });
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: "Please verify your email." },
        { status: 400 }
      );
    }

    const token = await jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    const response = NextResponse.json({
      message: "User logged in successfully",
      success: true,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
