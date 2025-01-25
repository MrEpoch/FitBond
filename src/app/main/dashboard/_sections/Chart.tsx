"use client";

import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

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
  } = { protein: 120, carbs: 200, fat: 30 };

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
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Grid</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={nutrientChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            fill="#fff"
            data={getNutrientInfo(caloriesGoal, fitnessGoal, dayNutrients)}
            innerRadius={30}
            outerRadius={100}
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContentNutrients hideLabel nameKey="nutrient" />
              }
            />
            <PolarGrid gridType="circle" />
            <RadialBar background dataKey="chart" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          0 / {caloriesGoal}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
