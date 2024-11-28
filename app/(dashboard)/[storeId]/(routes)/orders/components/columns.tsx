"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@prisma/client";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  isDelivered: boolean;
  status: OrderStatus;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => {
      if (row.original.isPaid) {
        return <Badge variant={"secondary"}>Paid</Badge>;
      } else {
        return <Badge variant={"destructive"}>Pending</Badge>;
      }
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status == OrderStatus.DELIVERED) {
        return <Badge variant={"secondary"}>Delivered</Badge>;
      } else if (status == OrderStatus.IN_TRANSIT) {
        return <Badge variant={"secondary"}>In Transit</Badge>;
      } else if (status == OrderStatus.PICKUP_SCHEDULED) {
        return <Badge variant={"secondary"}>Pick Up Scheduled</Badge>;
      } else if (status == OrderStatus.ORDER_CONFIRMED) {
        return <Badge variant={"secondary"}>Order Confirmed</Badge>;
      } else if (status == OrderStatus.ORDER_CANCELED) {
        return <Badge variant={"destructive"}>Order Canceled</Badge>;
      } else {
        return <Badge variant={"secondary"}>Order Placed</Badge>;
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
