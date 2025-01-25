"use server";

import { db } from "@/db";
import { activity, dailyHealthInfo, food, userHealthInfo } from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  dayDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  breakfast: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  firstSnack: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  lunch: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  secondSnack: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  dinner: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  secondDinner: z.array(
    z.object({
      size: z.number().positive(),
      id: z.string().length(36),
    }),
  ),
  activity: z.array(z.string().length(36)),
});

export async function createDailyWrite(formData: FormData) {
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

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const {
      dayDate,
      breakfast,
      firstSnack,
      lunch,
      secondSnack,
      dinner,
      secondDinner,
      activity,
    } = validatedData.data;

    await db.insert(dailyHealthInfo).values({
      userHealthId: userHealth[0].id,
      breakfast: breakfast,
      firstSnack: firstSnack,
      lunch: lunch,
      secondSnack: secondSnack,
      dinner: dinner,
      secondDinner: secondDinner,
      activity: activity,
      dayDate: dayDate,
    });

    revalidatePath("/main/dashboard");
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}

export async function updateActivity(formData: FormData, id: string) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }
    const parsedFormData = Object.fromEntries(formData.entries());
    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const { weight, duration, sets, repetitions, activityKind } =
      validatedData.data;

    if (activityKind === "movement") {
      await db
        .update(activity)
        .set({
          activity: "movement",
          duration: duration,
          repetitions: null,
          sets: null,
          weight: null,
        })
        .where(and(eq(activity.id, id_val.data), eq(activity.userId, user.id)));
    } else if (activityKind === "weight_based") {
      await db
        .update(activity)
        .set({
          activity: "weight_based",
          duration: null,
          weight: weight,
          sets: sets,
          repetitions: repetitions,
        })
        .where(and(eq(activity.id, id_val.data), eq(activity.userId, user.id)));
    } else {
      throw new Error("Invalid data");
    }

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function deleteActivity(id: string) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);
    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    await db
      .delete(activity)
      .where(and(eq(activity.id, id), eq(activity.userId, user.id)));
    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getActivity(id: string) {
  try {
    const { session, user } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const one_activity = await db
      .select()
      .from(activity)
      .where(and(eq(activity.id, id_val.data), eq(activity.userId, user.id)));

    return one_activity;
  } catch (e) {
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
      return []; // Return early if no data is found
    }

    // Step 2: Collect all unique food IDs
    const allFoodIds = [
      ...new Set(
        daysHealth.flatMap((day) => [
          ...day.breakfast.map((item) => item.id),
          ...day.firstSnack.map((item) => item.id),
          ...day.lunch.map((item) => item.id),
          ...day.secondSnack.map((item) => item.id),
          ...day.dinner.map((item) => item.id),
          ...day.secondDinner.map((item) => item.id),
        ]),
      ),
    ];

    if (allFoodIds.length === 0) {
      // No food IDs, return daysHealth with empty food details
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

    // Step 3: Fetch food details for all unique food IDs
    const foods = await db
      .select()
      .from(food)
      .where(inArray(food.id, allFoodIds));

    // Step 4: Create a map of food details by ID for quick lookup
    const foodMap = new Map(foods.map((item) => [item.id, item]));

    // Step 5: Attach food details along with size to the respective meal arrays
    const daysHealthWithFoods = daysHealth.map((day) => ({
      ...day,
      breakfast: day.breakfast
        .map((item) => ({
          ...foodMap.get(item.id), // Get food details
          size: item.size, // Include size from the meal data
        }))
        .filter((food) => food.id), // Remove null entries if food is not found

      firstSnack: day.firstSnack
        .map((item) => ({
          ...foodMap.get(item.id),
          size: item.size,
        }))
        .filter((food) => food.id),

      lunch: day.lunch
        .map((item) => ({
          ...foodMap.get(item.id),
          size: item.size,
        }))
        .filter((food) => food.id),

      secondSnack: day.secondSnack
        .map((item) => ({
          ...foodMap.get(item.id),
          size: item.size,
        }))
        .filter((food) => food.id),

      dinner: day.dinner
        .map((item) => ({
          ...foodMap.get(item.id),
          size: item.size,
        }))
        .filter((food) => food.id),

      secondDinner: day.secondDinner
        .map((item) => ({
          ...foodMap.get(item.id),
          size: item.size,
        }))
        .filter((food) => food.id),
    }));

    return daysHealthWithFoods;
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}
