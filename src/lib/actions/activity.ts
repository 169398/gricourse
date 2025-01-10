"use server";

import db from "@/db/drizzle";
import { activityLogs, employees,  } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ActivityLogInput } from "@/lib/validators";

export async function logActivity(data: ActivityLogInput) {
  try {
    const [log] = await db.insert(activityLogs).values(data).returning();
    return { success: true, data: log };
  } catch (error) {
    console.error("Failed to log activity:", error);
    return { success: false, error: "Failed to log activity" };
  }
}

export async function getEmployeeActivities(employeeId: number) {
  try {
    const activities = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        metadata: activityLogs.metadata,
        timestamp: activityLogs.timestamp,
        employee: {
          id: employees.id,
          name: employees.name,
          email: employees.email,
        },
      })
      .from(activityLogs)
      .innerJoin(employees, eq(activityLogs.employeeId, employees.id))
      .where(eq(activityLogs.employeeId, employeeId))
      .orderBy(desc(activityLogs.timestamp))
      .limit(50);

    return { success: true, data: activities };
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return { success: false, error: "Failed to fetch activities" };
  }
}

export async function getSystemActivities() {
  try {
    const activities = await db
      .select({
        id: activityLogs.id,
        action: activityLogs.action,
        details: activityLogs.details,
        metadata: activityLogs.metadata,
        timestamp: activityLogs.timestamp,
        employee: {
          id: employees.id,
          name: employees.name,
          email: employees.email,
        },
      })
      .from(activityLogs)
      .innerJoin(employees, eq(activityLogs.employeeId, employees.id))
      .orderBy(desc(activityLogs.timestamp))
      .limit(100);

    return { success: true, data: activities };
  } catch (error) {
    console.error("Failed to fetch system activities:", error);
    return { success: false, error: "Failed to fetch system activities" };
  }
}
