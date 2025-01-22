"use server";

import { db } from "@/db";
import { userHealthInfo } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  weight: z.number().optional(),
  height: z.number().optional(),
  age: z.number().optional(),
  gender: z.enum(["male", "female"]).optional(),
  activityLevel: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  calories: z.number().optional(),
});

export async function createUserHealth(formData: FormData) {
  try {
    const parsedFormData = Object.fromEntries(formData.entries());

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const { weight, height, age, gender, activityLevel, calories } =
      validatedData.data;
    const { user } = await getCurrentSession();
    if (!user) {
      return { error: "Invalid data", code: 400 };
    }

    await db.insert(userHealthInfo).values({
      userId: user.id,
      weight: weight,
      height: height,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      calories: calories,
    });

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function updateUserHealth(formData: FormData, id: string) {
  try {
    const parsedFormData = Object.fromEntries(formData.entries());
    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const { weight, height, age, gender, activityLevel, calories } =
      validatedData.data;

    await db
      .update(userHealthInfo)
      .set({
        weight: weight,
        height: height,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        calories: calories,
      })
      .where(eq(userHealthInfo.id, id_val.data));

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function deleteUserHealth(id: string) {
  try {
    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    await db.delete(userHealthInfo).where(eq(userHealthInfo.id, id));
    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getUserHealth(id: string) {
  try {
    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const user_health = await db
      .select()
      .from(userHealthInfo)
      .where(eq(userHealthInfo.id, id_val.data));

    return user_health[0] ?? null;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}
