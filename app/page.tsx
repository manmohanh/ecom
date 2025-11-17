import Products from "@/components/Products";

export const metadata = {
  title:`Ecom - ${process.env.DOMAIN}`,
  description: 'India`s best and affordable ecommerce website',
  keywords:"ecom,ecom.com,online ecommerce website"
}

const HomeRouter = async () => {
  const productRes = await fetch(`${process.env.SERVER}/api/product`);
  const products = productRes.ok
    ? await productRes.json()
    : { data: [], total: 0 };

  return <Products data={products} />;
};

export default HomeRouter;
