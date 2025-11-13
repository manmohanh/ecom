"use client";
import clientCatchError from "@/lib/client-catch-error";
import calculatePrice from "@/lib/price-calculate";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Button } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC } from "react";

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  notes: any;
}
interface PaymentSuccessInterface {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PayInterface {
  data: any;
  onSuccess?: (payload: PaymentSuccessInterface) => void;
  onFailed?: (payload: any) => void;
}

const Pay: FC<PayInterface> = ({ data, onSuccess, onFailed }) => {
  const session = useSession();
  const { Razorpay } = useRazorpay();

  const getTotalAmout = () => {
    let sum = 0;
    for (let item of data) {
      const amount =
        calculatePrice(item.product.price, item.product.discount) * item.qnt;
      sum = sum + amount;
    }

    return sum;
  };

  const getOrderPayload = () => {
    const products = [];
    const prices = [];
    const discounts = [];

    for (let item of data) {
      products.push(item.product._id);
      prices.push(item.product.price);
      discounts.push(item.product.discount);
    }

    return {
      products,
      prices,
      discounts,
    };
  };

  const handleSuccess = (payload: PaymentSuccessInterface) => {
    if (onSuccess) return onSuccess(payload);

    return null;
  };

  const payNow = async () => {
    try {
      if (!session.data) throw new Error("Session not intialized");

      const payload = {
        amount: getTotalAmout(),
      };
      const { data } = await axios.post("/api/razorpay/order", payload);
      console.log(data);
      const options: ModifiedRazorpayInterface = {
        name: "Ecom shops",
        description: "Bulk prodcut",
        amount: data.amount,
        order_id: data.id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        currency: "INR",
        prefill: {
          name: session.data?.user.name as string,
          email: session.data.user.email as string,
        },
        notes: {
          name: session.data.user.name as string,
          user: session.data.user.id,
          orders: JSON.stringify(getOrderPayload()),
        },
        handler: handleSuccess,
      };
      const rzp = new Razorpay(options);

      if (onFailed) rzp.on("payment.failed", onFailed);

      rzp.open();
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <Button onClick={payNow} size="large" type="primary">
      Pay now
    </Button>
  );
};

export default Pay;
