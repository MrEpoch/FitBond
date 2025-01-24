import { UserHealthForm } from "@/components/shared/UserHealthForm";
import React from "react";

export default function page() {
  return (
    <div className="bg-main-background-100 h-view-container">
      <div className="max-w-container flex-col gap-8 flex items-center justify-center">
        <h1 className="text-3xl font-bold bg-main-100 rounded-xl p-4">
          Fill in your health profile
        </h1>
        <p className="text-lg text-main-text-100">
          We will use this to calculate your BMI
        </p>
        <div className="bg-main-background-200 max-w-[450px] shadow-lg rounded border border-black w-full">
          <UserHealthForm />
        </div>
      </div>
    </div>
  );
}
