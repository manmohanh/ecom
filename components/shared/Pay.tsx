"use client";
import clientCatchError from "@/lib/client-catch-error";
import calculatePrice from "@/lib/price-calculate";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { Button, Modal, Result } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  notes: any;
}

interface ProductInterface {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  quantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentSuccessInterface {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentFailedInterface {
  reason: string;
  order_id: string;
  payment_id: string;
}

interface PayInterface {
  theme?: "happy" | "sad";
  title?: string;
  product: any;
  onSuccess?: (payload: PaymentSuccessInterface) => void;
  onFailed?: (payload: PaymentFailedInterface) => void;
}

const Pay: FC<PayInterface> = ({
  title = "Pay now",
  product,
  onSuccess,
  onFailed,
  theme = "happy",
}) => {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const isArray = Array.isArray(product);
  const session = useSession();
  const { Razorpay } = useRazorpay();

  const getTotalAmout = () => {
    let sum = 0;

    for (let item of product) {
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
    const quantities = []

    if (!isArray) {
      return {
        products: [product._id],
        prices: [product.price],
        discounts: [product.discount],
        quantities:[1]
      };
    }

    for (let item of product) {
      products.push(item.product._id);
      prices.push(item.product.price);
      discounts.push(item.product.discount);
      quantities.push(item.qnt)
    }

    return {
      products,
      prices,
      discounts,
      quantities
    };
  };

  const handleSuccess = (payload: PaymentSuccessInterface) => {
    if (onSuccess) return onSuccess(payload);

    return null;
  };

  const payNow = async () => {
    try {
      if (!session.data) throw new Error("Session not intialized");

      if(!session.data.user.address.city)
      {
        sessionStorage.setItem("message","Please update your address first")
        return router.push('/user/settings')
      }

      const payload = {
        amount: isArray ? getTotalAmout() : product.price,
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

      rzp.on("payment.failed", (err: any) => {
        setOpen(true)
        if (!onFailed) return;

        const payload = {
          reason: err.reason,
          order_id: err.metadata.order_id,
          payment_id: err.metadata.payment_id,
        };
        onFailed(payload);
      });

      rzp.open();
    } catch (err) {
      clientCatchError(err);
    }
  };

  return (
    <>
      {theme === "happy" ? (
        <Button
          onClick={payNow}
          size="large"
          type="primary"
          className="font-medium! w-full! py-6! text-lg! bg-green-500! hover:bg-green-600!"
        >
          {title}
        </Button>
      ) : (
        <Button
          danger
          onClick={payNow}
          size="large"
          type="primary"
          className="font-medium! w-full! py-6! text-lg!"
        >
          {title}
        </Button>
      )}
      <Modal open={open} width={"50%"} footer={null} onCancel={()=>setOpen(false)}>
        <Result
        status="error"
        title="Purchase Failed"
        subTitle="An error occured during payment capture"
        extra={[
          <Link href={"/"}>
          <Button type="primary">Go back</Button>
          </Link>
        ]}
        />
      </Modal>
    </>
  );
};

export default Pay;
