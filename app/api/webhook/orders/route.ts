import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Helper function to verify Paystack signature
const verifyPaystackSignature = (body: string, signature: string, secret: string) => {
  const crypto = require("crypto");
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("x-paystack-signature") as string;

  // Verify webhook signature
  const isValidSignature = verifyPaystackSignature(body, signature, process.env.PAYSTACK_SECRET_KEY!);
  if (!isValidSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const session = event.data;
    const address = session?.customer?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.digitalAddress,
      address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');

    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer?.phone || '',
      },
      include: {
        orderItems: true,
      }
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });
  }

  return new NextResponse(null, { status: 200 });
}
