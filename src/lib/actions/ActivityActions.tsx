"use server";

import { db } from "@/db";
import { activity } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  activityKind: z.enum(["movement", "weight_based"]),
  weight: z.coerce.number().nonnegative().optional(),
  duration: z.coerce.number().nonnegative().optional(),
  sets: z.coerce.number().nonnegative().optional(),
  repetitions: z.coerce.number().nonnegative().optional(),
});

export async function createActivity(formData: FormData) {
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

    const { weight, duration, sets, repetitions, activityKind } =
      validatedData.data;

    if (activityKind === "movement") {
      await db.insert(activity).values({
        activity: "movement",
        userId: user.id,
        duration: duration,
        repetitions: null,
        sets: null,
        weight: null,
      });
    } else if (activityKind === "weight_based") {
      await db.insert(activity).values({
        activity: "weight_based",
        userId: user.id,
        weight: weight,
        sets: sets,
        repetitions: repetitions,
        duration: null,
      });
    } else {
      throw new Error("Invalid data");
    }

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

export async function getActivities(count = 25, offset = 0, orderBy = "date") {
  try {
    const { user, session } = await getCurrentSession();

    if (!user || !session) {
      return { error: "Unauthorized", code: 401 };
    }

    const activities = await db
      .select()
      .from(activity)
      .orderBy(activity.createdAt)
      .where(eq(activity.userId, user.id))
      .limit(count)
      .offset(offset);
    return activities;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}
