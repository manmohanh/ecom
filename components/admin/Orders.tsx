"use client";

import clientCatchError from "@/lib/client-catch-error";
import fetcher from "@/lib/fetcher";
import "@ant-design/v5-patch-for-react-19";
import calculatePrice from "@/lib/price-calculate";
import { Avatar, Card, message, Select, Skeleton, Table, Tag } from "antd";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

const Orders = () => {
  const { data, error, isLoading } = useSWR("/api/order", fetcher);

  if (isLoading) return <Skeleton active />;

  console.log(data);

  if (error)
    return <h1 className="text-rose-500 font-medium">{error.message}</h1>;

  const changeStatus = async (status: string, id: string) => {
    try {
      await axios.put(`/api/order/${id}`, { status });
      message.success(`Product status changed to ${status}`);
      mutate("/api/order");
    } catch (error) {
      return clientCatchError(error);
    }
  };

  const getTotalSales = (item: any) => {
    let total = 0;
    for (let i = 0; i < item.prices.length; i++) {
      const price = item.prices[i];
      const discount = item.discounts[i];
      const qnt = item.quantities[i];
      total += calculatePrice(price, discount) * qnt;
    }
    return <label>₹{total.toLocaleString()}</label>;
  };

  const columns = [
    {
      title: "OrderId",
      key: "_id",
      dataIndex: "_id",
    },
    {
      title: "Customer",
      key: "customer",
      render: (item: any) => (
        <div className="flex gap-3 items-center">
          <Avatar size={"large"} className="bg-orange-500!">
            {item.user.fullname[0].toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-medium capitalize">{item.user.fullname}</h1>
            <label className="text-gray-500 text-xs">{item.user.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Total sales",
      key: "totalSales",
      render: getTotalSales,
    },
    {
      title: "Total Products",
      key: "totalProducts",
      render: (item: any) => item.products.length,
    },
    {
      title: "Address",
      key: "address",
      render: (item: any) => {
        const address = item.user.address;
        return (
          <div>
            {address.pincode ? (
              <div>
                {address.street}, {address.city}, {address.state},
                {address.country} {address.pincode}
              </div>
            ) : (
              "Address not updated"
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) =>
        item.status === "processing" ? (
          <Select
            defaultValue={item.status}
            style={{ width: 150 }}
            onChange={(status) => changeStatus(status, item._id)}
          >
            <Select.Option value="processing">Processing</Select.Option>
            <Select.Option value="dispatched">Dispatched</Select.Option>
            <Select.Option value="returned">Returned</Select.Option>
          </Select>
        ) : (
          <Tag
            color={
              item.status === "dispatched" ? "green-inverse" : "magenta-inverse"
            }
            className="capitalize"
          >
            {item.status}
          </Tag>
        ),
    },
    {
      title: "Created",
      key: "created",
      render: (item: any) =>
        moment(item.createdAt).format("MMM DD,YYYY hh:mm A"),
    },
  ];

  const browseProducts = (item: any) => {
    return (
      <div className="grid grid-cols-4 gap-8">
        {item.products.map((p: any, pIndex: number) => (
          <Card
            key={pIndex}
            cover={
              <div className="w-full h-[150px] relative">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-contain"
                />
              </div>
            }
          >
            <Card.Meta
              title={p.title}
              description={
                <div className="flex gap-3">
                  <label>
                    ₹
                    {calculatePrice(
                      item.prices[pIndex],
                      item.discounts[pIndex]
                    )}
                  </label>
                  <del>₹{item.prices[pIndex]}</del>
                  <label>{item.discounts[pIndex]}</label>
                  <label>{item.quantities[pIndex]}Pcs</label>
                </div>
              }
            />
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"_id"}
        expandable={{
          expandedRowRender: browseProducts,
          rowExpandable: (record: any) => record.name !== "Not Expandable",
        }}
      />
    </div>
  );
};

export default Orders;
