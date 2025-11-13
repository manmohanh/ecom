"use client";
import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import calculatePrice from "@/lib/price-calculate";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Skeleton, Space } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  notes: any;
}

const Carts = () => {
  const session = useSession();
  const { data, error, isLoading } = useSWR("/api/cart", fetcher);

  const { Razorpay } = useRazorpay();

  const [loading, setLoading] = useState({
    state: false,
    index: 0,
    buttonIndex: 0,
  });

  if (isLoading) return <Skeleton active />;

  if (error) {
    return <h1>{error.message}</h1>;
  }

  const updateQnt = async (
    num: number,
    id: string,
    index: number,
    buttonIndex: number
  ) => {
    try {
      setLoading({ state: true, index, buttonIndex });
      console.log(num, id);
      await axios.put(`/api/cart/${id}`, { qnt: num });
      mutate("/api/cart");
    } catch (error) {
      clientCatchError(error);
    } finally {
      setLoading({ state: false, index: 0, buttonIndex: 0 });
    }
  };

  const removeProduct = async (
    id: string,
    index: number,
    buttonIndex: number
  ) => {
    try {
      setLoading({ state: true, index, buttonIndex });

      await axios.delete(`/api/cart/${id}`);
      mutate("/api/cart");
    } catch (error) {
      clientCatchError(error);
    } finally {
      setLoading({ state: false, index: 0, buttonIndex: 0 });
    }
  };

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
        handler: () => {
          console.log("Success");
        },
      };
      const rzp = new Razorpay(options);

      rzp.on("payment.failed", () => {
        console.log("failed");
      });

      rzp.open();
    } catch (err) {
      clientCatchError(err);
    }
  };

  if (data.length === 0) return <Empty />;

  return (
    <div className="flex flex-col gap-12">
      {data.map((item: any, index: number) => (
        <Card key={index} hoverable>
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Image
                src={item.product.image}
                alt={item.product.title}
                width={150}
                height={90}
              />
              <div>
                <h1 className="text-lg font-medium capitalize">
                  {item.product.title}
                </h1>
                <div className="flex gap-3 items-center">
                  <label className="font-medium text-base">
                    ₹{calculatePrice(item.product.price, item.product.discount)}
                  </label>
                  <del className="text-gray-500">₹{item.product.price}</del>
                  <label>{item.product.discount}% Off</label>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between items-end">
              <Space.Compact block>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 0
                  }
                  icon={<MinusOutlined />}
                  size="large"
                  onClick={() => updateQnt(item.qnt - 1, item._id, index, 0)}
                />
                <Button size="large">{item.qnt}</Button>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 1
                  }
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => updateQnt(item.qnt + 1, item._id, index, 1)}
                />
              </Space.Compact>
              <Button
                loading={
                  loading.state &&
                  loading.index === index &&
                  loading.buttonIndex === 2
                }
                icon={<DeleteOutlined />}
                size="large"
                danger
                onClick={() => removeProduct(item._id, index, 2)}
              />
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-end items-center gap-6">
        <h1 className="text-2xl font-semibold">
          Total Payable amount - ₹{getTotalAmout().toLocaleString()}
        </h1>
        <Button onClick={payNow} size="large" type="primary">
          Pay now
        </Button>
      </div>
    </div>
  );
};

export default Carts;
