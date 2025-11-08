"use client";
import DataInterface from "@/interface/data.interface";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Pagination, Popconfirm, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import "@ant-design/v5-patch-for-react-19";

const Products: FC<DataInterface> = ({ data }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const onPaginate = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.data.map((item: any, index: number) => (
          <Card
            key={index}
            cover={
              <div className="relative w-full h-[180px]">
                <Image
                  src={item.image}
                  fill
                  alt={item.title}
                  className="rounded-t-lg object-cover"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            }
            hoverable
          >
            <Card.Meta
              title={
                <Link
                  href={`/products/${item.title
                    .toLowerCase()
                    .split(" ")
                    .join("-")}`}
                  className="text-inherit!"
                >
                  {item.title}
                </Link>
              }
              description={
                <div className="flex gap-2">
                  <label>₹{item.price}</label>
                  <del>₹{item.price}</del>
                  <label>({item.discount}% off)</label>
                </div>
              }
            />

            <Button
              icon={<ShoppingCartOutlined />}
              type="primary"
              className="w-full! mt-5! mb-2!"
            >
              Add to Card
            </Button>
            <Link
              href={`/products/${item.title
                .toLowerCase()
                .split(" ")
                .join("-")}`}
            >
              <Button type="primary" danger className="w-full!">
                Buy now
              </Button>
            </Link>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Pagination
          total={data.total}
          onChange={onPaginate}
          current={page}
          pageSizeOptions={[6, 8, 14, 20]}
          defaultPageSize={limit}
        />
      </div>
    </div>
  );
};

export default Products;
