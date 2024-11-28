import { formatter, getProductPrice } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export type FullProduct = Prisma.OrderItemGetPayload<{
  include: {
    product: {
      include: {
        images: true;
      };
    };
  };
}>;

interface OrderProductItemProps {
  product: FullProduct;
}

export default function OrderProductItem({ product }: OrderProductItemProps) {
  const amt = formatter.format(parseInt(product.product.price.toString()));
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{product.product.name}</span>
      <span>{amt}</span>
    </li>
  );
}
