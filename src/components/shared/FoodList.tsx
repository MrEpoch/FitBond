import React from "react";
import { food } from "./FoodTypes";
import { ArrowDown, Info, Pen } from "lucide-react";

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

export default function FoodList({ data }: { data: food[] }) {
  const [foodInfo, setFoodInfo] = React.useState<food | null>(null);

  async function addFoodIntoDay(id: string) {

  }
  
  return (
    <div className="w-full">
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
          <button
        onClick={async() => await addFoodIntoDay(foodInfo.id)}
            className="text-gray-800 justify-center hover:text-gray-500 transition w-full flex items-center gap-2 border-gray-300 py-4"
          >
            <Pen />
          </button>
        </>
      ) : (
        <>
          <ul className="w-full flex flex-col gap-2">
            {data.map((food) => (
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
