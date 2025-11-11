"use client";
import fetcher from "@/lib/fetcher";
import { Card, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import useSWR from "swr";

const Users = () => {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  console.log(data)

  return (
    <div className="grid grid-cols-4 gap-8">
      {isLoading && <Skeleton active className="col-span-4"/>}
      {error && <div>{error.message}</div>}
      {
        data && data.map((item: any, index: number) => (
          <Card key={index} hoverable>
            <div className="flex flex-col items-center">
              <Image
                src={"/images/avt.jpeg"}
                width={100}
                height={100}
                alt={`img-${index}`}
                objectFit="cover"
                className="rounded-full"
              />
              <Card.Meta title={item.fullname} description={item.email} />
              <label className="text-gray-500 font-medium mt-1">{moment(item.createdAt).format('MMM DD,YYYY hh:mm A')}</label>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Users;
