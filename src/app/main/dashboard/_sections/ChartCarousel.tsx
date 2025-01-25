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
  const [daysNutrients, setDaysNutrients] = React.useState([]);

  useEffect(() => {
    const daysWithDates = generateAndFillDates(daysHealth);
    setDaysNutrients(prepareNutrients(daysWithDates));
  }, []);

  console.log(daysNutrients[0]);

  return (
    <div className="h-32 rounded-lg bg-main-background-300 col-span-2">
      <button className="w-full h-full">Prev</button>
      {daysNutrients.length > 0 && (
        <ChartHealth
          dayNutrients={daysNutrients[daysHealthIndex]}
          caloriesGoal={userHealthProfile.calories}
          fitnessGoal={userHealthProfile.fitnessGoal}
        />
      )}
      <button className="w-full h-full">next</button>
    </div>
  );
}
