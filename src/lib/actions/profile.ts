"use server";

import db from "@/db/drizzle";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ProfileUpdateInput } from "@/lib/validators";
import { getCurrentUser } from "./auth";

export async function updateProfile(data: ProfileUpdateInput) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const updated = await db
      .update(employees)
      .set(data)
      .where(eq(employees.id, user.id))
      .returning();

    revalidatePath("/dashboard/profile");
    return { success: true, data: updated[0] };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const profile = await db
      .select()
      .from(employees)
      .where(eq(employees.id, user.id))
      .limit(1);

    return { success: true, data: profile[0] };
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}
