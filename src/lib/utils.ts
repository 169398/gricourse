import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { employees } from "../../db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export async function generateReferralCode(): Promise<string> {
  let code: string;
  let exists: boolean;

  do {
    code = nanoid();
    const result = await db
      .select()
      .from(employees)
      .where(eq(employees.referralCode, code));
    exists = result.length > 0;
  } while (exists);

  return code;
}
