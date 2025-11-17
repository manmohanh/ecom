const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import IdInterface from "@/interface/id.interface";
import serverCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const body = await req.json();

    await UserModel.findByIdAndUpdate({ _id: id }, { role: body.role });

    return res.json({ message: "Role changed!" });
  } catch (error) {
    return serverCatchError(error);
  }
};
