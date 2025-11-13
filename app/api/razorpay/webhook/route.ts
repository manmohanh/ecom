import { NextRequest, NextResponse as res } from "next/server";
import crypto from "crypto";
import serverCatchError from "@/lib/server-catch-error";

export const POST = async (req: NextRequest) => {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.json();

    const mySignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== mySignature) {
      return res.json({ message: "Invalid status" }, { status: 400 });
    }

    if (
      body.event === "payment.authorized" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("payment success");
    }

    if (body.event === "payment.captured") {
      console.log("payment success");
    }

    if (body.event === "payment.failed") {
      console.log("payment failed");
    }

    return res.json({ success: true });
  } catch (error) {
    return serverCatchError(error);
  }
};
