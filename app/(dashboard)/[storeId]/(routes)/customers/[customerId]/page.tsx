import prismadb from "@/lib/prismadb";

const CategoryPage = async ({
  params,
}: {
  params: { customerId: string; storeId: string };
}) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">{params.customerId}</div>
    </div>
  );
};

export default CategoryPage;
