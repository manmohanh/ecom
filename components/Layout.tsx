"use client";
import { FC } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ChildrenInterface from "@/interface/children.interface";
import "animate.css";
import Logo from "./shared/Logo";
import Link from "next/link";
import { UserAddOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";

const menus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Carts",
    href: "/carts",
  },
  {
    label: "Sign In",
    href: "/login",
  },
];

const Layout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();

  const blacklists = ["/admin", "/login", "/signup","/user"];

  const isBlacklist = blacklists.some((path) => pathname.startsWith(path));

  if (isBlacklist) {
    return (
      <AntdRegistry>
        <div>{children}</div>
      </AntdRegistry>
    );
  }

  return (
    <AntdRegistry>
      <nav className="z-10 flex justify-between items-center backdrop-blur-lg shadow-lg px-12 sticky top-0 left-0">
        <Logo />
        <div className="flex items-center">
          {menus.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="py-6 px-12 hover:bg-blue-500 hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href={"/signup"}
            className="py-6 px-12 hover:bg-rose-600 font-medium hover:text-white bg-rose-500 text-white"
          >
            <UserAddOutlined className="mr-3" />
            Sign up
          </Link>
        </div>
      </nav>
      <div className="w-9/12 mx-auto py-24">{children}</div>
      <footer className="bg-zinc-900 h-[450px] flex items-center justify-center text-white text-4xl">
        <h1>My Footer</h1>
      </footer>
    </AntdRegistry>
  );
};

export default Layout;
