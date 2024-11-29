import prismadb from "@/lib/prismadb";
import OrderDetails from "./components/order-details";
import { getOrder } from "@/actions/get-order";

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const order = await getOrder(params.orderId)
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderDetails fullOrder={order} />
      </div>
    </div>
  );
};

export default OrderPage;
