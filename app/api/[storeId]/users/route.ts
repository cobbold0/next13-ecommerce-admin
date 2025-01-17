import prismadb from "@/lib/prismadb";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const POST = async (req: Request,  { params }: { params: { storeId: string } }) => {
  const {body} = await req.json()

  if (!params.storeId) {
    return new NextResponse("Store id is required", { status: 400 });
  }

  const { id } = body;

  if (!id) {
    return new NextResponse("User id is required", { status: 400 });
  }

  try {

    const storeById = await prismadb.store.findFirst({
      where: {
        id: params.storeId
      }
    });

    if (!storeById) {
      return new NextResponse("Unauthorized, no store found", { status: 405 });
    }

    
    
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
