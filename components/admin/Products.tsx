"use client";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Result,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import clientCatchError from "@/lib/client-catch-error";
import axios from "axios";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import { debounce } from "lodash";
import calculatePrice from "@/lib/price-calculate";

const Products = () => {
  const [productForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
  const [products, setProducts] = useState({data:[],total:0});

  const { data, error, isLoading } = useSWR(
    `/api/product?page=${page}&limit=${limit}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);


  const onSearch = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value.trim();
      const { data } = await axios.get(`/api/product?search=${value}`);
      setProducts(data);
    } catch (error) {
      clientCatchError(error);
    }
  }, 2000);

  const handleClose = () => {
    setOpen(false);
    productForm.resetFields();
    setEditId(null);
  };

  const createProduct = async (values: any) => {
    try {
      values.image = values.image.file.originFileObj;
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      await axios.post("/api/product", formData);
      message.success("Product added successfully");
      mutate(`/api/product?page=${page}&limit=${limit}`);
      handleClose();
    } catch (error) {
      clientCatchError(error);
    }
  };

  const onPaginate = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
  };

  const editProduct = (item: any) => {
    console.log(item);
    setEditId(item._id);
    setOpen(true);
    productForm.setFieldsValue(item);
  };

  const updateProduct = async (values: any) => {
    try {
      await axios.put(`/api/product/${editId}`, values);
      message.success("updated successfully");
      mutate(`/api/product?page=${page}&limit=${limit}`);
      handleClose();
    } catch (error) {
      clientCatchError(error);
    }
  };

  const changeImage = (id: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        if (!input.files) return message.error("File not selected");
        const file = input.files[0];
        input.remove();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image", file);

        await axios.put("/api/product/change-image", formData);
        message.success("Image changed");
        mutate(`/api/product?page=${page}&limit=${limit}`);
      };
    } catch (error) {
      clientCatchError(error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/product/${id}`);
      mutate(`/api/product?page=${page}&limit=${limit}`);
    } catch (error) {
      clientCatchError(error);
    }
  };

  if (isLoading) return <Skeleton active />;

  if (error) return <Result status="error" title={error.message} />;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search the products..."
          className="w-[350px]!"
          size="large"
          onChange={onSearch}
        />

        <Button
          onClick={() => setOpen(true)}
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="bg-indigo-500! hover:bg-indigo-600!"
        >
          Add Product
        </Button>
      </div>
      <Divider />
      <div className="grid grid-cols-4 gap-8">
        {products.data.map((item: any, index: number) => (
          <Card
            key={index}
            cover={
              <div className="relative w-full h-[180px]">
                <Popconfirm
                  title="Do you want ot change image ?"
                  onConfirm={() => changeImage(item._id)}
                >
                  <Image
                    src={item.image}
                    fill
                    alt={item.title}
                    className="rounded-t-lg object-cover"
                    loading="eager"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </Popconfirm>
              </div>
            }
            hoverable
            actions={[
              <EditOutlined
                key="edit"
                className="text-green-400!"
                onClick={() => editProduct(item)}
              />,
              <Popconfirm
                title="Do you want to delete product?"
                onConfirm={() => deleteProduct(item._id)}
              >
                <DeleteOutlined key="delete" className="text-rose-400!" />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={item.title}
              description={
                <div className="flex gap-2">
                  <label>₹{calculatePrice(item.price,item.discount)}</label>
                  <del>₹{item.price}</del>
                  <label>({item.discount}% off)</label>
                </div>
              }
            />
            <Tag className="mt-5!" color="cyan">
              {item.quantity} Pcs
            </Tag>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Pagination
          total={products.total}
          onChange={onPaginate}
          current={page}
          pageSizeOptions={[6, 8, 14, 20]}
          defaultPageSize={limit}
        />
      </div>
      <Modal
        open={open}
        width={720}
        centered
        footer={null}
        onCancel={handleClose}
        maskClosable={false}
      >
        {editId ? (
          <h1 className="text-lg font-medium">Update the product</h1>
        ) : (
          <h1 className="text-lg font-medium">Add a new product</h1>
        )}
        <Divider />
        <Form
          layout="vertical"
          onFinish={editId ? updateProduct : createProduct}
          form={productForm}
        >
          <Form.Item
            label="Product name"
            name="title"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input size="large" placeholder="Enter product name" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  type: "number",
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="00.00"
                className="w-full!"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  type: "number",
                },
              ]}
            >
              <InputNumber size="large" placeholder="20" className="w-full!" />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  type: "number",
                },
              ]}
            >
              <InputNumber
                size="large"
                placeholder="00.00"
                className="w-full!"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea rows={5} placeholder="Description" />
          </Form.Item>

          {!editId && (
            <Form.Item
              name="image"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload fileList={[]}>
                <Button size="large" icon={<UploadOutlined />}>
                  Choose file
                </Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item>
            {editId ? (
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                danger
                icon={<ArrowRightOutlined />}
              >
                Save changes
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
              >
                Add now
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
