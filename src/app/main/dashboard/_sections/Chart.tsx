"use client";

import { TrendingUp } from "lucide-react";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { browser: "chrome", visitors: 5, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 10, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 10, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 10, fill: "var(--color-edge)" },
  { browser: "other", visitors: 10, fill: "var(--color-other)" },
];

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

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function getNutrientInfo(caloriesGoal, fitnessGoal, dayNutrients) {
  const protein =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.35
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.25
        : caloriesGoal * 0.35) / 4;
  const fat =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.3
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.3
        : caloriesGoal * 0.45) / 9;
  const carbs =
    (fitnessGoal === "weight_loss"
      ? caloriesGoal * 0.35
      : fitnessGoal === "maintain_weight"
        ? caloriesGoal * 0.45
        : caloriesGoal * 0.25) / 4;

  const maxNutrientValue = Math.max(protein, fat, carbs);

  // Scaling factor to fit into a scale of 10
  const scalingFactor = 10 / maxNutrientValue;

  // Scale each nutrient value
  const scaledProtein = protein * scalingFactor;
  const scaledFat = fat * scalingFactor;
  const scaledCarbs = carbs * scalingFactor;

  return [
    {
      nutrient: "protein",
      goal: scaledProtein - dayNutrients.protein * scalingFactor,
      fill: "var(--color-protein)",
    },
    {
      nutrient: "fat",
      goal: scaledFat - dayNutrients.fat * scalingFactor,
      fill: "var(--color-fat)",
    },
    {
      nutrient: "carbs",
      goal: scaledCarbs - dayNutrients.carbs * scalingFactor,
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
              content={<ChartTooltipContent hideLabel nameKey="nutrient" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar background dataKey="goal" />
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
