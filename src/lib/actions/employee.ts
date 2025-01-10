"use server";

import db from "@/db/drizzle";
import { Employee, employees, type NewEmployee } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateReferralCode } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { logActivity } from "./activity";
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function createEmployee(data: Omit<NewEmployee, "referralCode">) {
  try {
    const referralCode = await generateReferralCode();
    const employee = await db
      .insert(employees)
      .values({ ...data, referralCode })
      .returning();
    revalidatePath("/admin/employees");
    return { success: true, data: employee[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create employee" };
  }
}

export async function updateEmployee(
  id: number,
  data: Partial<Omit<NewEmployee, "referralCode">>
) {
  try {
    const employee = await db
      .update(employees)
      .set(data)
      .where(eq(employees.id, id))
      .returning();
    revalidatePath("/admin/employees");
    return { success: true, data: employee[0] };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update employee" };
  }
}

export async function deleteEmployee(id: number) {
  try {
    await db.delete(employees).where(eq(employees.id, id));
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete employee" };
  }
}

export async function getEmployees() {
  try {
    const results = await db.select().from(employees);
    return { success: true, data: results };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to fetch employees" };
  }
}

export async function downloadToExcel(employees: Employee[]) {
  const data = employees.map((employee) => ({
    ID: employee.id,
    Name: employee.name,
    Email: employee.email,
    Role: employee.role,
    "Total Referrals": employee.totalReferrals,
    "Completed Referrals": employee.completedReferrals,
    "Commission Rate": `${employee.commissionRate}%`,
    "Performance Score": employee.performanceScore,
    Status: employee.status,
    "Created At": employee.createdAt
      ? format(new Date(employee.createdAt), "PPP")
      : "N/A",
    "Last Active": employee.lastActiveAt
      ? format(new Date(employee.lastActiveAt), "PPP")
      : "N/A",
  }));

  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Employees");

  // Generate filename with current date
  const fileName = `employees_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
  writeFile(workbook, fileName);
}

export async function sendBulkEmails(
  emails: string[],
  subject: string,
  content: string
) {
  try {
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      batches.push(batch);
    }

    const results = await Promise.allSettled(
      batches.map(async (batch) => {
        const emailPromises = batch.map((email) =>
          transporter.sendMail({
            from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
            to: email,
            subject,
            html: content,
          })
        );

        // Wait a short delay between batches to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return Promise.all(emailPromises);
      })
    );

    // Log the bulk email activity
    await logActivity({
      employeeId: 0, 
      action: "admin_action",
      details: `Sent bulk email to ${emails.length} recipients`,
      metadata: {
        subject,
        recipientCount: emails.length,
        successCount: results.filter((r) => r.status === "fulfilled").length,
        failureCount: results.filter((r) => r.status === "rejected").length,
      },
      timestamp: new Date(),
    });

    // Calculate success and failure counts
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      data: {
        totalEmails: emails.length,
        successCount,
        failureCount,
      },
    };
  } catch (error) {
    console.error("Failed to send bulk emails:", error);
    return {
      success: false,
      error: "Failed to send bulk emails",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateEmployeeStatus(id: number, status: string) {
  try {
    const [employee] = await db
      .update(employees)
      .set({
        status,
        lastActiveAt: status === "active" ? new Date() : undefined,
      })
      .where(eq(employees.id, id))
      .returning();

    await logActivity({
      employeeId: id,
      action: "status_changed",
      details: `Status updated to ${status}`,
      metadata: { newStatus: status },
      timestamp: new Date(),
    });

    return { success: true, data: employee };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update employee status" };
  }
}
