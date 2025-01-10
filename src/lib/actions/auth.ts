"use server";

import db from "@/db/drizzle";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(email: string) {
  try {
    const employee = await db.query.employees.findFirst({
      where: eq(employees.email, email),
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Set session cookie
    (await
          // Set session cookie
          cookies()).set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data: employee };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Login failed" };
  }
}

export async function logout() {
  (await cookies()).delete("user_email");
  redirect("/login");
}

export async function getCurrentUser() {
  const email = (await cookies()).get("user_email")?.value;
  if (!email) return null;

  const employee = await db.query.employees.findFirst({
    where: eq(employees.email, email),
  });

  return employee;
}
