"use client";
import clientCatchError from "@/lib/client-catch-error";
import "@ant-design/v5-patch-for-react-19";
import fetcher from "@/lib/fetcher";
import { Card, message, Select, Skeleton } from "antd";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

const Users = () => {
  const { data, error, isLoading } = useSWR("/api/user", fetcher);

  const changeRole = async (role: string, userId: string) => {
    try {
      await axios.put(`/api/user/role/${userId}`, { role });
      message.success("Role changed successfully!");
      mutate("/api/user");
    } catch (error) {
      clientCatchError(error);
    }
  };

  if (error) return <div>{error.message}</div>;

  return (
    <div className="grid grid-cols-4 gap-8">
      {isLoading && <Skeleton active className="col-span-4" />}
      {error && <div>{error.message}</div>}
      {data &&
        data.map((item: any, index: number) => (
          <Card key={index} hoverable>
            <div className="flex flex-col items-center gap-3">
              <Image
                src={"/images/avt.jpeg"}
                width={100}
                height={100}
                alt={`img-${index}`}
                objectFit="cover"
                className="rounded-full"
              />
              <Card.Meta
                className="text-center"
                title={item.fullname}
                description={item.email}
              />
              <Select
                className="w-fit!"
                defaultValue={item.role}
                size="large"
                onChange={(role: string) => changeRole(role, item._id)}
              >
                <Select.Option value="user">User</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
              <label className="text-gray-500 font-medium mt-1">
                {moment(item.createdAt).format("MMM DD,YYYY hh:mm A")}
              </label>
            </div>
          </Card>
        ))}
    </div>
  );
};

export default Users;
