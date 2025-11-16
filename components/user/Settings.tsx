"use client";
import clientCatchError from "@/lib/client-catch-error";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, message } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";

const Settings = () => {
  const [userForm] = Form.useForm();
  const session = useSession();

  console.log(session);

  React.useEffect(() => {
    const msg = sessionStorage.getItem("message");
    if (msg) {
      message.warning(msg);
      sessionStorage.removeItem("message");
    }
  }, []);

  React.useEffect(() => {
    if (session.data) {
      const user = session.data.user;
      userForm.setFieldsValue({
        fullname: user.name,
        ...user.address,
      });
    }
  }, [session]);

  const saveChanges = async (values: any) => {
    try {
      const payload = {
        fullname: values.fullname,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
        },
      };

      await axios.put("/api/user/profile", payload);
      await session.update();
      message.success("Profile Info saved !");
    } catch (error) {
      clientCatchError(error);
    }
  };

  return (
    <div>
      <h1 className="text-lg font-medium">Profile Information</h1>
      <Divider />
      <div>
        <Form layout="vertical" form={userForm} onFinish={saveChanges}>
          <div className="grid grid-cols-2 gap-8">
            <Form.Item
              label="Fullname"
              name="fullname"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <Form.Item
              label="Street"
              name="street"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <Form.Item
              label="State"
              name="state"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Pincode"
              name="pincode"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber size="large" className="w-full!" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              danger
              icon={<SaveOutlined />}
            >
              Save now
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
