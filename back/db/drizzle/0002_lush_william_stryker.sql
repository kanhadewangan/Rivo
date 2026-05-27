CREATE TYPE "public"."payment_method" AS ENUM('cash', 'upi', 'card');--> statement-breakpoint
CREATE TYPE "public"."ride_status" AS ENUM('requested', 'accepted', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "complaints" ALTER COLUMN "complaint_text" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_method" SET DATA TYPE "public"."payment_method" USING "payment_method"::"public"."payment_method";--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "comment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ALTER COLUMN "bike_number" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "rider_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "otp" SET DATA TYPE varchar(6);--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "fare" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "started_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "started_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "ended_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "rides" ALTER COLUMN "ended_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "support_tickets" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "support_tickets" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "support_tickets" ALTER COLUMN "status" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "support_tickets" ALTER COLUMN "status" SET DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "complaints" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "transaction_ref" varchar(255);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "rider_id" integer;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "phone" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "total_earnings" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "is_available" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "current_lat" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "current_long" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "riders" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "pickup_lat" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "pickup_long" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "drop_lat" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "drop_long" numeric(10, 7) NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "status" "ride_status" DEFAULT 'requested' NOT NULL;--> statement-breakpoint
ALTER TABLE "rides" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD COLUMN "rider_id" integer;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(15) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaints" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "isPaid";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "riders" DROP COLUMN "totalEarnings";--> statement-breakpoint
ALTER TABLE "riders" DROP COLUMN "isAvailable";--> statement-breakpoint
ALTER TABLE "riders" DROP COLUMN "currentLat";--> statement-breakpoint
ALTER TABLE "riders" DROP COLUMN "currentLong";--> statement-breakpoint
ALTER TABLE "riders" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "rides" DROP COLUMN "isCompleted";--> statement-breakpoint
ALTER TABLE "rides" DROP COLUMN "isCancelled";--> statement-breakpoint
ALTER TABLE "rides" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "support_tickets" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "number";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "update_at";--> statement-breakpoint
ALTER TABLE "riders" ADD CONSTRAINT "riders_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "riders" ADD CONSTRAINT "riders_phone_unique" UNIQUE("phone");--> statement-breakpoint
ALTER TABLE "riders" ADD CONSTRAINT "riders_bike_number_unique" UNIQUE("bike_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");