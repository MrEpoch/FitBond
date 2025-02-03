import DashboardActivityModal from "@/components/shared/DashboardActivityModal";
import DashboardFoodModal from "@/components/shared/DashboardFoodModal";
import { getUserHealth } from "@/lib/actions/UserHealthActions";
import { getCurrentSession } from "@/lib/sessionTokens";
import { redirect } from "next/navigation";
import React from "react";
import { getDaysHealth } from "@/lib/actions/DailyWriteAction";
import ChartCarousel from "./_sections/ChartCarousel";
import { getFoodsGlobal } from "@/lib/actions/FoodActions";

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
        <div className="flex">
          <ChartCarousel
            foodData={foodData}
            userHealthProfile={userHealthProfile}
            daysHealth={longTermData}
          />
        </div>
      </div>
    </div>
  );
}
