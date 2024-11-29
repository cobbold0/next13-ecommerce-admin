"use client";

import {
  Banknote,
  Bike,
  CheckCircle,
  CheckCircleIcon,
  Copy,
  CreditCard,
  TimerIcon,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatus, Prisma } from "@prisma/client";
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
import { CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertModal } from "@/components/modals/alert-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { FullOrderPayload, OrderDetails as OrderD } from "@/types/OrderDetails";

interface OrderDetailsProps {
  fullOrder: OrderD | null;
}

export default function OrderDetails({ fullOrder }: OrderDetailsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState("");

  const router = useRouter();
  const params = useParams();

  if (fullOrder == null) {
    return null;
  }
  const orderDate = fullOrder.createdAt;
  const updatedDate = fullOrder.updatedAt;
  const paidStatus = fullOrder.isPaid ? "Paid" : "Not Paid";
  const paymentType = fullOrder.payment?.cardType || fullOrder.payment?.bank;
  const paymentTypeIcon = fullOrder.payment?.cardType ? (
    <CreditCard className="h-4 w-4" />
  ) : (
    <File className="h-4 w-4" />
  );
  const paymentNumber = "3284239848943484832";
  const customerName = fullOrder.customer.fullname
  const paymentFees = formatter.format(fullOrder.payment?.fees || 0);
  const orderSubtotal = formatter.format(calcOrderSubtotal(fullOrder.products));
  const TAP = (fullOrder.payment?.amount || 0) + (fullOrder.payment?.fees || 0);
  console.log("amount", fullOrder.payment?.amount);
  console.log("fee", fullOrder.payment?.fees);
  console.log("tpa", TAP);

  const totalDiscount = formatter.format(calcTotalDiscount(fullOrder.products));

  const totalAmountPaid = formatter.format(TAP)

  const orderStatus = fullOrder.status;
  const subTitle = () => {
    if (orderStatus == OrderStatus.DELIVERED) {
      return "Delivered";
    } else if (orderStatus == OrderStatus.IN_TRANSIT) {
      return "In Transit";
    } else if (orderStatus == OrderStatus.PICKUP_SCHEDULED) {
      return "Pick Up Scheduled";
    } else if (orderStatus == OrderStatus.ORDER_CONFIRMED) {
      return "Order Confirmed";
    } else if (orderStatus == OrderStatus.ORDER_CANCELED) {
      return "Order Canceled";
    } else {
      return "Order Placed";
    }
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${params.storeId}/orders/${fullOrder.id}`, {
        status: selectedOrderStatus,
      });
      toast.success("Order Status Updated");
      router.refresh();
    } catch (error) {
      toast.error("Unable to update order status. try again");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order ID copied to clipboard.");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Order Details (${subTitle()})`}
          description={`Date: ${orderDate}`}
        />
        <Button
          onClick={() => setOpen(true)}
          disabled={loading || orderStatus == OrderStatus.ORDER_CANCELED || orderStatus == OrderStatus.DELIVERED}
          variant="secondary"
          size="sm"
          className="cursor-pointer bg-blue-500 text-white hover:text-black"
        >
          {orderStatus == OrderStatus.ORDER_PLACED ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Confirm Order
            </>
          ) : orderStatus == OrderStatus.ORDER_CONFIRMED ? (
            <>
              <TimerIcon className="mr-2 h-4 w-4" /> Pick Up Scheduled
            </>
          ) : orderStatus == OrderStatus.PICKUP_SCHEDULED ? (
            <>
              <Bike className="mr-2 h-4 w-4" /> In Transit
            </>
          ) : orderStatus == OrderStatus.IN_TRANSIT ? (
            <>
              <div className="flex flex-row mr-2">
                <Bike className="h-4 w-4" />
                <CheckCheck className="h-3 w-3" />
              </div>{" "}
              Delivered
            </>
          ) : (
            <>{orderStatus}</>
          )}
        </Button>
      </div>
      <Separator />
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Order {fullOrder.id}
              <Button
                onClick={() => onCopy(fullOrder.id)}
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "h-8 gap-1 cursor-default",
                fullOrder.isPaid ? "bg-foreground-mute" : "bg-red-300"
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
              {fullOrder.products.map((item, index) => {
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
                <span>-{totalDiscount}</span>
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
                  <a href="mailto:">{fullOrder.customer.email}</a>
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Phone</dt>
                <dd>
                  <a href="tel:">{fullOrder.customer.phone}</a>
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
