"use client";

import Cookies from "js-cookie";
import React, { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

function GlobalState({ children }) {
  const [showNavModel, setShowNavModel] = useState(false);
  const [pageLevelLoader, setPageLevelLoader] = useState(false);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });

  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(Cookies.get("token"));

    if (Cookies.get("token") !== undefined) {
      setIsAuthUser(true);
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      setUser(userData);
    } else {
      setIsAuthUser(false);
    }
  }, [Cookies]);

  return (
    <GlobalContext.Provider
      value={{
        showNavModel,
        setShowNavModel,
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
