import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { getUserHealth } from "@/lib/actions/UserHealthActions";
import { getCurrentSession } from "@/lib/sessionTokens";
import { redirect } from "next/navigation";
import React from "react";
import DashboardWriteDayModal from "@/components/shared/DashboardWriteDayModal";
import { getDaysHealth } from "@/lib/actions/DailyWriteAction";
import ChartCarousel from "./_sections/ChartCarousel";
import { getFoods, getFoodsGlobal } from "@/lib/actions/FoodActions";

export default async function Page() {
  const { user, session } = await getCurrentSession();
  if (!user || !session) {
    return redirect("/auth/login");
  }

  const userHealthProfile = await getUserHealth(user.id);
  if (!userHealthProfile || userHealthProfile?.error) {
    return redirect("/main/user-health-setup");
  }

  const longTermData = await getDaysHealth();

  let foodData = await getFoodsGlobal();
  if (!foodData || foodData?.error) {
    foodData = [];
  }

  return (
    <div className="bg-main-background-100 h-view-container">
      <div className="max-w-container">
        <DashboardActivityModal />
        <DashboardFoodModal foodData={foodData} />
        <div className="grid grid-cols-2 gap-4 grid-rows-2">
          <ChartCarousel
            userHealthProfile={userHealthProfile}
            daysHealth={longTermData}
          />
          <div className="h-32 rounded-lg bg-main-background-300"></div>
          <div className="h-32 rounded-lg bg-main-background-300"></div>
        </div>
        <DashboardWriteDayModal data={foodData} />
      </div>
    </div>
  );
}
