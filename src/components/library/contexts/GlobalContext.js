/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react';

const GlobalContext = createContext(null);


export function useGlobalContext() {
  return useContext(GlobalContext);
}

export default function GlobalContextProvider({ children, value }) {
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
