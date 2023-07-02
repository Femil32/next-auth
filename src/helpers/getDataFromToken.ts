import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("token")?.value || "";
    if (!token) {
      return null;
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    return decodedToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
