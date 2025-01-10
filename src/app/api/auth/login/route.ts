import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Check if the email exists in the employees table
    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);

    if (employee.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid email" },
        { status: 401 }
      );
    }

    // Set a session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", employee[0].id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      success: true,
      user: {
        id: employee[0].id,
        name: employee[0].name,
        email: employee[0].email,
        role: employee[0].role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
