"use server";

import { db } from "@/db";
import {
  activity,
  dailyHealthInfo,
  food,
  foodTimedTable,
  userHealthInfo,
} from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const singularFoodAdd = z.object({
  dayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  size: z.coerce.number().positive(),
  id: z.string().length(36),
});

export async function createDailyWrite(formData: FormData, foodTime: string) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const userHealth = await db
      .select()
      .from(userHealthInfo)
      .where(eq(userHealthInfo.userId, user.id))
      .limit(1)
      .execute();
    if (userHealth.length === 0) {
      return { error: "User health info not found", code: 404 };
    }

    const parsedFormData = Object.fromEntries(formData.entries());

    const validatedData = singularFoodAdd.safeParse(parsedFormData);

    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const foodTimeValidation = z
      .string()
      .regex(/^(breakfast|lunch|firstSnack|secondSnack|dinner|secondDinner)$/)
      .safeParse(foodTime);

    if (!foodTimeValidation.success) {
      return { error: "Invalid food time", code: 400 };
    }

    const { dayDate, id, size } = validatedData.data;

    const doesDayExist = await db
      .select()
      .from(dailyHealthInfo)
      .where(
        and(
          eq(dailyHealthInfo.userHealthId, userHealth[0].id),
          eq(dailyHealthInfo.dayDate, dayDate),
        ),
      );
    const getFood = await db.select().from(food).where(eq(food.id, id));

    if (getFood.length === 0) {
      return { error: "Food not found", code: 404 };
    }

    const foodTimed = await db
      .insert(foodTimedTable)
      .values({
        foodTime: foodTimeValidation.data as
          | "breakfast"
          | "lunch"
          | "dinner"
          | "firstSnack"
          | "secondSnack"
          | "secondDinner",
        dayDate: dayDate,
        foodSize: size,
        foodId: getFood[0].id,
      })
      .returning();

    if (foodTimed.length === 0) {
      return { error: "Food timed not found", code: 404 };
    }

    let data;

    if (doesDayExist.length > 0) {
      data = await db
        .update(dailyHealthInfo)
        .set({
          [foodTimeValidation.data as keyof (typeof doesDayExist)[0]]: [
            ...(doesDayExist[0][
              foodTimeValidation.data as keyof (typeof doesDayExist)[0]
            ] as []),
            foodTimed[0].id,
          ],
        })
        .where(
          and(
            eq(dailyHealthInfo.userHealthId, userHealth[0].id),
            eq(dailyHealthInfo.dayDate, dayDate),
          ),
        );
    } else {
      data = await db.insert(dailyHealthInfo).values({
        userHealthId: userHealth[0].id,
        dayDate: dayDate,
        [foodTimeValidation.data as keyof (typeof doesDayExist)[0]]: [
          foodTimed[0].id,
        ],
      });
    }

    revalidatePath("/main/dashboard");
    return {
      data: {
        ...getFood[0],
        foodTimedId: foodTimed[0].id,
        size: foodTimed[0].foodSize,
      },
      success: "Daily write created",
      code: 200,
    };
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}

export async function deleteFoodFromDay(id: string) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);
    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const deletedFoodTime = await db
      .delete(foodTimedTable)
      .where(eq(foodTimedTable.id, id))
      .returning();

    const userHealth = await db
      .select()
      .from(userHealthInfo)
      .where(eq(userHealthInfo.userId, user.id))
      .limit(1)
      .execute();
    if (userHealth.length === 0) {
      return { error: "User health info not found", code: 404 };
    }

    const dailyHealthInfoData = await db
      .select()
      .from(dailyHealthInfo)
      .where(
        and(
          eq(dailyHealthInfo.userHealthId, userHealth[0].id),
          eq(dailyHealthInfo.dayDate, deletedFoodTime[0].dayDate),
        ),
      );
    if (dailyHealthInfoData.length === 0) {
      return { error: "Daily health info not found", code: 404 };
    }

    await db
      .update(dailyHealthInfo)
      .set({
        [deletedFoodTime[0].foodTime as keyof (typeof dailyHealthInfoData)[0]]:
          dailyHealthInfoData[0][
            deletedFoodTime[0].foodTime as keyof (typeof dailyHealthInfoData)[0]
          ]?.filter((x) => x !== deletedFoodTime[0].id),
      })
      .where(
        and(
          eq(dailyHealthInfo.userHealthId, userHealth[0].id),
          eq(dailyHealthInfo.dayDate, deletedFoodTime[0].dayDate),
        ),
      );

    revalidatePath("/main/dashboard");

    return {
      success: "Daily write deleted",
      code: 200,
    };
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}

