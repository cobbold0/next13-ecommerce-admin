import prismadb from "@/lib/prismadb";
import OrderDetails from "./components/order-details";

const OrderPage = async ({
  params,
}: {
  params: { orderId: string; storeId: string };
}) => {
  const order = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
      Customer: true,
      payment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(params.orderId, order);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderDetails fullOrder={order} />
      </div>
    </div>
  );
};

export default OrderPage;
