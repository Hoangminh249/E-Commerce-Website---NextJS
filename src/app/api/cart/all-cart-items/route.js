import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req) => {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Please Login in ",
        });
      }

      const extractAllCartItems = await Cart.find({ userID: id })
        .populate("userID")
        .populate("productID");

      if (extractAllCartItems) {
        return NextResponse.json({
          success: true,
          data: extractAllCartItems,
        });
      } else {
        return NextResponse.json({
          success: false,
          status: 204,
          message: "No Cart items are found ",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are Authenticated",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
