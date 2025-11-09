const db=`${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose";
mongoose.connect(db);

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import SlugInterface from "@/interface/slug.interface";

export const GET = async (req: NextRequest, context: SlugInterface) => {
  try {
    const { slug } = await context.params;
    console.log(slug)
    const product = await ProductModel.findOne({ slug });
    if (!product)
      return res.json(
        { message: "Product not found with the slug" },
        { status: 404 }
      );
    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const PUT = async (req: NextRequest, { params }: SlugInterface) => {
  try {
    const { slug: id } = await params;
    const body = await req.json();
    const product = await ProductModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!product)
      return res.json(
        { message: "Product not found with the id" },
        { status: 404 }
      );
    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const DELETE = async (req: NextRequest, { params }: SlugInterface) => {
  try {
    const { slug: id } = await params;

    const product = await ProductModel.findByIdAndDelete(id);

    if (!product)
      return res.json(
        { message: "Product not found with the id" },
        { status: 404 }
      );
    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};
