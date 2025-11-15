"use client";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, message } from "antd";
import { useSession } from "next-auth/react";
import React from "react";

const Settings = () => {
  const [userForm] = Form.useForm()
  const session = useSession()

  React.useEffect(() => {
    const msg = sessionStorage.getItem("message");
    if (msg) {
      message.warning(msg);
      sessionStorage.removeItem("message");
    }
  }, []);

  React.useEffect(()=>{
    if(session.data){
      const user = session.data.user
      userForm.setFieldsValue({
        fullname:user.name,
        ...user.address
      })
    }
  },[session])



  return (
    <div>
      <h1 className="text-lg font-medium">Profile Information</h1>
      <Divider />
      <div>
        <Form layout="vertical" form={userForm}>
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
            <Button htmlType="submit" size="large" type="primary" danger icon={<SaveOutlined/>}>Save now</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
