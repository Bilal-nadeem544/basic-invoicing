import { createContext, useContext, useState } from "react";

const BrandContext = createContext(null);

const BRAND_NAME_KEY = "invoicingBrandName";
const BRAND_LOGO_KEY = "invoicingBrandLogo";
const DEFAULT_BRAND_NAME = "Vault";

export function BrandProvider({ children }) {
  const [brandName, setBrandName] = useState(
    () => localStorage.getItem(BRAND_NAME_KEY) || DEFAULT_BRAND_NAME
  );
  const [brandLogo, setBrandLogo] = useState(
    () => localStorage.getItem(BRAND_LOGO_KEY) || null
  );

  const updateBrandName = (name) => {
    const finalName = name.trim() || DEFAULT_BRAND_NAME;
    setBrandName(finalName);
    localStorage.setItem(BRAND_NAME_KEY, finalName);
  };

  const updateBrandLogo = (dataUrl) => {
    setBrandLogo(dataUrl);
    if (dataUrl) localStorage.setItem(BRAND_LOGO_KEY, dataUrl);
    else localStorage.removeItem(BRAND_LOGO_KEY);
  };

  return (
    <BrandContext.Provider
      value={{ brandName, brandLogo, updateBrandName, updateBrandLogo }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used inside BrandProvider");
  return ctx;
}