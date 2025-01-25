CREATE TYPE "public"."activity_enum" AS ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active');--> statement-breakpoint
CREATE TYPE "public"."activity_kind" AS ENUM('weight_based', 'movement');--> statement-breakpoint
CREATE TYPE "public"."fitness_goal" AS ENUM('lose_weight', 'gain_muscle', 'maintain_weight');--> statement-breakpoint
CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_health_id" uuid NOT NULL,
	"activity" "activity_kind",
	"weight_used" double precision,
	"activity_duration" double precision,
	"repetitions" integer,
	"sets" integer,
	"created_at" timestamp with time zone,
	CONSTRAINT "activity_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_health_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_health_id" uuid NOT NULL,
	"created_at" timestamp with time zone,
	"day_date" date NOT NULL,
	"breakfast" text[],
	"first_snack" text[],
	"lunch" text[],
	"second_snack" text[],
	"dinner" text[],
	"second_dinner" text[],
	"activity" text[],
	CONSTRAINT "daily_health_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_verification_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"email" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "email_verification_request_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "food" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_name" text NOT NULL,
	"food_size" double precision NOT NULL,
	"user_health_id" uuid NOT NULL,
	"calories_100g" integer NOT NULL,
	"protein_100g" integer NOT NULL,
	"fibers_100g" integer NOT NULL,
	"carbohydrates_100g" integer NOT NULL,
	"salt_100g" integer NOT NULL,
	"sugar_100g" integer NOT NULL,
	"fats_100g" integer NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "food_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_password_reset" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_fa_enabled" boolean DEFAULT false NOT NULL,
	"expires_at" integer NOT NULL,
	CONSTRAINT "session_password_reset_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"two_fa_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "session_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_health_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"weight" double precision DEFAULT 0,
	"age" integer DEFAULT 0,
	"gender" "gender_enum" DEFAULT 'male',
	"weight_pounds" boolean DEFAULT false,
	"height_inches" boolean DEFAULT false,
	"height" double precision DEFAULT 0,
	"calories" integer DEFAULT 0,
	"activityLevel" "activity_enum",
	"fitnessGoal" "fitness_goal" DEFAULT 'maintain_weight',
	CONSTRAINT "user_health_info_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"recovery_code" "bytea" NOT NULL,
	"totp_key" "bytea",
	"username" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activity" ADD CONSTRAINT "activity_user_health_id_user_health_info_id_fk" FOREIGN KEY ("user_health_id") REFERENCES "public"."user_health_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_user_health_id_user_health_info_id_fk" FOREIGN KEY ("user_health_id") REFERENCES "public"."user_health_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_breakfast_food_id_fk" FOREIGN KEY ("breakfast") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_first_snack_food_id_fk" FOREIGN KEY ("first_snack") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_lunch_food_id_fk" FOREIGN KEY ("lunch") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_second_snack_food_id_fk" FOREIGN KEY ("second_snack") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_dinner_food_id_fk" FOREIGN KEY ("dinner") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_second_dinner_food_id_fk" FOREIGN KEY ("second_dinner") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_activity_activity_id_fk" FOREIGN KEY ("activity") REFERENCES "public"."activity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_verification_request" ADD CONSTRAINT "email_verification_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food" ADD CONSTRAINT "food_user_health_id_user_health_info_id_fk" FOREIGN KEY ("user_health_id") REFERENCES "public"."user_health_info"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_password_reset" ADD CONSTRAINT "session_password_reset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_health_info" ADD CONSTRAINT "user_health_info_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email" ON "user" USING btree (lower("email"));
