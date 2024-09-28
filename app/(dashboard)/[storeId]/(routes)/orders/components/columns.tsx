"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  isDelivered: boolean;
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
        return <Badge variant={"secondary"}>Paid</Badge>
      } else {
        return <Badge variant={"destructive"}>Pending</Badge>
      }
    }
  },
  {
    accessorKey: "isDelivered",
    header: "Delivered",
    cell: ({ row }) => {
      if (row.original.isDelivered) {
        return <Badge variant={"secondary"}>Delivered</Badge>
      } else {
        return <Badge variant={"destructive"}>Pending</Badge>
      }
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
