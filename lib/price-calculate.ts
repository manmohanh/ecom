const calculatePrice = (price: number, discount: number) => {
  const amount = (price * discount) / 100;
  return price - amount
};


export default calculatePrice