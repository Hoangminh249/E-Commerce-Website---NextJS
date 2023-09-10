"use client";

import ComponentLevelLoader from "@/components/Loader/componentLevelLoder";
import { GlobalContext } from "@/Context";
import { getAllOrdersForAllUser, updateStatusOfOrder } from "@/services/order";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function AdminView(params) {
  const {
    allOrdersForAllUsers,
    setAllOrdersForAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  const extractAllOrdersForAllUsers = async () => {
    setPageLevelLoader(true);

    const res = await getAllOrdersForAllUser();

    if (res.success) {
      setPageLevelLoader(false);
      setAllOrdersForAllUsers(
        res.data && res.data.length
          ? res.data.filter((item) => item.user._id !== user._id)
          : []
      );
    } else {
      setPageLevelLoader(false);
    }
  };

  const handleUpdateOrderStatus = async (getItem) => {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false,
    });

    if (res.success) {
      setComponentLevelLoader({ loading: true, id: "" });

      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: true, id: "" });
    }
  };

  useEffect(() => {
    if (user !== null) extractAllOrdersForAllUsers();
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
    <section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {allOrdersForAllUsers && allOrdersForAllUsers.length ? (
                  <ul className="flex flex-col gap-4">
                    {allOrdersForAllUsers.map((item) => (
                      <li
                        key={item._id}
                        className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                      >
                        <div className="flex">
                          <h1 className="font-bold text-lg mb-3 flex-1 ">
                            {" "}
                            #Order: {item._id}
                          </h1>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center">
                              <p className="mr-3 text-sm font-medium text-gray-900">
                                User Name :
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {item?.user.name}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="mr-3 text-sm font-medium text-gray-900">
                                User Email :
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {item?.user.email}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="mr-3 text-sm font-medium text-gray-900">
                                Total Paid Amount :
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                ${item.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {item.orderItems.map((orderItem, index) => (
                            <div key={index} className="shrink-0">
                              <img
                                alt="Order Items"
                                className="h-24 w-24 max-w-full rounded-lg object-cover"
                                src={
                                  orderItem &&
                                  orderItem.product &&
                                  orderItem.product.imageUrl
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-5">
                          <button className=" mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
                            {item.isProcessing
                              ? "Order is Processing "
                              : "Order is delivered"}
                          </button>
                          <button
                            disabled={!item.isProcessing}
                            onClick={() => handleUpdateOrderStatus(item)}
                            className=" disabled:opacity-50 mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                          >
                            {componentLevelLoader &&
                            componentLevelLoader.loading &&
                            componentLevelLoader.id === item._id ? (
                              <ComponentLevelLoader
                                text={"Updating Order Status"}
                                color={"#ffffff"}
                                loading={
                                  componentLevelLoader &&
                                  componentLevelLoader.loading
                                }
                              />
                            ) : (
                              "Update Order Status"
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
