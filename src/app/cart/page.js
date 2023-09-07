"use client";

import CommonCart from "@/components/CommonCart";
import { GlobalContext } from "@/Context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function Cart(params) {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);

  const extractAllCartItems = async () => {
    setPageLevelLoader(true);
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }

    console.log(res);
  };

  const handleRemoveCartItem = async (getCartItemID) => {
    setComponentLevelLoader({ loading: true, getCartItemID });

    const res = await deleteFromCart(getCartItemID);

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      extractAllCartItems();
    } else {
      toast.error(res.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setComponentLevelLoader({ loading: false, id: getCartItemID });
    }
  };

  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

  if (pageLevelLoader) {
    return (
      <div className=" w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <CommonCart
      componentLevelLoader={componentLevelLoader}
      handleRemoveCartItem={handleRemoveCartItem}
      cartItems={cartItems}
    />
  );
}
