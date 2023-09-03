"use client"

import React, { createContext } from 'react';

export const GlobalContext = createContext(null);

function GlobalState({children}) {
    return (
       <GlobalContext.Provider >
{children}
       </GlobalContext.Provider>
    );
}

export default GlobalState;