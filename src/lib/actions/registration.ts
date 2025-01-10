"use server";

import db from "@/db/drizzle";
import { registrations, employees, NewRegistration } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/email-templates";

export async function updateRegistrationStatus(
  id: number,
  status: "pending" | "confirmed" | "completed"
) {
  try {
    const [registration] = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .returning();

    if (registration.referredById) {
      const [employee] = await db
        .select()
        .from(employees)
        .where(eq(employees.id, registration.referredById));

      // Send email to participant
      await sendEmail({
        to: registration.email,
        ...emailTemplates.statusUpdate(registration.name, status),
      });

      // Send email to referrer if status is completed
      if (status === "completed" && employee) {
        const commission = registration.fee * 0.1;
        await sendEmail({
          to: employee.email,
          ...emailTemplates.paymentConfirmation(employee.name, commission),
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true, data: registration };
  } catch (error) {
    console.error("Failed to update registration:", error);
    return { success: false, error: "Failed to update registration status" };
  }
}

export async function createRegistration(data: NewRegistration) {
  try {
    const registration = await db
      .insert(registrations)
      .values(data)
      .returning();
    revalidatePath("/admin/registrations");
    return { success: true, data: registration[0] };
  } catch (error) {
    console.error("Failed to create registration:", error);
    return { success: false, error: "Failed to create registration" };
  }
}

export async function getRegistrations(options?: {
  status?: string;
  participantType?: string;
  referredById?: number;
}) {
  try {
    const baseQuery = db.select().from(registrations);

    const filters = [];

    if (options?.status) {
      filters.push(
        eq(
          registrations.status,
          options.status as "pending" | "confirmed" | "completed"
        )
      );
    }

    if (options?.participantType) {
      filters.push(
        eq(
          registrations.participantType,
          options.participantType as "new_learner" | "student" | "returning_gri"
        )
      );
    }

    if (options?.referredById) {
      filters.push(eq(registrations.referredById, options.referredById));
    }

    const results = await (filters.length > 0
      ? baseQuery.where(and(...filters))
      : baseQuery
    ).orderBy(desc(registrations.createdAt));

    return { success: true, data: results };
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return { success: false, error: "Failed to fetch registrations" };
  }
}
