"use server";

import { db } from "@/db";
import { food, userHealthInfo } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  foodName: z
    .string()
    .min(1, { message: "Food name is required" })
    .max(50, { message: "Food name is too long" }),
  foodSize: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Food size is required" }),
  calories100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Calories is required" }),
  protein100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Protein is required" }),
  fibers100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Fibers is required" }),
  carbohydrates100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Carbohydrates is required" }),
  salt100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Salt is required" }),
  sugar100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Sugar is required" }),
  fats100G: z.coerce
    .number()
    .nonnegative()
    .min(0, { message: "Fats is required" }),
});

export async function createFood(formData: FormData) {
  try {
    const { session, user } = await getCurrentSession();

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
      foodName,
      foodSize,
      calories100G,
      protein100G,
      fibers100G,
      carbohydrates100G,
      salt100G,
      sugar100G,
      fats100G,
    } = validatedData.data;

    await db.insert(food).values({
      userHealthId: userHealth[0].id,
      foodName: foodName,
      foodSize: foodSize,
      calories100G: calories100G,
      protein100G: protein100G,
      fibers100G: fibers100G,
      carbohydrates100G: carbohydrates100G,
      salt100G: salt100G,
      sugar100G: sugar100G,
      fats100G: fats100G,
    });

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function updateFood(formData: FormData, id: string) {
  try {
    const { session, user } = await getCurrentSession();

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
    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const {
      foodName,
      foodSize,
      calories100G,
      protein100G,
      fibers100G,
      carbohydrates100G,
      salt100G,
      sugar100G,
      fats100G,
    } = validatedData.data;

    await db
      .update(food)
      .set({
        foodName: foodName,
        foodSize: foodSize,
        calories100G: calories100G,
        protein100G: protein100G,
        fibers100G: fibers100G,
        carbohydrates100G: carbohydrates100G,
        salt100G: salt100G,
        sugar100G: sugar100G,
        fats100G: fats100G,
      })
      .where(and(eq(food.id, id_val.data), eq(food.userHealthId, userHealth[0].id)));

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function deleteFood(id: string) {
  try {
    const { session, user } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
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


    await db.delete(food).where(and(eq(food.id, id), eq(food.userHealthId, userHealth[0].id)));
    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getFood(id: string) {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
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


    const one_food = await db
      .select()
      .from(food)
      .where(and(eq(food.id, id_val.data), eq(food.userHealthId, userHealth[0].id)));

    return one_food;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getFoods(count = 25, offset = 0, orderBy = "date") {
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


    const foods = await db
      .select()
      .from(food)
      .orderBy(food.createdAt)
      .where(eq(food.userHealthId, userHealth[0].id))
      .limit(count)
      .offset(offset);
    return foods;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}
