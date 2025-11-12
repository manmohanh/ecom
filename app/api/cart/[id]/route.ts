const db = `${process.env.DB_URL}/${process.env.DB_NAME}`;
import IdInterface from "@/interface/id.interface";
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db);

import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import CartModel from "@/models/cart.model";

export const PUT = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = await req.json();

    let cart = null;

    if (body.qnt > 0)
      cart = await CartModel.findByIdAndUpdate(
        id,
        { qnt: body.qnt },
        { new: true }
      );
    else cart = await CartModel.findByIdAndDelete(id);

    if (!cart) return res.json({ message: "Cart not found" }, { status: 404 });

    return res.json(cart);
  } catch (error) {
    return serverCatchError(error);
  }
};

export const DELETE = async (req: NextRequest, context: IdInterface) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return res.json({ message: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "user")
      return res.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;

    const deleteProduct = await CartModel.findByIdAndDelete(id);

    if (!deleteProduct)
      return res.json({ message: "Product not found" }, { status: 404 });

    return res.json(deleteProduct);
  } catch (error) {
    return serverCatchError(error);
  }
};
