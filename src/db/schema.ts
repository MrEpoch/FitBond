import { InferSelectModel, sql, SQL } from "drizzle-orm";
import {
  pgTable,
  uuid,
  timestamp,
  text,
  boolean,
  uniqueIndex,
  AnyPgColumn,
  customType,
  integer,
  pgEnum,
  doublePrecision,
  date,
  jsonb,
  json,
} from "drizzle-orm/pg-core";

export const bytea = customType<{ data: Uint8Array }>({
  dataType() {
    return "bytea";
  },
  toDriver(value: Uint8Array): Uint8Array {
    // Convert Uint8Array to a base64 string for storage in PostgreSQL
    return value;
  },
  fromDriver(value: Uint8Array): Uint8Array {
    // Convert the base64 string back to a Uint8Array when reading from the database
    return new Uint8Array(value);
  },
});

export const userTable = pgTable(
  "user",
  {
    id: uuid("id").defaultRandom().primaryKey().unique(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    recoveryCode: bytea("recovery_code", {
      notNull: false,
      default: false,
    }).notNull(),
    totpKey: bytea("totp_key", {
      notNull: false,
      default: false,
    }),
    username: text("username").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
  },
  (table) => ({
    emailUniqueIndex: uniqueIndex("email").on(lower(table.email)),
  }),
);

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  twoFaVerified: boolean("two_fa_verified").notNull().default(false),
});

export const emailVerificationRequestTable = pgTable(
  "email_verification_request",
  {
    id: text("id").primaryKey().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id),
    code: text("code").notNull(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
);

export const passwordResetSessionTable = pgTable("session_password_reset", {
  id: text("id").primaryKey().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  email: text("email").notNull(),
  code: text("code").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  twoFaEnabled: boolean("two_fa_enabled").notNull().default(false),
  expiresAt: integer("expires_at").notNull(),
});

export const activityEnum = pgEnum("activity_enum", [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
  "extremely_active",
]);

export const genderEnum = pgEnum("gender_enum", ["male", "female"]);

export const fitness_goal = pgEnum("fitness_goal", [
  "lose_weight",
  "gain_muscle",
  "maintain_weight",
]);

export const userHealthInfo = pgTable("user_health_info", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  weight: doublePrecision("weight").default(0),
  age: integer("age").default(0),
  gender: genderEnum().default("male"),
  weightPounds: boolean("weight_pounds").default(false),
  heightInches: boolean("height_inches").default(false),
  height: doublePrecision("height").default(0),
  calories: integer("calories").default(0),
  activityLevel: activityEnum(),
  fitnessGoal: fitness_goal().default("maintain_weight"),
});

export const activityKind = pgEnum("activity_kind", [
  "weight_based",
  "movement",
]);

export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  userHealthId: uuid("user_health_id")
    .notNull()
    .references(() => userHealthInfo.id),
  activity: activityKind(),
  weight: doublePrecision("weight_used"),
  duration: doublePrecision("activity_duration"),
  repetitions: integer("repetitions"),
  sets: integer("sets"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const foodTimes = pgEnum("food_times", [
  "breakfast",
  "lunch",
  "dinner",
  "firstSnack",
  "secondSnack",
  "secondDinner",
]);

export const foodTimedTable = pgTable("food_timed", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  foodId: uuid("food_id")
    .notNull()
    .references(() => food.id),
  dayDate: date("day_date").notNull(),
  foodTime: foodTimes().notNull(),
  foodSize: doublePrecision("food_size").default(1),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const dailyHealthInfo = pgTable("daily_health_info", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  userHealthId: uuid("user_health_id")
    .notNull()
    .references(() => userHealthInfo.id),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),

  dayDate: date("day_date").notNull(),
  breakfast: text("breakfast")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),
  firstSnack: text("first_snack")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),
  lunch: text("lunch")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),
  secondSnack: text("second_snack")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),
  dinner: text("dinner")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),
  secondDinner: text("second_dinner")
    .array()
    .references(() => foodTimedTable.id)
    .default([]),

  activity: text("activity")
    .array()
    .default([])
    .references(() => activity.id),
});

export const food = pgTable("food", {
  id: uuid("id").defaultRandom().primaryKey().unique(),
  foodName: text("food_name").notNull(),
  userHealthId: uuid("user_health_id").references(() => userHealthInfo.id),

  calories100G: text("calories_100g").notNull(),
  protein100G: text("protein_100g").notNull(),
  fibers100G: text("fibers_100g").notNull(),
  carbohydrates100G: text("carbohydrates_100g").notNull(),
  salt100G: text("salt_100g").notNull(),
  sugar100G: text("sugar_100g").notNull(),
  fats100G: text("fats_100g").notNull(),
  fatsSat100G: text("fats_sat_100g").notNull(),
  fatsMono100G: text("fats_mono_100g").notNull(),
  fatsPoly100G: text("fats_poly_100g").notNull(),
  fatsTran100G: text("fats_trans_100g").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
