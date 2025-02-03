"use client";
import React, { useEffect } from "react";
import ChartHealth from "./Chart";
import { generateAndFillDates, prepareNutrients } from "@/lib/DatesUtils";
import DashboardWriteDayModal from "@/components/shared/DashboardWriteDayModal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { Anton } from "next/font/google";
import FoodInfoModal from "@/components/shared/FoodInfoModal";

export default function ChartCarousel({
  daysHealth,
  userHealthProfile,
  foodData,
}) {
  const [daysHealthIndex, setDaysHealthIndex] = React.useState(50);
  const [daysNutrients, setDaysNutrients] = React.useState([]);
  const [days, setDays] = React.useState([]);

  useEffect(() => {
    const daysWithDates = generateAndFillDates(daysHealth);
    setDays(daysWithDates);
    setDaysNutrients(prepareNutrients(daysWithDates));
    console.log("ds", prepareNutrients(daysWithDates));
  }, []);

  return (
    <div className="h-full flex flex-col gap-2 p-8 rounded-lg w-full bg-main-background-300 col-span-2">
      <div className="flex gap-4 items-center justify-between w-full">
        <button
          onClick={() => setDaysHealthIndex(daysHealthIndex - 1)}
          className="w-fit h-full"
        >
          <ArrowLeft />
        </button>
        {daysNutrients.length > 0 && (
          <ChartHealth
            date={days[daysHealthIndex].dayDate}
            dayNutrients={daysNutrients[daysHealthIndex]}
            caloriesGoal={userHealthProfile.calories}
            fitnessGoal={userHealthProfile.fitnessGoal}
          />
        )}
        <button
          onClick={() => setDaysHealthIndex(daysHealthIndex + 1)}
          className="w-fit h-full"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="flex justify-between items-center gap-4 w-full">
        <DashboardActivityModal />
        <DashboardFoodModal foodData={foodData} />
      </div>
      <div className="flex flex-col gap-2 w-full py-16">
        {daysNutrients.length > 0 && (
          <>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="breakfast"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Breakfast"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.breakfast.map((food, i) => (
                  <FoodListItem key={i} food={food} />
                ))}
              </div>
            </div>
            <div className="w-full h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="firstSnack"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="First Snack"
              />
              {days[daysHealthIndex]?.firstSnack.map((food, i) => (
                <FoodListItem food={food} key={i} />
              ))}
            </div>
            <div className="w-full h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="lunch"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Lunch"
              />
              {days[daysHealthIndex]?.lunch.map((food, i) => (
                <FoodListItem food={food} key={i} />
              ))}
            </div>
            <div className="w-full h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="secondSnack"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Second Snack"
              />
              {days[daysHealthIndex]?.secondSnack.map((food, i) => (
                <FoodListItem food={food} key={i} />
              ))}
            </div>
            <div className="w-full h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="dinner"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Dinner"
              />
              {days[daysHealthIndex]?.dinner.map((food, i) => (
                <FoodListItem food={food} key={i} />
              ))}
            </div>
            <div className="w-full h-32 flex flex-col gap-4 rounded-lg bg-main-background-300">
              <FoodTimeHeader
                foodTime="secondDinner"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Second Dinner"
              />
              {days[daysHealthIndex]?.secondDinner.map((food, i) => (
                <FoodListItem food={food} key={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FoodListItem({ food }) {
  return (
    <li className="flex justify-between py-4 items-center w-full gap-2 border rounded p-4">
      <span>{food.foodName}</span>
      <div className="flex gap-2 items-center">
        <span>{food.calories100G * food.size} kcal</span>
        <FoodInfoModal food={food} />
      </div>
    </li>
  );
}

function FoodTimeHeader({ foodTime, foodData, dayDate, foodTimeText }) {
  return (
    <div className="flex bg-main-300 px-6 rounded-full justify-between border-b border-t py-4 items-center w-full gap-2">
      <p className={"text-main-text-100 text-lg"}>{foodTimeText}:</p>
      <DashboardWriteDayModal
        dayDate={dayDate}
        foodData={foodData}
        foodTime={foodTime}
      />
    </div>
  );
}
