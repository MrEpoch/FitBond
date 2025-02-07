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
import FoodList from "./FoodList";
import { Plus } from "lucide-react";

export default function DashboardWriteDayModal({
  foodData,
  foodTime,
  dayDate,
}: {
  foodData: any;
  foodTime:
    | "breakfast"
    | "dinner"
    | "secondDinner"
    | "lunch"
    | "secondSnack"
    | "firstSnack";
  dayDate: string;
}) {
  const [showingModal, setShowingModal] = React.useState(false);

  function hideModal() {
    setShowingModal(false);
  }

  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogTrigger asChild onClick={() => setShowingModal(true)}>
        <Button className="bg-main-300 text-main-background-100 transition rounded-full p-4 w-4 h-4">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 border-hidden shadow-lg bg-main-background-100 max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader className="hidden">
          <DialogTitle>{foodTime}</DialogTitle>
        </DialogHeader>
        <div className="h-full p-4">
          <FoodList
            closeModal={hideModal}
            foodTime={foodTime}
            dayDate={dayDate}
            data={foodData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
