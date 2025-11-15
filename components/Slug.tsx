"use client";
import DataInterface from "@/interface/data.interface";
import calculatePrice from "@/lib/price-calculate";
import { Button, Card, Empty } from "antd";
import Image from "next/image";
import { FC } from "react";
import Pay from "./shared/Pay";
import { useRouter } from "next/navigation";

interface TitleInterface extends DataInterface {
  title: string;
}

const Slug: FC<DataInterface> = ({ data, title }) => {
  const router = useRouter();

  if (!data) return <Empty />;
  return (
    <div>
      <Card className="shadow-lg">
        <div className="flex gap-12">
          <Image
            src={data.image}
            width={240}
            height={0}
            alt={data.title}
            className="rounded-lg object-cover"
          />
          <div>
            <h1 className="text-4xl font-bold">{data.title}</h1>
            <p className="text-slate-500 mt-2">{data.description}</p>
            <div className="text-2xl font-medium flex gap-4 mt-5 mb-5">
              <h1>₹{calculatePrice(data.price, data.discount)}</h1>
              <del className="text-gray-500">₹{data.price}</del>
              <h1 className="text-rose-500">({data.discount}% Off)</h1>
            </div>
            <div className="w-[200px]">
              <Pay
                title="Buy now"
                product={data}
                theme="happy"
                onSuccess={() => {
                  router.push("/user/orders");
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Slug;
