"use client";

import fetcher from "@/lib/fetcher";
import { Avatar, Skeleton, Table, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";

const Payments = () => {

  const {data,error,isLoading} = useSWR('/api/payment',fetcher)

  if(isLoading)
    return <Skeleton active/>

  if(error)
    return <h1>{error.message}</h1>

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (item:any) => (
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
      title: "Product",
      key: "product",
      render: (item: any) => <label>{item.order.product.title}</label>,
    },
    {
      title: "Amount",
      key: "amount",
      render: (item: any) => <label>{"₹ " + item.order.price}</label>,
    },
    {
      title:'Vendor',
      key:'vendor',

      render:(item:any)=>{
        <Tag>{item.vendor}</Tag>
      }
    },
    {
      title:"Date",
      key:"date",
      render:(item:any)=>(
        <label>{moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}</label>
      )
    }
  ];

  return (
    <div>
      <Table columns={[]} dataSource={data} rowKey={"_id"}/>
    </div>
  );
};

export default Payments;
