import { connect } from "@/db/dbConfig";
import bcrypyjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

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

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
