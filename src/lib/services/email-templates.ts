import db from "@/db/drizzle";
import { emailTemplates } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getEmailTemplate(id: number) {
  const [template] = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.id, id));
  return template;
}

export function compileTemplate(
  template: string,
  variables: Record<string, string>
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || "");
}

export async function sendPerformanceReport(
  employee: { email: string; name: string },
  metrics: Record<string, string>
) {
  const template = await getEmailTemplate(1); // Assuming ID 1 is performance report
  const compiledContent = compileTemplate(template.content, {
    name: employee.name,
    period: metrics.period,
    referralCount: metrics.referralCount,
    completedCount: metrics.completedCount,
    conversionRate: `${metrics.conversionRate}%`,
    earnings: `€${metrics.totalEarnings}`,
    qualityScore: metrics.qualityScore,
  });

  // Implement your email sending logic here
  // Example: using your preferred email service
  console.log(`Sending email to ${employee.email}`, compiledContent);
}
