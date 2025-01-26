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
import { FoodForm } from "./FoodForm";
import FoodDisplayTable from "./FoodDisplayTable";
import { columns, food } from "./FoodTypes";
import FoodList from "./FoodList";

export default function DashboardFoodModal({ foodData }: { foodData: food[] }) {
  const [showingModal, setShowingModal] = React.useState(false);

  function hideModal() {
    setShowingModal(false);
  }

  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogTrigger asChild onClick={() => setShowingModal(true)}>
        <Button variant="outline">Add food</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add food</DialogTitle>
        </DialogHeader>
        <div className="h-full w-full">
          <FoodList data={foodData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
