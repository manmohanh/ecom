const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import serverCatchError from "@/lib/server-catch-error";
import PaymentModel from "@/models/payment.model";
import mongoose, { model } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
mongoose.connect(db);

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const payment = await PaymentModel.create(body);
    return res.json(payment);
  } catch (error) {
    return serverCatchError(error);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "admin")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const payments = await PaymentModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "fullname email")
      // .populate({
      //   path: "order",
      //   populate: {
      //     path: "products",
      //     model: "Product",
      //   },
      // });
    return res.json(payments);
  } catch (error) {
    return serverCatchError(error);
  }
};
