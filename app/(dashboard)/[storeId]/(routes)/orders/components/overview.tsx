import {
  Bike,
  CheckCheck,
  Package,
  PackageCheck,
  PackageOpen,
  PackageX,
  Timer,
  Truck,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";

interface OrderOverviewProps {
  params: {
    storeId: string;
  };
}

// DELIVERED
//   IN_TRANSIT
//   PICKUP_SCHEDULED
//   ORDER_CONFIRMED
//   ORDER_CANCELED
//   ORDER_PLACED

const OrderOverview: React.FC<OrderOverviewProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pb-6 pt-6">
        <div className="grid gap-4 grid-cols-3">
          <Card className="border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Delivered Orders
              </CardTitle>
              <div className="flex flex-row">
                <Bike className="h-4 w-4 text-muted-foreground" />
                <CheckCheck className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scheduled Pick Ups
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Confirmed Orders
              </CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unprocessed Orders
              </CardTitle>
              <PackageOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
          <Card className="border-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canceled Orders
              </CardTitle>
              <PackageX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{0}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;
