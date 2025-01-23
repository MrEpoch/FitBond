import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { getUserHealth } from "@/lib/actions/UserHealthActions";
import { getCurrentSession } from "@/lib/sessionTokens";
import { redirect } from "next/navigation";
import React from "react";
import ChartHealth from "./_sections/Chart";
import DashboardWriteDayModal from "@/components/shared/DashboardWriteDayModal";

export default async function Page() {
  const { user, session } = await getCurrentSession();
  if (!user || !session) {
    return redirect("/auth/login");
  }

  const userHealthProfile = await getUserHealth(user.id);
  if (!userHealthProfile || userHealthProfile?.error) {
    return redirect("/main/user-health-setup");
  }

  console.log(userHealthProfile);

  return (
    <div className="bg-main-background-100 h-view-container">
      <div className="max-w-container">
        <DashboardActivityModal />
        <DashboardFoodModal />
        <div className="grid grid-cols-2 gap-4 grid-rows-2">
          <div className="h-32 rounded-lg bg-main-background-300 col-span-2">
            <ChartHealth fitnessGoal={userHealthProfile?.fitnessGoal} caloriesGoal={userHealthProfile?.calories} />
          </div>
          <div className="h-32 rounded-lg bg-main-background-300"></div>
          <div className="h-32 rounded-lg bg-main-background-300"></div>
        </div>
        <DashboardWriteDayModal />
      </div>
    </div>
  );
}
