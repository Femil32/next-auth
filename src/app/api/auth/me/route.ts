import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/db/dbConfig";

connect();

export const GET = async (req: NextRequest) => {
  try {
    const decodedToken = await getDataFromToken(req);

    if (!decodedToken) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id }: any = decodedToken;

    const user = await User.findById(id).select("-password");

    return NextResponse.json({
      user,
      success: true,
      message: "User found successfully",
    });
    console.log(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
