import { formatter, getProductPrice } from "@/lib/utils";
import { OrderDetailsProduct } from "@/types/OrderDetails";
import { Prisma } from "@prisma/client";

interface OrderProductItemProps {
  product: OrderDetailsProduct;
}

export default function OrderProductItem({ product }: OrderProductItemProps) {
  const amt = formatter.format(product.price);
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{product.name}</span>
      <span>{amt}</span>
    </li>
  );
}
