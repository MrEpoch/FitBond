import React from "react";
import { food } from "./FoodTypes";
import { ArrowDown, Info, Pen, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { foodSearch } from "@/lib/actions/FoodActions";
import { Button } from "../ui/button";
import { createDailyWrite } from "@/lib/actions/DailyWriteAction";

const rowNames = [
  "Food Name",
  "Protein",
  "Calories",
  "Fibers",
  "Carbohydrates",
  "Salt",
  "Sugar",
  "Fats",
  "Saturated Fats",
  "Monounsaturated Fats",
  "Polyunsaturated Fats",
  "Trans Fats",
];

async function debounce<T>(value: T, wait: number) {
  return new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, wait);
  });
}

export default function FoodList({
  data,
  dayDate,
  foodTime,
}: {
  data: food[];
  dayDate: string;
  foodTime: string;
}) {
  const [foodInfo, setFoodInfo] = React.useState<food | null>(null);
  const [foodData, setFoodData] = React.useState<food[]>(data);
  const [foodSize, setFoodSize] = React.useState(0);

  async function addFoodIntoDay(id: string) {
    try {
      const formData = new FormData();

      formData.append("id", id);
      formData.append("size", foodSize.toString());
      formData.append("dayDate", dayDate);

      const addedFood = await createDailyWrite(formData, foodTime);
      console.log(addedFood);

      if (!addedFood || addedFood.error) {
        console.log("Error adding food into day", addedFood.error);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function filterData(e) {
    if (e.target.value && e.target.value.length > 3) {
      console.log(e.target.value);
      const searchedFoodData = await debounce(
        await foodSearch(e.target.value),
        500,
      );
      if (!searchedFoodData || searchedFoodData.error) {
        return;
      }
      const filtered = searchedFoodData.filter(
        (food) =>
          foodData.filter((foodLoaded) => food.id !== foodLoaded.id).length ===
          0,
      );

      setFoodData([
        ...filtered,
        ...data.filter((food) =>
          food.foodName.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      ]);
    } else if (e.target.value) {
      setFoodData(
        data.filter((food) =>
          food.foodName.toLowerCase().includes(e.target.value.toLowerCase()),
        ),
      );
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-center">
        <Input
          placeholder="Filter food"
          onChange={filterData}
          className="max-w-sm"
        />
        <Button onClick={() => setFoodData(data)} variant="outline">
          <RefreshCw />
        </Button>
      </div>
      {foodInfo ? (
        <>
          <button
            onClick={() => setFoodInfo(null)}
            className="text-gray-800 hover:text-gray-500 transition w-fit flex justify-start items-center gap-2 border-gray-300 py-4"
          >
            All items
          </button>
          <ul className="flex flex-col gap-2">
            {Object.entries(foodInfo).map((food, i) => {
              if (i === 0) {
                return null;
              }
              return (
                <li
                  className="flex justify-between border-t border-b py-4 items-center w-full gap-2"
                  key={i}
                >
                  <span>{rowNames[i - 1]}</span>
                  <span>{food[1]}</span>
                </li>
              );
            })}
          </ul>
          <Input
            placeholder="Food Size"
            type="number"
            step="0.01"
            onChange={(e) => setFoodSize(Number(e.target.value))}
            className="max-w-sm"
          />
          <button
            onClick={async () => await addFoodIntoDay(foodInfo.id)}
            className="text-gray-800 justify-center hover:text-gray-500 transition w-full flex items-center gap-2 border-gray-300 py-4"
          >
            <Pen />
          </button>
        </>
      ) : (
        <>
          <ul className="w-full flex flex-col gap-2">
            {foodData.map((food) => (
              <li
                className="flex justify-between border-t border-b py-4 items-center w-full gap-2"
                key={food.id}
              >
                <button onClick={() => setFoodInfo(food)}>
                  {food.foodName}
                </button>
                <button onClick={() => setFoodInfo(food)}>
                  <Info />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setFoodInfo(null)}
            className="text-gray-800 justify-center hover:text-gray-500 transition w-full flex items-center gap-2 border-gray-300 py-4"
          >
            <ArrowDown />
          </button>
        </>
      )}
    </div>
  );
}
