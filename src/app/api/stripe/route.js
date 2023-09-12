import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const successUrl = process.env.SUCCESS_URL;

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: successUrl + "?status=success",
        cancel_url: successUrl + "?status=cancel",
      });

      return NextResponse.json({
        success: true,
        id: session.id,
      });
    }
    return NextResponse.json({
      success: false,
      message: "You are not Authenticated",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong",
    });
  }
}
