import { OrderStatus, Prisma } from "@prisma/client";

export type FullOrderPayload = Prisma.OrderGetPayload<{
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: true;
              color: true;
              size: true;
              category: true
            };
          };
        };
      };
      Customer: true;
      payment: true;
    };
  }>;

export type OrderDetails = {
    id: string;
    storeId: string;
    isPaid: boolean;
    address: string;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    products: OrderDetailsProduct[];
    customer: {
        id: string;
        fullname: string;
        email: string;
        phone: string;
    };
    payment: {
        id: string;
        ref: string;
        amount: number;
        status: string;
        paidAt: string;
        currency: string;
        fees: number;
        cardType: string;
        bank: string;
        accountName: string;
    };
};

export type OrderDetailsProduct = {
    id: string;
    name: string;
    price: number;
    discount: number;
    discountedPrice: number;
    description: string;
    images: OrderDetailsImage[];
    color: {
        name: string;
        value: string;
    };
    size: {
        name: string;
        value: string;
    };
    category: {
        name: string;
        iconUrl: string | null;
    };
};

export type OrderDetailsImage = {
    id: string;
    url: string;
};
