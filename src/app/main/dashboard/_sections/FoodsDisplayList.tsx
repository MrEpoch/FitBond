import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function FoodsDisplayList({
  foodsData,
  nutrientType,
  showingModal,
  setShowingModal,
}) {
  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogContent className="bg-main-background-100 border-hidden shadow-lg p-4 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader className="text-lg p-2 font-normal">
          <DialogTitle className="text-main-text-100">
            Nutrient details
          </DialogTitle>
        </DialogHeader>
        <div className="h-full p-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-2 rounded p-4">
            {nutrientType.length > 0 &&
              foodsData[nutrientType] &&
              foodsData[nutrientType].filter((food) => food[nutrientType] > 0).map((food, i) => (
                <li
                  key={i}
                  className="shadow-lg bg-main-background-200 flex justify-between py-4 items-center w-full gap-2 rounded p-4"
                >
                  <span>{food.foodName}</span>
                  <span>
                    {food[nutrientType]}{" "}
                    {nutrientType === "protein"
                      ? "Proteins"
                      : nutrientType === "fat"
                        ? "Fats"
                        : "Carbohydrates"}{" "}
                    g
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
