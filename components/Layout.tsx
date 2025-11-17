"use client";
import { FC } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ChildrenInterface from "@/interface/children.interface";
import "animate.css";
import Logo from "./shared/Logo";
import Link from "next/link";
import {
  LoginOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { Avatar, Badge, Dropdown, Tooltip } from "antd";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

const menus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
];

const Layout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();

  const session = useSession();

  const { data } = useSWR(
    session.data?.user.role === "user" ? "/api/cart?count=true" : null,
    session.data?.user.role === "user" ? fetcher : null
  );

  const blacklists = ["/admin", "/login", "/signup", "/user"];

  const isBlacklist = blacklists.some((path) => pathname.startsWith(path));

  const userMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: <Link href={"/user/orders"}>{session.data?.user.name}</Link>,
        key: "fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href={"/user/settings"}>Settings</Link>,
        key: "settings",
      },
      {
        icon: <LoginOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: "logout",
      },
    ],
  };

  const adminMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: <Link href={"/admin/orders"}>{session.data?.user.name}</Link>,
        key: "fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href={"/admin/settings"}>Settings</Link>,
        key: "settings",
      },
      {
        icon: <LoginOutlined />,
        label: <a onClick={() => signOut()}>Logout</a>,
        key: "logout",
      },
    ],
  };

  const getMenu = (role: string) => {
    if (role === "user") return userMenu;

    if (role === "admin") return adminMenu;

    signOut();
  };

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

          {!session.data && (
            <div className="flex animate__animated animate__fadeIn gap-10">
              <Link
                href={"/login"}
                className="py-6 px-12  font-base hover:bg-blue-500 hover:text-white"
              >
                Sign in
              </Link>

              <Link
                href={"/signup"}
                className="py-6 px-12 hover:bg-rose-600 font-medium hover:text-white bg-rose-500 text-white flex gap-2"
              >
                <UserAddOutlined />
                Sign up
              </Link>
            </div>
          )}
          {session.data && (
            <div className="flex items-center gap-12 animate__animated animate__fadeIn ml-8">
              {session.data.user.role === "user" && (
                <Tooltip title="Your cart">
                  <Link href={"/user/carts"}>
                    <Badge count={data && data.count}>
                      <ShoppingCartOutlined className="text-3xl" />
                    </Badge>
                  </Link>
                </Tooltip>
              )}
              <Dropdown menu={getMenu(session.data.user.role)}>
                <Avatar
                  src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                  size={"large"}
                />
              </Dropdown>
            </div>
          )}
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
