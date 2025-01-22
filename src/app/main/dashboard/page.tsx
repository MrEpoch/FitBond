import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { getUserHealth } from "@/lib/actions/UserHealthActions";
import { getCurrentSession } from "@/lib/sessionTokens";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const { user, session } = await getCurrentSession();
  if (!user || !session) {
    return redirect("/auth/login");
  }

  const userHealthProfile = await getUserHealth(user.id);
  if (!userHealthProfile) {
    return redirect("/main/user-health-setup");
  }

  return (
    <div className="bg-main-background-100 h-view-container">
      <div className="max-w-container">
        <DashboardActivityModal />
        <DashboardFoodModal />
      </div>
    </div>
  );
}
