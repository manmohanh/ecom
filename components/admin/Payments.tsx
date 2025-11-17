"use client";

import fetcher from "@/lib/fetcher";
import { Avatar, Skeleton, Table, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";

const Payments = () => {
  const { data, error, isLoading } = useSWR("/api/payment", fetcher);

  console.log(data);

  if (isLoading) return <Skeleton active />;

  if (error) return <h1>{error.message}</h1>;

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (item: any) => (
        <div className="flex gap-3 items-center">
          <Avatar size={"large"} className="bg-orange-500!">
            {item.user.fullname[0]}
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-medium">{item.user.fullname}</h1>
            <label className="text-gray-500">{item.user.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Order ID",
      key: "orderId",
      dataIndex: "order",
    },
    {
      title: "Payment ID",
      key: "paymentId",
      dataIndex: "paymentId",
    },
    {
      title: "Amount",
      key: "amount",
      render: (item: any) => <label>₹{item.amount.toLocaleString()}</label>,
    },
    {
      title: "Fee",
      key: "fee",
      render: (item: any) => (item.fee ? <label>₹{item.fee}</label> : 0),
    },
    {
      title: "Tax",
      key: "tax",
      render: (item: any) => (item.tax ? <label>₹{item.tax}</label> : 0),
    },
    {
      title: "Date",
      key: "date",
      render: (item: any) => moment(item.createdAt).format("MMM DD,YYYY"),
    },
    {
      title: "Method",
      key: "method",
      render: (item: any) => (
        <Tag className="uppercase" color="volcano">
          {item.method}
        </Tag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) => (
        <>
          {item.status === "captured" ? (
            <Tag className="uppercase" color="green">
              {item.status}
            </Tag>
          ) : (
            <Tag className="uppercase" color="magenta">
              {item.status}
            </Tag>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"_id"}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Payments;
