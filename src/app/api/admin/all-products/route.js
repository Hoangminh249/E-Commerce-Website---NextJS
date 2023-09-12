import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const extractAllProduct = await Product.find({});

    if (extractAllProduct) {
      return NextResponse.json({
        success: true,
        data: extractAllProduct,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong !",
    });
  }
}
