import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { CustomerColumn } from "./components/columns";
import { CategoriesClient } from "./components/client";

const CustomerPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.customer.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const formattedCategories: CustomerColumn[] = categories.map((item) => ({
    id: item.id,
    name: `${item.firstName} ${item.lastName}` ,
    phone: item.phone ?? "",
    email: item.email,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CustomerPage;
