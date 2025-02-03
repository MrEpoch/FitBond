CREATE TABLE IF NOT EXISTS "food_timed" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_id" uuid NOT NULL,
	"day_date" date NOT NULL,
	"created_at" timestamp with time zone,
	CONSTRAINT "food_timed_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_breakfast_food_id_fk";
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_first_snack_food_id_fk";
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_lunch_food_id_fk";
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_second_snack_food_id_fk";
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_dinner_food_id_fk";
--> statement-breakpoint
ALTER TABLE "daily_health_info" DROP CONSTRAINT "daily_health_info_second_dinner_food_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "food_timed" ADD CONSTRAINT "food_timed_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_breakfast_food_timed_id_fk" FOREIGN KEY ("breakfast") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_first_snack_food_timed_id_fk" FOREIGN KEY ("first_snack") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_lunch_food_timed_id_fk" FOREIGN KEY ("lunch") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_second_snack_food_timed_id_fk" FOREIGN KEY ("second_snack") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_dinner_food_timed_id_fk" FOREIGN KEY ("dinner") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "daily_health_info" ADD CONSTRAINT "daily_health_info_second_dinner_food_timed_id_fk" FOREIGN KEY ("second_dinner") REFERENCES "public"."food_timed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
