import { createContext, useContext, useState } from "react";

const TemplateContext = createContext();

export function TemplateProvider({ children }) {
  const [activeTemplate, setActiveTemplate] = useState(null);
  return (
    <TemplateContext.Provider value={{ activeTemplate, setActiveTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export const useTemplate = () => useContext(TemplateContext);
