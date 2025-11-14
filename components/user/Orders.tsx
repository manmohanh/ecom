"use client";

import fetcher from "@/lib/fetcher";
import Image from "next/image";
import { Card, Skeleton, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";
import calculatePrice from "@/lib/price-calculate";

const Orders = () => {
  const { data, error, isLoading } = useSWR("/api/order", fetcher);

  console.log(data);

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (isLoading) return <Skeleton active />;

  return (
    <div className="flex flex-col gap-8">
      {data.map((item: any, index: number) => (
        <Card
          key={index}
          title={item._id}
          extra={
            <label className="text-gray-500">
              {moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}
            </label>
          }
        >
          <div className="flex flex-col gap-8">
            {item.products.map((product: any, pIndex: number) => (
              <Card key={pIndex} hoverable>
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={150}
                      height={90}
                    />
                    <div>
                      <h1 className="text-lg font-medium capitalize">
                        {product.title}
                      </h1>
                      <div className="flex gap-3 items-center mb-2">
                        <label className="font-medium text-base">
                          ₹
                          {calculatePrice(
                            item.prices[pIndex],
                            item.discounts[pIndex]
                          )}
                        </label>
                        <del className="text-gray-500">
                          ₹{item.prices[pIndex]}
                        </del>
                        <label>{item.discounts[pIndex]}% Off</label>
                      </div>
                      <Tag>{item.status.toUpperCase()}</Tag>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
