import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db/dbConfig";

connect();
export const GET = async (req: NextRequest) => {
  try {
    const response = NextResponse.json(
      {
        message: "User logged out successfully",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
