"use client";

import { createContext, useContext } from "react";

export const DemoContext = createContext(false);
export const useDemoMode = () => useContext(DemoContext);

const PublicDemoContext = createContext(false);
export const usePublicDemo = () => useContext(PublicDemoContext);

export function PublicDemoProvider({ children }) {
  return (
    <PublicDemoContext value>
      <DemoContext value>{children}</DemoContext>
    </PublicDemoContext>
  );
}
