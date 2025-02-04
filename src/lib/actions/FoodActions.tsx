"use server";

import { db } from "@/db";
import { food, userHealthInfo } from "@/db/schema";
import { and, eq, ilike, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentSession } from "../sessionTokens";

const createFormSchema = z.object({
  foodName: z
    .string()
    .min(1, { message: "Food name is required" })
    .max(50, { message: "Food name is too long" }),
  foodSize: z.coerce.string().regex(/^\d+\.?\d*$/),
  calories100G: z.string().regex(/^\d+\.?\d*$/),
  protein100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  fibers100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  carbohydrates100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  salt100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  sugar100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  fats100G: z.coerce.string().regex(/^\d+\.?\d*$/),
  fats100GSaturated: z.coerce.string().regex(/^\d+\.?\d*$/),
  fats100GTrans: z.coerce.string().regex(/^\d+\.?\d*$/),
  fats100GPoly: z.coerce.string().regex(/^\d+\.?\d*$/),
  fats100GMono: z.coerce.string().regex(/^\d+\.?\d*$/),
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
      fats100GSaturated,
      fats100GTrans,
      fats100GPoly,
      fats100GMono,
    } = validatedData.data;

    await db.insert(food).values({
      userHealthId: userHealth[0].id,
      foodName: foodName,
      calories100G: calories100G,
      protein100G: protein100G,
      fibers100G: fibers100G,
      carbohydrates100G: carbohydrates100G,
      salt100G: salt100G,
      sugar100G: sugar100G,
      fats100G: fats100G,
      fatsSat100G: fats100GSaturated,
      fatsMono100G: fats100GTrans,
      fatsPoly100G: fats100GPoly,
      fatsTran100G: fats100GMono,
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
      calories100G,
      protein100G,
      fibers100G,
      carbohydrates100G,
      salt100G,
      sugar100G,
      fats100G,
      fats100GSaturated,
      fats100GTrans,
      fats100GPoly,
      fats100GMono,
    } = validatedData.data;

    await db
      .update(food)
      .set({
        foodName: foodName,
        calories100G: calories100G,
        protein100G: protein100G,
        fibers100G: fibers100G,
        carbohydrates100G: carbohydrates100G,
        salt100G: salt100G,
        sugar100G: sugar100G,
        fats100G: fats100G,
        fatsSat100G: fats100GSaturated,
        fatsMono100G: fats100GTrans,
        fatsPoly100G: fats100GPoly,
        fatsTran100G: fats100GMono,
      })
      .where(
        and(eq(food.id, id_val.data), eq(food.userHealthId, userHealth[0].id)),
      );

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

    await db
      .delete(food)
      .where(and(eq(food.id, id), eq(food.userHealthId, userHealth[0].id)));
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
      .where(
        and(eq(food.id, id_val.data), eq(food.userHealthId, userHealth[0].id)),
      );

    return one_food;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}

export async function getFoodsGlobal(count = 25, offset = 0, orderBy = "date") {
  try {
    const foods = await db
      .select({
        id: food.id,
        foodName: food.foodName,
        protein100G: food.protein100G,
        calories100G: food.calories100G,
        fibers100G: food.fibers100G,
        carbohydrates100G: food.carbohydrates100G,
        salt100G: food.salt100G,
        sugar100G: food.sugar100G,
        fats100G: food.fats100G,
        fatsSat100G: food.fatsSat100G,
        fatsMono100G: food.fatsMono100G,
        fatsPoly100G: food.fatsPoly100G,
        fatsTran100G: food.fatsTran100G,
      })
      .from(food)
      .orderBy(food.createdAt)
      .limit(count)
      .offset(offset);
    return foods;
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

export async function foodSearch(query: string, limit = 25, offset = 0) {
  try {
    const queryValidation = z.string().min(3).max(255).safeParse(query);

    if (!queryValidation.success) {
      return { error: "Invalid data", code: 400 };
    }

    const foods = await db.query.food.findMany({
      where: (foodName) =>
        ilike(foodName.foodName, `%${queryValidation.data}%`),
      columns: {
        id: true,
        foodName: true,
        protein100G: true,
        calories100G: true,
        fibers100G: true,
        carbohydrates100G: true,
        salt100G: true,
        sugar100G: true,
        fats100G: true,
        fatsSat100G: true,
        fatsMono100G: true,
        fatsPoly100G: true,
        fatsTran100G: true,
      },
      limit: limit,
      offset: offset,
    });
    return foods;
  } catch (e) {
    return { error: "Server error", code: 500 };
  }
}
