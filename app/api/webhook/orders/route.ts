import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import * as crypto from "crypto";

// Helper function to verify Paystack signature
const verifyPaystackSignature = (
  body: string,
  signature: string,
  secret: string
) => {
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("x-paystack-signature");
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
      return new NextResponse("Missing secret key", { status: 500 });
    }

    if (!signature) {
      return new NextResponse("Signature header missing", { status: 400 });
    }

    const isValidSignature = verifyPaystackSignature(
      body,
      signature,
      PAYSTACK_SECRET_KEY
    );

    if (!isValidSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle the event based on its type
    switch (event.event) {
      case "charge.success": {
        const session = event.data;
        const {
          firstName,
          lastName,
          address: {
            line = "",
            city = "",
            digitalAddress = "",
            country = "",
          } = {},
          contact: { phoneNumber1 = "", phoneNumber2 = "", email = "" } = {},
        } = session?.metadata || {};
        // const address = session?.customer?.metadata?.address;
        console.log("[WEBHOOK/ORDER: SUCCESS - SESSION]", session);

        const addressComponents = [
          line || "",
          city || "",
          digitalAddress || "",
          country || "Ghana",
        ];
        const addressString = addressComponents
          .filter((value) => value != "")
          .join(", ");

        const phoneNumberComponents = [phoneNumber1 || "", phoneNumber2 || ""];
        const phoneNumbersString = phoneNumberComponents
          .filter((value) => value != "")
          .join(", ");

        // Update the order with payment status and customer details
        const order = await prismadb.order.update({
          where: { id: session.metadata?.orderId },
          data: {
            isPaid: true,
            address: addressString,
            phone: phoneNumbersString,
          },
          include: { orderItems: true },
        });

        // Upsert customer details
        const customerData = {
          firstName: firstName || "",
          lastName: lastName || "",
          email: email || "",
          phone: phoneNumbersString || "",
        };

        const upsertCustomer = await prismadb.customer.upsert({
          where: { email: customerData.email },
          update: customerData,
          create: {
            ...customerData,
            store: { connect: { id: order.storeId } },
          },
        });

        await prismadb.order.update({
          where: { id: session.metadata?.orderId },
          data: {
            Customer: {
              connect: { id: upsertCustomer.id },
            },
          },
          include: { orderItems: true },
        });

        // Save payment details
        const paymentDetails = {
          reference: session.reference,
          amount: session.amount,
          status: session.status,
          paidAt: session.paid_at,
          currency: session.currency,
          gatewayResponse: session.gateway_response,
          fees: session.fees,
          authorizationCode: session.authorization.authorization_code,
          cardType: session.authorization.card_type,
          bank: session.authorization.bank,
          accountName: session.authorization.account_name,
          customerId: upsertCustomer.id,
          orderId: order.id,
        };

        await prismadb.paymentDetail.create({
          data: paymentDetails,
        });

        const productIds = order.orderItems.map((item) => item.productId);

        await prismadb.product.updateMany({
          where: { id: { in: productIds } },
          data: { isArchived: true },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.event}`);
        return new NextResponse(`Unhandled event: ${event.event}`, {
          status: 400,
        });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
