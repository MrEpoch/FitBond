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
import { Apple } from "lucide-react";

export default function DashboardFoodModal() {
  const [showingModal, setShowingModal] = React.useState(false);

  function hideModal() {
    setShowingModal(false);
  }

  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogTrigger asChild onClick={() => setShowingModal(true)}>
        <Button className="rounded-lg w-8 h-8 p-5">
          <Apple width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto text-main-text-100 bg-main-background-100 border-hidden shadow-lg">
        <DialogHeader>
          <DialogTitle>Add food</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          <FoodForm hideModal={hideModal} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
