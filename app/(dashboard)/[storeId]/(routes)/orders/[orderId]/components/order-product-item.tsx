import { Separator } from "@/components/ui/separator";
import { formatter, getProductPrice } from "@/lib/utils";
import { OrderDetailsProduct } from "@/types/OrderDetails";
import { Prisma } from "@prisma/client";
import { Image } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface OrderProductItemProps {
  product: OrderDetailsProduct;
}

export default function OrderProductItem({ product }: OrderProductItemProps) {
  const amt = formatter.format(product.price);
  return (
    <li className="border-l-4 border-muted-foreground pl-2">
      <ul className="flex items-center justify-between">
        <span className="text-muted-foreground">{product.name}</span>
        <span>{amt}</span>
      </ul>
      <ul className="flex items-center justify-between">
        <span className="text-muted-foreground">Color</span>
        <span>{product.color.name}</span>
      </ul>
      <ul className="flex items-center justify-between">
        <span className="text-muted-foreground">Size</span>
        <span>{product.size.name}</span>
      </ul>
      <ul className="flex items-center justify-between">
        <span className="text-muted-foreground">Cover Image</span>
        <Link href={product.images[0].url} passHref legacyBehavior>
          <a target="_blank" className="flex">
            <span className="text-blue-600">View Image</span>
          </a>
        </Link>
      </ul>
    </li>
  );
}
