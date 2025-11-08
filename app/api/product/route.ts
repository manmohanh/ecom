import mongoose from "mongoose";
mongoose.connect(process.env.DB!);

import serverCatchError from "@/lib/server-catch-error";
import { NextRequest, NextResponse as res } from "next/server";
import ProductModel from "@/models/product.model";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.formData();
    const file = body.get("image") as File | null;
    if (!file)
      return res.json({ message: "product image not sent" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const root = process.cwd();
    const folder = path.join(root, "public", "products");
    const fileName = `${uuid()}.png`;
    const filePath = path.join(folder, fileName);

    fs.writeFileSync(filePath, buffer);

    const payload = {
      title: body.get("title"),
      description: body.get("description"),
      price: body.get("price"),
      discount: body.get("discount"),
      quantity: body.get("quantity"),
      image: `/products/${fileName}`,
    };

    const product = await ProductModel.create(payload);

    return res.json(product);
  } catch (err) {
    return serverCatchError(err);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 6;
    const skip = (page - 1) * limit;

    const total = await ProductModel.countDocuments();

    if (search) {
      const products = await ProductModel.find({ title: RegExp(search, "i") })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return res.json({ total, data: products });
    }

    if (slug) {
      const slugs = await ProductModel.distinct("slug");
      return res.json(slugs);
    }

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({ total, data: products });
  } catch (err) {
    return serverCatchError(err);
  }
};
