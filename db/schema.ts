import {
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
  pgTable,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "employee"]);
export const participantTypeEnum = pgEnum("participant_type", [
  "new_learner",
  "student",
  "returning_gri",
]);
export const referralSourceEnum = pgEnum("referral_source", [
  "linkedin",
  "newsletter",
  "referral",
  "social_media",
]);
export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "confirmed",
  "completed",
]);

// Employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  referralCode: text("referral_code").notNull().unique(),
  totalReferrals: integer("total_referrals").default(0),
  role: userRoleEnum("role").default("employee"),
  createdAt: timestamp("created_at").defaultNow(),
  completedReferrals: integer("completed_referrals").default(0),
  commissionRate: integer("commission_rate").default(10),
  lastActiveAt: timestamp("last_active_at"),
  status: text("status").default("active"),
  maxReferrals: integer("max_referrals"),
  performanceScore: integer("performance_score"),
});

// Registrations table
export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  country: text("country").notNull(),
  participantType: participantTypeEnum("participant_type").notNull(),
  organization: text("organization"),
  position: text("position"),
  referralSource: referralSourceEnum("referral_source").notNull(),
  referredById: integer("referred_by_id").references(() => employees.id),
  additionalInfo: text("additional_info"),
  status: registrationStatusEnum("status").default("pending"),
  fee: integer("fee").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity logs table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id),
  action: text("action").notNull(),
  details: text("details").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Performance metrics table
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id),
  period: text("period").notNull(), // Format: YYYY-MM
  referralCount: integer("referral_count").default(0),
  completedCount: integer("completed_count").default(0),
  conversionRate: numeric("conversion_rate").default("0"),
  totalEarnings: numeric("total_earnings").default("0"),
  avgResponseTime: numeric("avg_response_time"),
  qualityScore: integer("quality_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email templates table
export const emailTemplates = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  variables: jsonb("variables"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., "referral_count", "conversion_rate", "streak"
  threshold: integer("threshold").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Employee achievements table
export const employeeAchievements = pgTable("employee_achievements", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),
  achievementId: integer("achievement_id")
    .references(() => achievements.id)
    .notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Team performance table
export const teamPerformance = pgTable("team_performance", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(), // Format: YYYY-MM
  totalReferrals: integer("total_referrals").default(0),
  avgConversionRate: numeric("avg_conversion_rate").default("0"),
  topPerformerId: integer("top_performer_id").references(() => employees.id),
  mostImprovedId: integer("most_improved_id").references(() => employees.id),
  totalRevenue: numeric("total_revenue").default("0"),
  avgQualityScore: numeric("avg_quality_score").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const employeesRelations = relations(employees, ({ many }) => ({
  referrals: many(registrations),
}));

export const registrationsRelations = relations(registrations, ({ one }) => ({
  referredBy: one(employees, {
    fields: [registrations.referredById],
    references: [employees.id],
  }),
}));

// Zod Schemas for validation
export const insertEmployeeSchema = createInsertSchema(employees, {
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  referralCode: z.string().min(6),
});

export const insertRegistrationSchema = createInsertSchema(registrations, {
  email: z.string().email(),
  phone: z.string().min(10),
  name: z.string().min(2),
  country: z.string().min(2),
  fee: z.number().min(300).max(400),
});

export type Employee = typeof employees.$inferSelect;
export type NewEmployee = typeof employees.$inferInsert;
export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
