import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkForProductAmount } from "../../util/utils";
import { Decimal } from "@prisma/client/runtime/library";

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
  const d = await req.json();
  const {
    productIds,
    firstName,
    lastName,
    customerAddress: { line, city, digitalAddress, country },
    customerContact: { phoneNumber1, phoneNumber2, email },
  } = d;

  console.log("[CHECKOUT: - REQUEST]", d);

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  if (!email || !email.includes("@")) {
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
    amount: checkForProductAmount(product.price, product.discountedPrice),
    quantity: 1,
  }));

  const addressComponents = [
    line || "",
    city || "",
    digitalAddress || "",
    country || "",
  ];

  const addressString = addressComponents
    .filter((value) => value != "")
    .join(", ");

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      phone: phoneNumber1 || phoneNumber2,
      address: addressString || "",
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

  const requestBody = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: line_items
        .reduce(
          (total, item) => total.plus(item.amount.times(item.quantity)),
          new Decimal(0)
        )
        .toNumber() * 100,
      callback_url: `${storeFrontUrl.origin}/cart`,
      metadata: {
        orderId: order.id,
        firstName: firstName || "",
        lastName: lastName || "",
        address: {
          line: line || "",
          city: city || "",
          digitalAddress: digitalAddress || "",
          country: country || "",
        },
        contact: {
          phoneNumber1: phoneNumber1 || "",
          phoneNumber2: phoneNumber2 || "",
          email: email || "",
        },
      },
    }),
  };
  console.log("PAYSTACK PAYMENT REQUEST BODY", JSON.stringify(requestBody));

  // Paystack API request to create a payment link
  const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", requestBody);

  if (!paystackResponse.ok) {
    const errorMessage = await paystackResponse.text();
    return new NextResponse(`Paystack API error: ${errorMessage}`, {
      status: 500,
    });
  }

  const paystackData = await paystackResponse.json();

  console.log("PAYSTACK PAYMENT RESPONSE", paystackData);

  return NextResponse.json(
    { url: paystackData.data.authorization_url },
    {
      headers: corsHeaders,
    }
  );
}
