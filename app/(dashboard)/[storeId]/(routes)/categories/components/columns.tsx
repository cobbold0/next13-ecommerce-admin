"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import Image from "next/image";

export type CategoryColumn = {
  id: string;
  name: string;
  iconUrl: string | null;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "iconUrl",
    header: "",
    cell: ({ row }) => {
      const url = row.original.iconUrl;
      if (url == null) {
        return <div></div>;
      }
      return (
        <Image
          src={url}
          alt="category icon"
          className=" rounded-sm bg-foreground"
          width={30}
          height={30}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
