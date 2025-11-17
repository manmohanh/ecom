"use client";
import ChildrenInterface from "@/interface/children.interface";
import {
  LogoutOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { getBreadCrumbs } from "../admin/AdminLayout";
import { signOut, useSession } from "next-auth/react";

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

const UserLayout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();

  const session = useSession();

  const logout = async () => {
    await signOut();
  };

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/user/carts">Cart</Link>,
      key: "/user/carts",
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/user/orders">Orders</Link>,
      key: "/user/orders",
    },
    {
      icon: <SettingOutlined />,
      label: <Link href="/user/settings">Settings</Link>,
      key: "/user/settings",
    },
  ];

  return (
    <Layout hasSider className="min-h-screen">
      <Sider width={300} style={siderStyle}>
        <Menu
          theme="light"
          mode="inline"
          items={menus}
          className="h-full"
          selectedKeys={[pathname]}
        />
        {session.data && (
          <div className="bg-indigo-900 p-4 fixed bottom-0 left-0 w-[300px] flex items-center gap-3">
            <Avatar className="h-16! w-16! bg-orange-800! text-2xl! font-medium!">
              {session.data?.user.name?.charAt(0)}
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-lg text-white font-medium capitalize">
                {session.data?.user.name}
              </h1>
              <p className="text-gray-300 mb-3">{session.data?.user.email}</p>
              <Button onClick={logout} icon={<LogoutOutlined />}>
                Logout
              </Button>
            </div>
          </div>
        )}
      </Sider>
      <Layout>
        <Content>
          <div className="w-11/12 mx-auto py-8 min-h-screen">
            <Breadcrumb items={getBreadCrumbs(pathname)} />
            <Card className="mt-6!">{children}</Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
