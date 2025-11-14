"use client";
import DataInterface from "@/interface/data.interface";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, message} from "antd";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import "@ant-design/v5-patch-for-react-19";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

const Products: FC<DataInterface> = ({ data }) => {
  const router = useRouter();



  const addToCart = async (id: string) => {
    try {
      const session = await getSession();
      if (!session) return router.push("/login");

      await axios.post(`/api/cart`, { product: id });
      message.success("Added to cart")
      mutate("/api/cart?count=true")
    } catch (error) {
      clientCatchError(error);
    }
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
              onClick={() => addToCart(item._id)}
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
   
    </div>
  );
};

export default Products;
