"use client";
import React, { useEffect } from "react";
import ChartHealth from "./Chart";
import {
  generateAndFillDates,
  prepareNutrientList,
  prepareNutrients,
} from "@/lib/DatesUtils";
import DashboardWriteDayModal from "@/components/shared/DashboardWriteDayModal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { Anton } from "next/font/google";
import FoodInfoModal from "@/components/shared/FoodInfoModal";
import { useFoodDay } from "@/components/shared/FoodDayContext";
import Stats from "./Stats";

export default function ChartCarousel({
  daysHealth,
  userHealthProfile,
  foodData,
}) {
  const [daysHealthIndex, setDaysHealthIndex] = React.useState(50);
  const [daysNutrients, setDaysNutrients] = React.useState([]);
  const { days, setDays } = useFoodDay();

  useEffect(() => {
    setDays(generateAndFillDates(daysHealth));
  }, []);

  useEffect(() => {
    setDaysNutrients(prepareNutrients(days));
  }, [days]);

  const [isAnimating, setIsAnimating] = React.useState(false);

  function animateChart() {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }

  return (
    <div className="h-full flex flex-col gap-2 p-8 rounded-lg w-full bg-main-background-200 col-span-2">
      <div className="flex gap-4 items-center justify-between w-full">
        <button
          onClick={() => {
            setDaysHealthIndex(daysHealthIndex - 1);
            animateChart();
          }}
          className="w-fit h-full"
        >
          <ArrowLeft />
        </button>
        {daysNutrients.length > 0 && (
          <ChartHealth
            foodData={prepareNutrientList(days[daysHealthIndex] ?? [])}
            date={days[daysHealthIndex].dayDate}
            dayNutrients={daysNutrients[daysHealthIndex]}
            caloriesGoal={userHealthProfile.calories}
            fitnessGoal={userHealthProfile.fitnessGoal}
            animating={isAnimating}
          />
        )}
        <button
          onClick={() => {
            setDaysHealthIndex(daysHealthIndex + 1);
            animateChart();
          }}
          className="w-fit h-full"
        >
          <ArrowRight />
        </button>
      </div>
      <div className="flex justify-between items-center py-8 gap-4 w-full">
        <div className="w-full flex justify-start px-4">
          <DashboardActivityModal />
        </div>
        <Stats userHealthProfile={userHealthProfile} />
        <div className="w-full flex justify-end px-4">
          <DashboardFoodModal foodData={foodData} />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full py-16">
        {daysNutrients.length > 0 && (
          <>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="breakfast"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Breakfast"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.breakfast.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="breakfast"
                    key={i}
                    food={food}
                  />
                ))}
              </div>
            </div>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="firstSnack"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="First Snack"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.firstSnack.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="firstSnack"
                    food={food}
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="lunch"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Lunch"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.lunch.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="lunch"
                    food={food}
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="secondSnack"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Second Snack"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.secondSnack.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="secondSnack"
                    food={food}
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="dinner"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Dinner"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.dinner.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="dinner"
                    food={food}
                    key={i}
                  />
                ))}
              </div>
            </div>
            <div className="w-full min-h-32 flex flex-col gap-4 rounded-lg">
              <FoodTimeHeader
                foodTime="secondDinner"
                foodData={foodData}
                dayDate={days[daysHealthIndex].dayDate}
                foodTimeText="Second Dinner"
              />
              <div className="flex px-6 h-full justify-between items-center w-full gap-2">
                {days[daysHealthIndex]?.secondDinner.map((food, i) => (
                  <FoodListItem
                    daysHealthIndex={daysHealthIndex}
                    foodTime="secondDinner"
                    food={food}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FoodListItem({ food, daysHealthIndex, foodTime }) {
  return (
    <li className="flex justify-between py-4 items-center w-full gap-2 text-main-text-200 p-4">
      <span>{food.foodName}</span>
      <div className="flex gap-2 items-center">
        <span>{food.calories100G * food.size} kcal</span>
        <FoodInfoModal
          daysHealthIndex={daysHealthIndex}
          foodTime={foodTime}
          food={food}
        />
      </div>
    </li>
  );
}

function FoodTimeHeader({ foodTime, foodData, dayDate, foodTimeText }) {
  return (
    <div className="flex bg-main-background-100 px-6 rounded-full justify-between text-main-text-200 py-4 items-center w-full gap-2">
      <p className={"text-main-text-100 text-lg"}>{foodTimeText}:</p>
      <DashboardWriteDayModal
        dayDate={dayDate}
        foodData={foodData}
        foodTime={foodTime}
      />
    </div>
  );
}
