"use client";

import fetcher from "@/lib/fetcher";
import Image from "next/image";
import { Card, Divider, Empty, Skeleton, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";
import calculatePrice from "@/lib/price-calculate";

const Orders = () => {
  const { data, error, isLoading } = useSWR("/api/order", fetcher);

  if (error) {
    return <h1>{error.message}</h1>;
  }

  if (isLoading) return <Skeleton active />;

  const getStatusColor = (status: string) => {
    if (status === "processing") return "#2db7f5";

    if (status === "dispatched") return "#87d068";

    if (status === "returned") return "#f50";
  };

  if(data.length === 0)
    return <Empty description="No orders found !" />

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
                        <label className="text-gray-500 font-medium">
                          {item.quantities[pIndex]} Pcs
                        </label>
                      </div>

                      <Tag color={getStatusColor(item.status)}>
                        {item.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Divider />
          <h1 className="text-3xl font-bold">
            Total : ₹{item.grossTotal.toLocaleString()}
          </h1>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
