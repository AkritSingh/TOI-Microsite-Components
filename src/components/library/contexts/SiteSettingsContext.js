/* eslint-disable react/prop-types */
import React, { createContext, useContext } from 'react';

const SiteSettingsContext = createContext(null);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default function SiteSettingsContextProvider({
  children,
  siteSettings,
}) {
  return (
    <SiteSettingsContext.Provider value={siteSettings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
