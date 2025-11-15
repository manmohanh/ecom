import { NextRequest, NextResponse as res } from "next/server";
import crypto from "crypto";
import serverCatchError from "@/lib/server-catch-error";
import OrderModel from "@/models/order.model";
import PaymentModel from "@/models/payment.model";
import fs from "fs";
import moment from "moment";
import CartModel from "@/models/cart.model";

interface CreateOrderInterface {
  user: string;
  products: string[];
  prices: string[];
  discounts: string[];
}

interface CreatePaymentInterface {
  user: string;
  order: string;
  paymentId: string;
  vendor?: "razorpay" | "stripe";
}

interface DeleteCartsInterface {
  user: string;
  products: string[];
}

const createLogs = (err: unknown, service: string) => {
  if (err instanceof Error) {
    const dateTime = moment().format("dd-mm-yyyy-hh-mm-ss-A");
    fs.writeFileSync(`logs/${service}-err-logs-${dateTime}.txt`, err.message);
    return false;
  }
};

const createOrder = async (order: CreateOrderInterface) => {
  try {
    const { _id } = await OrderModel.create(order);
    return _id;
  } catch (err) {
    return createLogs(err, "order");
  }
};

const createPayment = async (payment: CreatePaymentInterface) => {
  try {
    await PaymentModel.create(payment);
    return true;
  } catch (err) {
    return createLogs(err, "payment");
  }
};

export const deleteCarts = async (carts: DeleteCartsInterface) => {
  try {
    const query = carts.products.map((id) => ({
      user: carts.user,
      product: id,
    }));
    await CartModel.deleteMany({$or:query});
  } catch (err) {
    return createLogs(err, "delete-cart");
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    const body = await req.json();
    const user = body.payload.payment.entity.notes.user;
    const orders = JSON.parse(body.payload.payment.entity.notes.orders);

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
      const orderId = await createOrder({ user, ...orders });
    
      if (!orderId)
        return res.json({ success: "Failed to create order" }, { status: 424 });

      const payment = await createPayment({
        user,
        order: orderId,
        paymentId: body.payload.payment.entity.id,
      });

      if (!payment)
        return res.json(
          { message: "Failed to create payment" },
          { status: 424 }
        );

      await deleteCarts({ user, products: orders.products });
      return res.json({ success: true });
    }

    // if (body.event === "payment.captured") {
    //   const orderId = await createOrder({ user, ...orders });
    //   if (!orderId)
    //     return res.json({ success: "Failed to create order" }, { status: 424 });

    //   const payment = await createPayment({
    //     user,
    //     order: orderId,
    //     paymentId: body.payload.payment.entity.id,
    //   });

    //   if (!payment)
    //     return res.json(
    //       { message: "Failed to create payment" },
    //       { status: 424 }
    //     );

    //   return res.json({ success: true });
    // }

    if (body.event === "payment.failed") {
      console.log("payment failed");
    }

    return res.json({ success: true });
  } catch (error) {
    return serverCatchError(error);
  }
};
