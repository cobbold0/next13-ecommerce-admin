"use client";

import { Banknote, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { format } from "date-fns";
import { File } from "lucide-react";
import OrderProductItem from "./order-product-item";
import {
  calcOrderSubtotal,
  calcTotalDiscount,
  cn,
  formatter,
} from "@/lib/utils";

type FullOrder = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        product: {
          include: {
            images: true;
          };
        };
      };
    };
    Customer: true;
    payment: true;
  };
}>;

interface OrderDetailsProps {
  fullOrder: FullOrder | null;
}

export default function OrderDetails({ fullOrder }: OrderDetailsProps) {
  const [loading, setLoading] = useState(false);
  if (fullOrder == null) {
    return null;
  }
  const subTitle = fullOrder.isDelivered ? "Shipped" : "Pending";
  const orderDate = format(fullOrder.createdAt, "MMMM do, yyyy");
  const updatedDate = format(fullOrder.updatedAt, "MMMM do, yyyy");
  const paidStatus = fullOrder.isPaid ? "Paid" : "Not Paid";
  const paymentType = fullOrder.payment?.cardType || fullOrder.payment?.bank;
  const paymentTypeIcon = fullOrder.payment?.cardType ? (
    <CreditCard className="h-4 w-4" />
  ) : (
    <File className="h-4 w-4" />
  );
  const paymentNumber = "3284239848943484832";
  const customerName = `${fullOrder.Customer?.firstName || ""} ${
    fullOrder.Customer?.lastName || ""
  }`;
  const paymentFees = formatter.format(fullOrder.payment?.fees || 0);
  const orderSubtotal = formatter.format(
    calcOrderSubtotal(fullOrder.orderItems)
  );
  const TAP =
    parseInt(fullOrder.payment?.amount.toString() || "0") +
    parseInt(fullOrder.payment?.fees?.toString() || "0");
  console.log("tpa", fullOrder.payment?.amount);

  const totalDiscount = formatter.format(
    TAP - calcTotalDiscount(fullOrder.orderItems)
  );
  const totalAmountPaid = formatter.format(TAP);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Order Details (${subTitle})`}
          description={`Date: ${orderDate}`}
        />
        <Button disabled={loading} variant="secondary" size="sm">
          {fullOrder.isDelivered ? (
            <>
              <Truck fill="green" className="mr-2 h-4 w-4" /> Shipped
            </>
          ) : (
            <>
              <Truck className="mr-2 h-4 w-4" /> Pending
            </>
          )}
        </Button>
      </div>
      <Separator />
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            {/* <CardTitle className="group flex items-center gap-2 text-lg">
              Order Oe31b70H
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>Date: November 23, 2023</CardDescription> */}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "h-8 gap-1 cursor-default",
                fullOrder.isPaid ? "bg-green-600" : "bg-red-600"
              )}
            >
              <Banknote className="h-3.5 w-3.5" />
              <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                {paidStatus}
              </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Order Details</div>
            <ul className="grid gap-3">
              {fullOrder.orderItems.map((item, index) => {
                return <OrderProductItem key={index} product={item} />;
              })}
            </ul>
            <Separator className="my-2" />
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{orderSubtotal}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">fees</span>
                <span>{paymentFees}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">discount</span>
                <span className="line-through">{totalDiscount}</span>
              </li>
              <li className="flex items-center justify-between font-semibold">
                <span className="text-muted-foreground">Total</span>
                <span>{totalAmountPaid}</span>
              </li>
            </ul>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-3">
              <div className="font-semibold">Shipping Information</div>
              <address className="grid gap-0.5 not-italic text-muted-foreground">
                <span>{customerName}</span>
                <span>{fullOrder.address}</span>
              </address>
            </div>
            {/* <div className="grid auto-rows-max gap-3">
              <div className="font-semibold">Billing Information</div>
              <div className="text-muted-foreground">
                Same as shipping address
              </div>
            </div> */}
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Customer Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Customer</dt>
                <dd>{customerName}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a href="mailto:">{fullOrder.Customer?.email}</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">{fullOrder.Customer?.phone}</a>
                </dd>
              </div>
            </dl>
          </div>
          <Separator className="my-4" />
          <div className="grid gap-3">
            <div className="font-semibold">Payment Information</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  {paymentTypeIcon}
                  {paymentType}
                </dt>
                <dd>{paymentNumber}</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">{updatedDate}</time>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
