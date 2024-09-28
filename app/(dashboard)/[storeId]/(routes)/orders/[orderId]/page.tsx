const OrderPage = async ({ params }: { params: { orderId: string } }) => {
  return <div>{params.orderId}</div>;
};

export default OrderPage
