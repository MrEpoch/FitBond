import React from "react";
import { food } from "./FoodTypes";
import { ArrowDown, Info, Pen, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { foodSearch } from "@/lib/actions/FoodActions";
import { Button } from "../ui/button";
import { createDailyWrite } from "@/lib/actions/DailyWriteAction";
import { useFoodDay } from "./FoodDayContext";
import { useToast } from "@/hooks/use-toast";

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
  closeModal,
}: {
  data: food[];
  dayDate: string;
  foodTime: string;
  closeModal: () => void;
}) {
  const [foodInfo, setFoodInfo] = React.useState<food | null>(null);
  const [foodData, setFoodData] = React.useState<food[]>(data);
  const [foodSize, setFoodSize] = React.useState(0);
  const [filteredSearch, setFilteredSearch] = React.useState<string>("");
  const [foodCount, setFoodCount] = React.useState(25);
  const { days, setDays } = useFoodDay();
  const { toast } = useToast();

  async function addFoodIntoDay(id: string) {
    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("size", foodSize.toString());
      formData.append("dayDate", dayDate);

      const addedFood = await createDailyWrite(formData, foodTime);

      if (!addedFood || addedFood.error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        })
        return;
      }

      toast({
        title: "Success",
        description: "Food added successfully",
        variant: "default",
      });

      setDays(
        days.map((day: any) => {
          if (day.dayDate === dayDate) {
            return {
              ...day,
              [foodTime]: [...day[foodTime], addedFood.data],
            };
          }
          return day;
        })
      );
      closeModal();
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
      console.log(e);
    }
  }

  async function loadMoreData() {
    try {
      const searchedFoodData = await debounce(
        await foodSearch(filteredSearch, 25, foodCount),
        500,
      );

      if (!searchedFoodData || searchedFoodData.error) {
        return;
      }

      const filtered = searchedFoodData.filter(
        (food) =>
          foodData.filter((foodLoaded) => food.id === foodLoaded.id).length ===
          0,
      );

      setFoodData([...foodData, ...filtered]);
      setFoodInfo(null);

      setFoodCount(foodCount + filtered.length);
    } catch (e) {
      toast({
        title: "Error",
        description: "Searching failed",
        variant: "destructive",
      })
      console.log(e);
    }
  }

  async function filterData(e) {
    try {
      if (e.target.value && e.target.value.length > 3) {
        const searchedFoodData = await debounce(
          await foodSearch(e.target.value),
          500,
        );
        if (!searchedFoodData || searchedFoodData.error) {
          return;
        }
        setFilteredSearch(e.target.value);

        const filtered = searchedFoodData.filter(
          (food) =>
            foodData.filter((foodLoaded) => food.id !== foodLoaded.id).length ===
            0,
        );

        setFoodData([
          ...data.filter((food) =>
            food.foodName.toLowerCase().includes(e.target.value.toLowerCase()),
          ),
          ...filtered,
        ]);
        setFoodCount(25);
      } else if (e.target.value) {
        setFoodData(
          data.filter((food) =>
            food.foodName.toLowerCase().includes(e.target.value.toLowerCase()),
          ),
        );
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Searching failed",
        variant: "destructive",
      })
      console.log(e);
    }
  }

  return (
    <div className="w-full text-main-text-100 p-2 rounded flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-center">
        <Input
          placeholder="Filter food"
          onChange={async (e) => {
            setFilteredSearch(e.target.value);
            await filterData(e);
          }}
          value={filteredSearch}
          className="max-w-sm"
        />
        <Button
          onClick={() => {
            setFoodData(data);
            setFilteredSearch("");
          }}
          variant="outline"
        >
          <RefreshCw />
        </Button>
      </div>
      {foodInfo ? (
        <>
          <button
            onClick={() => setFoodInfo(null)}
            className="hover:underline transition w-fit flex justify-start items-center gap-2 border-gray-300 py-4"
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
                  className="flex justify-between border-main-text-200 border-b py-4 items-center w-full gap-2"
                  key={i}
                >
                  <span>{rowNames[i - 1]}</span>
                  <span>{food[1]}</span>
                </li>
              );
            })}
          </ul>
          <div className="w-full h-32 flex md:flex-row flex-col justify-between items-center gap-4 rounded-lg">
            <Input
              placeholder="Food Size"
              type="number"
              step="0.01"
              onChange={(e) => setFoodSize(Number(e.target.value))}
              className="max-w-sm w-full"
            />
            <button
              onClick={async () => await addFoodIntoDay(foodInfo.id)}
              className="justify-center hover:text-gray-500 transition flex items-center gap-2 border-gray-300 py-4"
            >
              <Pen />
            </button>
          </div>
        </>
      ) : (
        <>
          <ul className="w-full flex flex-col gap-4">
            {foodData.map((food) => (
              <li
                className="flex justify-between shadow px-4 rounded-lg shadow-main-background-200 py-4 items-center w-full gap-2"
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
            onClick={loadMoreData}
            className="justify-center hover:text-gray-500 transition w-full flex items-center gap-2 border-gray-300 py-4"
          >
            <ArrowDown />
          </button>
        </>
      )}
    </div>
  );
}
