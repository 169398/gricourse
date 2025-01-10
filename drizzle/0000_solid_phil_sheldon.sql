CREATE TYPE "public"."participant_type" AS ENUM('new_learner', 'student', 'returning_gri');--> statement-breakpoint
CREATE TYPE "public"."referral_source" AS ENUM('linkedin', 'newsletter', 'referral', 'social_media');--> statement-breakpoint
CREATE TYPE "public"."registration_status" AS ENUM('pending', 'confirmed', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'employee');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"threshold" integer NOT NULL,
	"icon" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"action" text NOT NULL,
	"details" text NOT NULL,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"variables" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "employee_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"achievement_id" integer NOT NULL,
	"unlocked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"referral_code" text NOT NULL,
	"total_referrals" integer DEFAULT 0,
	"role" "user_role" DEFAULT 'employee',
	"created_at" timestamp DEFAULT now(),
	"completed_referrals" integer DEFAULT 0,
	"commission_rate" integer DEFAULT 10,
	"last_active_at" timestamp,
	"status" text DEFAULT 'active',
	"max_referrals" integer,
	"performance_score" integer,
	CONSTRAINT "employees_email_unique" UNIQUE("email"),
	CONSTRAINT "employees_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer,
	"period" text NOT NULL,
	"referral_count" integer DEFAULT 0,
	"completed_count" integer DEFAULT 0,
	"conversion_rate" numeric DEFAULT '0',
	"total_earnings" numeric DEFAULT '0',
	"avg_response_time" numeric,
	"quality_score" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"country" text NOT NULL,
	"participant_type" "participant_type" NOT NULL,
	"organization" text,
	"position" text,
	"referral_source" "referral_source" NOT NULL,
	"referred_by_id" integer,
	"additional_info" text,
	"status" "registration_status" DEFAULT 'pending',
	"fee" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "registrations_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "team_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"period" text NOT NULL,
	"total_referrals" integer DEFAULT 0,
	"avg_conversion_rate" numeric DEFAULT '0',
	"top_performer_id" integer,
	"most_improved_id" integer,
	"total_revenue" numeric DEFAULT '0',
	"avg_quality_score" numeric DEFAULT '0',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_achievements" ADD CONSTRAINT "employee_achievements_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_achievements" ADD CONSTRAINT "employee_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_referred_by_id_employees_id_fk" FOREIGN KEY ("referred_by_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_performance" ADD CONSTRAINT "team_performance_top_performer_id_employees_id_fk" FOREIGN KEY ("top_performer_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_performance" ADD CONSTRAINT "team_performance_most_improved_id_employees_id_fk" FOREIGN KEY ("most_improved_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;