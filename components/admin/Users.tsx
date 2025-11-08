"use client";
import { Card, Skeleton } from "antd";
import Image from "next/image";

const Users = () => {
  return (
    <div className="grid grid-cols-4 gap-8">
        <Skeleton active={false} className="col-span-4"/>
      {Array(16)
        .fill(0)
        .map((item, index) => (
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
              <Card.Meta title="Rohan Kumar" description="email@gmail.com" />
              <label className="text-gray-500 font-medium">Jan 3,2024</label>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Users;
