import prismadb from "@/lib/prismadb";
import { Mappers } from "@/types/Mappers";
import { FullOrderPayload, OrderDetails } from "@/types/OrderDetails";

export const getOrder = async (id: string) => {
  const order = await prismadb.order.findFirst({
    where: {
      id,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
              color: true,
              size: true,
              category: true,
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

  if (order != null) {
    return Mappers.fromFullOrderPayloadToOrderDetails(order);
  }
  return null;
};
