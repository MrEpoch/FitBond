"use client";
import React, { useEffect } from "react";
import ChartHealth from "./Chart";
import {
  generateAndFillDates,
  prepareFoods,
  prepareNutrients,
} from "@/lib/DatesUtils";

export default function ChartCarousel({ daysHealth, userHealthProfile }) {
  const [daysHealthIndex, setDaysHealthIndex] = React.useState(0);
  const [daysHealthState, setDaysHealthState] = React.useState(null);
  const [daysFoods, setDaysFoods] = React.useState(null);

  useEffect(() => {
    const daysWithDates = generateAndFillDates(daysHealth);
    setDaysFoods(prepareFoods(dayWithDates));
  }, []);

  console.log(daysHealthState);

  return (
    <div className="h-32 rounded-lg bg-main-background-300 col-span-2">
      <button className="w-full h-full">Prev</button>
      <button className="w-full h-full">next</button>
    </div>
  );
}
