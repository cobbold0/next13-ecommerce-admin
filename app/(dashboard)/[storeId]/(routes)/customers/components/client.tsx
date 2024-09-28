"use client";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, CustomerColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface CustomerClientProps {
  data: CustomerColumn[];
}

export const CategoriesClient: React.FC<CustomerClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Customers (${data.length})`}
          description="Manage customers for your store"
        />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Customers" />
      <Separator />
      <ApiList entityName="customers" entityIdName="categoryId" />
    </>
  );
};
