/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react';

const AdsContext = createContext(null);

export function useAdsContext() {
  return useContext(AdsContext);
}

export default function AdsContextProvider({ children, value }) {
  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}
