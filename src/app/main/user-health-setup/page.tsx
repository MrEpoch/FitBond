import { UserHealthForm } from "@/components/shared/UserHealthForm";
import React from "react";

export default function page() {
  return (
    <div className="bg-main-background-100 h-view-container">
      <div className="max-w-container">
        <UserHealthForm />
      </div>
    </div>
  );
}
