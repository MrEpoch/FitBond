"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Info, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteFoodFromDay } from "@/lib/actions/DailyWriteAction";
import { useFoodDay } from "./FoodDayContext";

export default function FoodInfoModal({ food, daysHealthIndex, foodTime }: { food: any; daysHealthIndex: number; foodTime: string }) {
  const [showingModal, setShowingModal] = React.useState(false);
  const { toast } = useToast();
  const { days, setDays } = useFoodDay();

  function hideModal() {
    setShowingModal(false);
  }

  async function deleteFoodFromDayIntake() {
    try {
      const deleted = await deleteFoodFromDay(food.foodTimedId);
      if (!deleted || deleted.error) {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Food deleted successfully",
        variant: "default",
      });

      setDays(
        days.map((day: any, index: number) => {
          if (index === daysHealthIndex) {
            return {
              ...day,
              [foodTime]: day[foodTime].filter((f: any) => f.foodTimedId !== food.foodTimedId),
            };
          }
          return day;
        }))
      hideModal();

    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogTrigger asChild onClick={() => setShowingModal(true)}>
        <Button className="rounded-full p-4 w-4 h-4">
          <Info />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 max-h-[90vh] border-hidden shadow-lg w-full max-w-lg overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Food Information</DialogTitle>
        </DialogHeader>
        <div className="h-full bg-main-background-200 text-main-text-100 p-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-2 rounded p-4">
            <li className="border-b p-2">
              <strong>Name:</strong> {food.foodName}
            </li>
            <li className="border-b p-2">
              <strong>Calories:</strong> {food.calories100G} kcal
            </li>
            <li className="border-b p-2">
              <strong>Portion:</strong> {food.size}
            </li>
            <li className="border-b p-2">
              <strong>Protein:</strong> {food.protein100G} g
            </li>
            <li className="border-b p-2">
              <strong>Fat:</strong> {food.fats100G} g
            </li>
            <li className="border-b p-2">
              <strong>Carbs:</strong> {food.carbohydrates100G} g
            </li>
          </ul>
          <div className="w-full items-center justify-center flex">
            <Button
              onClick={deleteFoodFromDayIntake}
              className="rounded-full bg-main-300 text-main-text-100 hover:bg-main-200 p-6 w-4 h-4"
            >
              <Trash />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