export async function getDaysHealth(count = 100, offset = 0) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const userHealth = await db
      .select()
      .from(userHealthInfo)
      .where(eq(userHealthInfo.userId, user.id))
      .limit(1);

    if (!userHealth[0]) {
      return { error: "User health not found", code: 404 };
    }

    const daysHealth = await db
      .select()
      .from(dailyHealthInfo)
      .where(eq(dailyHealthInfo.userHealthId, userHealth[0].id))
      .orderBy(desc(dailyHealthInfo.dayDate))
      .limit(count)
      .offset(offset);

    if (daysHealth.length === 0) {
      return [];
    }

    // Step 2: Collect all foodTimeTable IDs (breakfast, firstSnack, etc. contain IDs from foodTimeTable)
    const allFoodTimeIds = [
      ...new Set(
        daysHealth.flatMap((day) => [
          ...day.breakfast,
          ...day.firstSnack,
          ...day.lunch,
          ...day.secondSnack,
          ...day.dinner,
          ...day.secondDinner,
        ]),
      ),
    ];

    if (allFoodTimeIds.length === 0) {
      return daysHealth.map((day) => ({
        ...day,
        breakfast: [],
        firstSnack: [],
        lunch: [],
        secondSnack: [],
        dinner: [],
        secondDinner: [],
      }));
    }

    // Step 3: Fetch foodTimeTable entries to get `{ id, foodId, size }`
    const foodTimeEntries = await db
      .select()
      .from(foodTimedTable)
      .where(inArray(foodTimedTable.id, allFoodTimeIds));

    // Step 4: Collect all unique food IDs from `foodTimeTable`
    const allFoodIds = [
      ...new Set(foodTimeEntries.map((entry) => entry.foodId)),
    ];

    if (allFoodIds.length === 0) {
      return daysHealth.map((day) => ({
        ...day,
        breakfast: [],
        firstSnack: [],
        lunch: [],
        secondSnack: [],
        dinner: [],
        secondDinner: [],
      }));
    }

    // Step 5: Fetch food details
    const foods = await db
      .select()
      .from(food)
      .where(inArray(food.id, allFoodIds));

    // Step 6: Create a map for quick lookup
    const foodMap = new Map(foods.map((item) => [item.id, item]));

    // Step 7: Create a map of foodTimeTable ID to `{ food, size }`
    const foodTimeMap = new Map(
      foodTimeEntries.map((entry) => [
        entry.id,
        {
          ...foodMap.get(entry.foodId),
          size: entry.foodSize,
          foodTimedId: entry.id,
        },
      ]),
    );

    // Step 8: Attach food details with size to each meal time
    const daysHealthWithFoods = daysHealth.map((day) => ({
      ...day,
      breakfast: day.breakfast.map((id) => foodTimeMap.get(id)).filter(Boolean),
      firstSnack: day.firstSnack
        .map((id) => foodTimeMap.get(id))
        .filter(Boolean),
      lunch: day.lunch.map((id) => foodTimeMap.get(id)).filter(Boolean),
      secondSnack: day.secondSnack
        .map((id) => foodTimeMap.get(id))
        .filter(Boolean),
      dinner: day.dinner.map((id) => foodTimeMap.get(id)).filter(Boolean),
      secondDinner: day.secondDinner
        .map((id) => foodTimeMap.get(id))
        .filter(Boolean),
    }));

    return daysHealthWithFoods;
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}
