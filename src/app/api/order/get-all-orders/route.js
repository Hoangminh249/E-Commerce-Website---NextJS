import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB(req);

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const extractAllOreders = await Order.find({ user: id }).populate(
        "orderItems.product"
      );

      if (extractAllOreders) {
        return NextResponse.json({
          success: true,
          data: extractAllOreders,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to get All orders",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not Authenticated",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
