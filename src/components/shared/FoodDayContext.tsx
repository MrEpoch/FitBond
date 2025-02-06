"use client";
import { createContext, useContext, useState } from "react";

const FoodDayContext = createContext({});

export type FoodDayType = {
  currentTheme: any;
  updateTheme: (theme: any) => void;
  editMode: boolean;
  updateEditMode: (editMode: boolean) => void;
};

export const useFoodDay = () => {
  const context = useContext(FoodDayContext);
  if (context === undefined || context === null) {
    return {};
  }
  return context;
};

export default function FoodDayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [days, setDays] = useState([]);

  return (
    <FoodDayContext.Provider
      value={{ days, setDays }}
    >
      {children}
    </FoodDayContext.Provider>
  );
}
