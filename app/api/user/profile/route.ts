const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import UserModel from "@/models/user.model";

export const PUT = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const id = session.user.id;
    const body = await req.json();
    delete body.email;
    delete body.role;
    delete body.password;
    const user = await UserModel.findByIdAndUpdate(id, body);

    if (!user) return res.json({ message: "User not found" }, { status: 404 });

    return res.json({ message: "Changes made successfully !" });
  } catch (error) {
    return serverCatchError(error);
  }
};
