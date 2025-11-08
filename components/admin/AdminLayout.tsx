"use client";

import { FC } from "react";
import { Avatar, Breadcrumb, Dropdown, Layout, Menu } from "antd";
import {
  CreditCardOutlined,
  LoginOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import ChildrenInterface from "@/interface/children.interface";
import Logo from "../shared/Logo";
import { usePathname } from "next/navigation";

const { Sider, Content, Header } = Layout;

export const getBreadCrumbs = (pathname: string) => {
  const arr = pathname.split("/");
  const bread = arr.map((item) => ({
    title: item,
  }));
  return bread;
};

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const AdminLayout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products</Link>,
      key: "products",
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
      key: "orders",
    },
    {
      icon: <CreditCardOutlined />,
      label: <Link href="/admin/payments">Payments</Link>,
      key: "payments",
    },
    {
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Users</Link>,
      key: "users",
    },
  ];

  const accountMenu = {
    items: [
      {
        icon: <ProfileOutlined />,
        label: <a>Manmohan Hansda</a>,
        key: "fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <a>Settings</a>,
        key: "settings",
      },
      {
        icon: <LoginOutlined />,
        label: <a>Logout</a>,
        key: "logout",
      },
    ],
  };

  return (
    <Layout hasSider className="min-h-screen">
      <Sider style={siderStyle} theme="dark" width={280}>
        <Menu theme="dark" mode="inline" items={menus} />
      </Sider>

      <Layout className="bg-gray-50">
        <Header className="bg-white! flex items-center px-6">
          <div className="flex justify-between w-full items-center">
            <Logo />

            <Dropdown menu={accountMenu}>
              <Avatar
                src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
                size={"large"}
              />
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{ margin: "24px 16px 0", overflow: "initial" }}
          className="flex flex-col gap-8"
        >
          <Breadcrumb items={getBreadCrumbs(pathname)} />
          <div
            style={{
              padding: 24,
              textAlign: "center",
              backgroundColor: "white",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
