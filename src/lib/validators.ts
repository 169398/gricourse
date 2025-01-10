import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  bankAccount: z.string().optional(),
  preferredPaymentMethod: z.enum(["bank_transfer", "paypal"]).optional(),
  notificationPreferences: z.object({
    emailNotifications: z.boolean(),
    referralUpdates: z.boolean(),
    paymentAlerts: z.boolean(),
  }),
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const activityLogSchema = z.object({
  employeeId: z.number(),
  action: z.enum([
    "registration_created",
    "registration_updated",
    "profile_updated",
    "payment_processed",
    "status_changed",
    "admin_action",
  ]),
  details: z.string(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.date().default(() => new Date()),
});

export const employeeUpdateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(["admin", "employee"]),
  isActive: z.boolean(),
  commissionRate: z.number().min(0).max(100).optional(),
  maxReferrals: z.number().min(0).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type ActivityLogInput = z.infer<typeof activityLogSchema>;
export type EmployeeUpdateInput = z.infer<typeof employeeUpdateSchema>;
