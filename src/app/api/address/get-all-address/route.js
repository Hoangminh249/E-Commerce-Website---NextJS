import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "You are not logged In",
      });
    }

    const isAuthUser = AuthUser(req);

    if (isAuthUser) {
      const getAllAddress = await Address.find({ userID: id });

      if (getAllAddress) {
        return NextResponse.json({
          success: true,
          data: getAllAddress,
        });
      }else{
        return NextResponse.json({
            success: false,
            message: "Fail to get Address",
          });
      }


    } else {
      return NextResponse.json({
        success: false,
        message: "You are not Authenticated",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
