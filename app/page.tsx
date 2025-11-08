import Products from "@/components/Products"

const HomeRouter = async () => {
  const productRes = await fetch(`${process.env.SERVER}/api/product`)
  const products = productRes.ok ? await productRes.json() : []

  return <Products data={products}/>
}

export default HomeRouter