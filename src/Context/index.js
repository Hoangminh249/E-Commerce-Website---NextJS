"use client";

import React, { createContext, useState } from "react";

export const GlobalContext = createContext(null);

function GlobalState({ children }) {
  const [showNavModel, setShowNavModel] = useState(false);

  return (
    <GlobalContext.Provider value={{ showNavModel, setShowNavModel }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
