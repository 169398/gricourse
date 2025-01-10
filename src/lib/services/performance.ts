import { db } from "@/db/drizzle";
import { performanceMetrics, registrations, employees } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { startOfMonth, endOfMonth, format } from "date-fns";

export async function calculateEmployeePerformance(
  employeeId: number,
  date = new Date()
) {
  const startDate = startOfMonth(date);
  const endDate = endOfMonth(date);
  const period = format(date, "yyyy-MM");

  const monthRegistrations = await db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.referredById, employeeId),
        gte(registrations.createdAt, startDate),
        lte(registrations.createdAt, endDate)
      )
    );

  const completedRegistrations = monthRegistrations.filter(
    (r) => r.status === "completed"
  );

  const metrics = {
    employeeId,
    period,
    referralCount: monthRegistrations.length,
    completedCount: completedRegistrations.length,
    conversionRate:
      monthRegistrations.length > 0
        ? (completedRegistrations.length / monthRegistrations.length) * 100
        : 0,
    totalEarnings: completedRegistrations.reduce(
      (sum, r) => sum + r.fee * 0.1,
      0
    ),
    qualityScore: calculateQualityScore(monthRegistrations),
  };

  await db
    .insert(performanceMetrics)
    .values(metrics)
    .onConflictDoUpdate({
      target: [performanceMetrics.employeeId, performanceMetrics.period],
      set: metrics,
    });

  return metrics;
}

function calculateQualityScore(registrations: any[]) {
  // Implement your quality scoring logic here
  // Example: Based on completion rate, response time, etc.
  return Math.floor(Math.random() * 100); // Placeholder
}

export async function generatePerformanceReport(period: string) {
  const metrics = await db
    .select({
      employee: {
        id: employees.id,
        name: employees.name,
        email: employees.email,
      },
      metrics: {
        referralCount: performanceMetrics.referralCount,
        completedCount: performanceMetrics.completedCount,
        conversionRate: performanceMetrics.conversionRate,
        totalEarnings: performanceMetrics.totalEarnings,
        qualityScore: performanceMetrics.qualityScore,
      },
    })
    .from(performanceMetrics)
    .innerJoin(employees, eq(employees.id, performanceMetrics.employeeId))
    .where(eq(performanceMetrics.period, period));

  return metrics;
}
