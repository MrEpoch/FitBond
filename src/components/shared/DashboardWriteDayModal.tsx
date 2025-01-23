
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActivityForm } from "@/components/shared/ActivityForm";
import { Button } from "../ui/button";

export default function DashboardWriteDayModal() {
  const [showingModal, setShowingModal] = React.useState(false);

  function hideModal() {
    setShowingModal(false);
  }

  return (
    <Dialog onOpenChange={setShowingModal} open={showingModal}>
      <DialogTrigger asChild onClick={() => setShowingModal(true)}>
        <Button variant="outline">Add activity</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add activity</DialogTitle>
        </DialogHeader>
        <div className="h-full">
          <ActivityForm hideModal={hideModal} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
