"use server";

import { db } from "@/db";
import { userHealthInfo } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  weight: z.coerce.number().nonnegative(),
  weightPounds: z.coerce.boolean(),
  height: z.coerce.number().nonnegative(),
  heightInches: z.coerce.boolean(),
  age: z.coerce.number().nonnegative().max(120),
  gender: z.enum(["male", "female"]),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  calories: z.coerce.number().nonnegative(),
  fitnessGoal: z.enum(["lose_weight", "gain_muscle", "maintain_weight"]),
});

export async function createUserHealth(formData: FormData) {
  try {
    const { user, session } = await getCurrentSession();
    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const parsedFormData = Object.fromEntries(formData.entries());

    const validatedData = createFormSchema.safeParse(parsedFormData);
    if (!validatedData.success) {
      return { error: "Invalid data", code: 400 };
    }

    const {
      fitnessGoal,
      weight,
      height,
      age,
      gender,
      activityLevel,
      calories,
      weightPounds,
      heightInches,
    } = validatedData.data;

    await db.insert(userHealthInfo).values({
      fitnessGoal: fitnessGoal,
      userId: user.id,
      weight: weight,
      height: height,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      calories: calories,
      weightPounds: weightPounds,
      heightInches: heightInches,
    });

    revalidatePath("/main/dashboard");
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}

export async function updateUserHealth(formData: FormData, id: string) {
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

    const {
      weight,
      height,
      age,
      gender,
      activityLevel,
      calories,
      weightPounds,
      heightInches,
    } = validatedData.data;

    await db
      .update(userHealthInfo)
      .set({
        weightPounds: weightPounds,
        heightInches: heightInches,
        weight: weight,
        height: height,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        calories: calories,
      })
      .where(
        and(
          eq(userHealthInfo.id, id_val.data),
          eq(userHealthInfo.userId, user.id),
        ),
      );

    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function deleteUserHealth(id: string) {
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
      .delete(userHealthInfo)
      .where(
        and(eq(userHealthInfo.id, id), eq(userHealthInfo.userId, user.id)),
      );
    revalidatePath("/main/dashboard");
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getUserHealth(id: string) {
  try {
    const { user, session } = await getCurrentSession();
    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const id_val = z.string().max(36).safeParse(id);

    if (!id_val.success) {
      return { error: "Invalid data", code: 400 };
    }

    const user_health = await db
      .select()
      .from(userHealthInfo)
      .where(eq(userHealthInfo.userId, user.id));

    return user_health[0] ?? null;
  } catch (e) {
    console.log(e);
    return { error: "Server error", code: 500 };
  }
}
