"use client";

import { GlobalContext } from "@/Context";
import { deleteFromCart, getAllCartItems } from "@/services/cart";
import { Fragment, useContext, useEffect } from "react";
import CommonModel from "../CommonModel";
import ComponentLevelLoader from "../Loader/componentLevelLoder";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CartModel() {
  const {
    showCartModel,
    setShowCartModel,
    user,
    cartItems,
    setCartItems,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  const extractAllCartItems = async () => {
    const res = await getAllCartItems(user?._id);

    if (res.success) {
      setCartItems(res.data);
      localStorage.setItem("cartItems", JSON.stringify(res.data));
    }

    console.log(res);
  };

  useEffect(() => {
    if (user !== null) extractAllCartItems();
  }, [user]);

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

  return (
    <CommonModel
      showButtons={true}
      show={showCartModel}
      setShow={setShowCartModel}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list" className="-my-6 divide-y divide-gray-300">
            {cartItems.map((item) => (
              <li key={item._id} className="flex py-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    alt="Cart Item"
                    className="h-full w-full object-cover object-center"
                    src={item && item.productID && item.productID.imageUrl}
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a>{item && item.productID && item.productID.name}</a>
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      ${item && item.productID && item.productID.price}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="font-medium text-yellow-600 sm:order-2"
                      onClick={() => handleRemoveCartItem(item._id)}
                    >
                      {componentLevelLoader &&
                      componentLevelLoader.loading &&
                      componentLevelLoader.id === item._id ? (
                        <ComponentLevelLoader
                          text={"Removing from cart"}
                          color={"#000000"}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null
      }
      buttonComponent={
        <Fragment>
          <button
            type="button"
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
            onClick={() => {
              router.push("/cart"), setShowCartModel(false);
            }}
          >
            Go to cart
          </button>
          <button
            onClick={() => {
              router.push("/checkout");
              setShowCartModel(false);
            }}
            disabled={cartItems && cartItems.length === 0}
            type="button"
            className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide disabled:opacity-50"
          >
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button type="button" className="font-medium text-grey">
              Continute Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
}
