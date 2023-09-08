import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const stripe = require("stripe")(
  "sk_test_51No4H3HcDBKDh1a3RfgLBt7MzP7P6S5X3zggkZw7bL2QoaKQqNvuiFFM1remtdHoFfU28lqAwWidb3RRQ9ehQJrL000XYq6Ofl"
);

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: "http://localhost:3000/checkout" + "?status=success",
        cancel_url: "http://localhost:3000/checkout" + "?status=cancel",
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
