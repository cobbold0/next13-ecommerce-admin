import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, customerEmail } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  if (!customerEmail || !customerEmail.includes("@")) {
    return new NextResponse("A valid customer email is required", {
      status: 400,
    });
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  if (!store) {
    return new NextResponse("Store not found", { status: 400 });
  }

  let storeFrontUrl = null;

  try {
    storeFrontUrl = new URL(store.storeFrontUrl);
  } catch (error) {
    return new NextResponse("No store front url found", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items = products.map((product) => ({
    name: product.name,
    amount: product.price.toNumber() * 100,
    quantity: 1,
  }));

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  // Paystack API request to create a payment link
  const paystackResponse = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail, // Replace with customer's email
        amount: line_items.reduce(
          (total, item) => total + item.amount * item.quantity,
          0
        ),
        callback_url: `${storeFrontUrl.origin}/payment/callback`,
        metadata: {
          orderId: order.id,
        },
      }),
    }
  );

  if (!paystackResponse.ok) {
    const errorMessage = await paystackResponse.text();
    return new NextResponse(`Paystack API error: ${errorMessage}`, {
      status: 500,
    });
  }

  const paystackData = await paystackResponse.json();

  return NextResponse.json(
    { url: paystackData.data.authorization_url },
    {
      headers: corsHeaders,
    }
  );
}
