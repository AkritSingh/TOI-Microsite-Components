/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react';

const PageContext = createContext(null);

export function usePageContext() {
  return useContext(PageContext);
}

export default function PageContextProvider({ children, value }) {
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
