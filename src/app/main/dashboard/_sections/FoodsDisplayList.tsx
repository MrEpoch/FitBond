import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      <DialogContent className="p-4 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>Food Information</DialogTitle>
        </DialogHeader>
        <div className="h-full p-4 flex flex-col gap-4">
          <ul className="flex flex-col gap-2 border rounded p-4">
            {foodsData.map((food, i) => (
              <li
                key={i}
                className="flex justify-between py-4 items-center w-full gap-2 border rounded p-4"
              >
                <span>{food.foodName}</span>
                <span>{food[nutrientType]}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
