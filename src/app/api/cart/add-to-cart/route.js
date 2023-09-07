import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import Joi from "joi";
import { NextResponse } from "next/server";

const AddToCart = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export const POST = async (req) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();
      const { productID, userID } = data;

      const { error } = AddToCart.validate({
        userID,
        productID,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const isCurrentCartItemsAlreadyExists = await Cart.find({
        productID: productID,
        userID: userID,
      });

      if (isCurrentCartItemsAlreadyExists?.length > 0 ) {
        return NextResponse.json({
          success: false,
          message:
            "Product is already added in cart! Please add different product",
        });
      }

      const saveProductToCart = await Cart.create(data);

      if (saveProductToCart) {
        return NextResponse.json({
          success: true,
          message: "Product is added !!",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Fail to add the product",
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
