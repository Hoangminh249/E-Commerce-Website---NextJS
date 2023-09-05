import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Product from "@/models/product";

export const dynamic = "force-dynamic";

export async function PUT(req) {
  try {
    await connectToDB();

    const extractData = await req.json();

    const {
      _id,
      name,
      price,
      description,
      category,
      sizes,
      deliveryInfo,
      onSale,
      priceDrop,
      imageUrl,
    } = extractData;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        price,
        description,
        category,
        sizes,
        deliveryInfo,
        onSale,
        priceDrop,
        imageUrl,
      },
      { new: true }
    );

    if (updatedProduct) {
      return NextResponse.json({
        success: true,
        message: "Product updated Successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Fail to update Product",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
