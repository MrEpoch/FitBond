"use client";
import React from "react";

import { PolarAngleAxis, PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContentNutrients,
} from "@/components/ui/chart";
import FoodsDisplayList from "./FoodsDisplayList";

const nutrientChartConfig = {
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-1))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-2))",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--chart-3))",
  },
  fiber: {
    label: "Fiber",
    color: "hsl(var(--chart-4))",
  },
};

function getNutrientInfo(caloriesGoal, fitnessGoal, dayNutrients) {
  // Calculate the nutrient goals
  const proteinGoal =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.35
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.25
        : caloriesGoal * 0.35) / 4;
  const fatGoal =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.3
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.3
        : caloriesGoal * 0.45) / 9;
  const carbsGoal =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.35
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.45
        : caloriesGoal * 0.25) / 4;

  // Get today's current nutrients
  const {
    protein: proteinCurrent,
    fat: fatCurrent,
    carbs: carbsCurrent,
  } = dayNutrients;

  // Normalize the current values to a max of 10 based on the goals
  const maxScale = 10; // Maximum value in the chart
  const normalizedProtein = (proteinCurrent / proteinGoal) * maxScale;
  const normalizedFat = (fatCurrent / fatGoal) * maxScale;
  const normalizedCarbs = (carbsCurrent / carbsGoal) * maxScale;

  // Prepare data for Recharts
  return [
    {
      nutrient: "protein",
      chart: normalizedProtein.toFixed(2), // Limit to 2 decimal places
      goal: proteinGoal.toFixed(2),
      current: proteinCurrent.toFixed(2),
      fill: "var(--color-protein)",
    },
    {
      nutrient: "fat",
      chart: normalizedFat.toFixed(2),
      goal: fatGoal.toFixed(2),
      current: fatCurrent.toFixed(2),
      fill: "var(--color-fat)",
    },
    {
      nutrient: "carbs",
      chart: normalizedCarbs.toFixed(2),
      goal: carbsGoal.toFixed(2),
      current: carbsCurrent.toFixed(2),
      fill: "var(--color-carbs)",
    },
  ];
}

export default function ChartHealth({
  caloriesGoal,
  fitnessGoal,
  dayNutrients,
  date,
  foodData,
  animating,
}) {
  const [showingModal, setShowingModal] = React.useState(false);
  const [selectedNutrientType, setSelectedNutrientType] =
    React.useState<string>("");

  return (
    <Card
      className={
        "flex transition flex-col border-hidden shadow-lg bg-main-background-100 " +
        (animating ? "" : "")
      }
    >
      <CardHeader className="items-center pb-0">
        <CardTitle>Your daily nutrients</CardTitle>
        <CardDescription>{new Date(date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <FoodsDisplayList
          foodsData={foodData}
          showingModal={showingModal}
          nutrientType={selectedNutrientType}
          setShowingModal={setShowingModal}
        />

        <ChartContainer
          config={nutrientChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={getNutrientInfo(caloriesGoal, fitnessGoal, dayNutrients)}
            innerRadius={30}
            outerRadius={100}
            onClick={(e) => {
              if (e?.activePayload && e?.activePayload.length > 0) {
                setSelectedNutrientType(e?.activePayload[0].payload.nutrient);
                setShowingModal(true);
              }
            }}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContentNutrients hideLabel nameKey="nutrient" />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, 10]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar background dataKey="chart" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {dayNutrients.calories} / {caloriesGoal}
        </div>
        <div className="leading-none text-muted-foreground">
          {dayNutrients.protein.toFixed(2)}g protein /{" "}
          {dayNutrients.fat.toFixed(2)}g fat / {dayNutrients.carbs.toFixed(2)}g
          carbs
        </div>
      </CardFooter>
    </Card>
  );
}
