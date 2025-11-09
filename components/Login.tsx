"use client";
import { Button, Card, Divider, Form, Input } from "antd";
import Image from "next/image";
import Logo from "./shared/Logo";
import { ArrowRightOutlined, GoogleOutlined } from "@ant-design/icons";
import "@ant-design/v5-patch-for-react-19";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import clientCatchError from "@/lib/client-catch-error";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoding] = useState(false);
  const router = useRouter();

  const login = (value: any) => {
    const payload = {
      ...value,
      redirect: true,
      callbackUrl: "/",
    };
    signIn("credentials", payload);
  };

  const signInWithGoogle = async () => {
    try {
      const payload = {
        redirect: true,
        callbackUrl: "/",
      };

      await signIn("google", payload);
    } catch (error) {
      clientCatchError(error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen grid grid-cols-2 animate__animated animate__fadeIn overflow-hidden">
      <div className="relative">
        <Image
          src={"/images/login.jpg"}
          fill
          alt="sign up"
          className="object-fill"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="flex items-center justify-center">
        <Card className="w-[480px] animate__animated animate__slideInRight">
          <div className="space-y-3">
            <div className="flex justify-center">
              <Logo />
            </div>
            <Form layout="vertical" onFinish={login}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input size="large" placeholder="email@gmail.com" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.Password size="large" placeholder="*****" />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  size="large"
                  type="primary"
                  icon={<ArrowRightOutlined />}
                  className="bg-violet-500! hover:bg-violet-600!"
                >
                  Sign in
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Button
              onClick={signInWithGoogle}
              icon={<GoogleOutlined />}
              size="large"
              className="w-full"
              type="primary"
              danger
            >
              Signin with Google
            </Button>
            <div className="flex gap-2">
              <p className="text-gray-500">Don't have an account ?</p>
              <Link href={"/signup"} className="hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
