import { NextResponse } from "next/server";
import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Joi from "joi";
import Address from "@/models/address";

const AddNewAddress = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const isAuthUser = AuthUser(req);

    if (isAuthUser) {
      const data = await req.json();

      const { fullName, address, city, country, postalCode, userID } = data;

      const { error } = AddNewAddress.validate({
        fullName,
        address,
        city,
        country,
        postalCode,
        userID,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      const newlyAddedAddress = await Address.create(data);

      if (newlyAddedAddress) {
        return NextResponse.json({
          success: true,
          message: "Adddress added Successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Fail to add an address",
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
      message: "Something went wrong!",
    });
  }
}
