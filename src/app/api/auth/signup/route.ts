import bcrypyjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendMail } from "@/helpers/mailer";
import { connect } from "@/db/dbConfig";

connect();

// connect();

export const POST = async (req: NextRequest) => {
  try {
    const { username, email, password } = await req.json();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const slat = await bcrypyjs.genSalt(10);
    const hashedPassword = await bcrypyjs.hash(password, slat);

    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
    }).save();

    if (!newUser) {
      return NextResponse.json({ error: "User not created" }, { status: 500 });
    }

    const aa = await sendMail({
      email,
      emailType: "VERIFY",
      userId: newUser._id,
    });
    console.log(aa);

    return NextResponse.json(
      {
        message: "Please verify your email.",
        user: newUser,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
