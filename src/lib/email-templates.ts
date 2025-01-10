import { db } from "@/db/drizzle";
import { emailTemplates as emailTemplatesTable } from "@/db/schema";

export const emailTemplates = {
  statusUpdate: (name: string, status: string) => ({
    subject: `Registration Status Update - ${status.toUpperCase()}`,
    html: `
      <h1>Registration Status Update</h1>
      <p>Dear ${name},</p>
      <p>Your registration status has been updated to: <strong>${status}</strong></p>
      ${
        status === "confirmed"
          ? `<p>Please complete the payment to secure your spot. Payment details will be sent separately.</p>`
          : status === "completed"
          ? `<p>Thank you for completing your registration. We look forward to seeing you at the training!</p>`
          : ""
      }
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `,
  }),

  referralSuccess: (employeeName: string, participantName: string) => ({
    subject: "New Successful Referral",
    html: `
      <h1>New Referral Registration</h1>
      <p>Dear ${employeeName},</p>
      <p>Good news! ${participantName} has successfully registered using your referral code.</p>
      <p>You can track the status of this referral in your dashboard.</p>
    `,
  }),

  paymentConfirmation: (name: string, amount: number) => ({
    subject: "Commission Payment Confirmation",
    html: `
      <h1>Commission Payment Processed</h1>
      <p>Dear ${name},</p>
      <p>We're pleased to inform you that a commission payment of €${amount.toFixed(
        2
      )} has been processed.</p>
      <p>The payment should reflect in your account within 2-3 business days.</p>
    `,
  }),

  performanceReport: (
    employee: { name: string },
    metrics: Record<string, string | number>
  ) => ({
    subject: `Monthly Performance Report - ${metrics.period}`,
    html: `
      <h1>Monthly Performance Report</h1>
      <p>Dear ${employee.name},</p>
      <p>Here's your performance summary for ${metrics.period}:</p>
      
      <h2>📊 Key Metrics:</h2>
      <ul>
        <li>Total Referrals: ${metrics.referralCount}</li>
        <li>Completed Registrations: ${metrics.completedCount}</li>
        <li>Conversion Rate: ${metrics.conversionRate}%</li>
        <li>Total Earnings: €${metrics.totalEarnings}</li>
        <li>Quality Score: ${metrics.qualityScore}/100</li>
      </ul>
      
      <p>Keep up the great work!</p>
    `,
  }),
};

export async function registerEmailTemplates() {
  try {
    const templates = [
      {
        name: "Status Update",
        subject: "Registration Status Update - {{status}}",
        content: emailTemplates.statusUpdate("{{name}}", "{{status}}").html,
      },
      {
        name: "Referral Success",
        subject: "New Successful Referral",
        content: emailTemplates.referralSuccess(
          "{{name}}",
          "{{participantName}}"
        ).html,
      },
      {
        name: "Payment Confirmation",
        subject: "Commission Payment Confirmation",
        content: emailTemplates.paymentConfirmation("{{name}}", 0).html,
      },
      {
        name: "Performance Report",
        subject: "Monthly Performance Report - {{period}}",
        content: emailTemplates.performanceReport(
          { name: "{{name}}" },
          {
            period: "{{period}}",
            referralCount: "{{referralCount}}",
            completedCount: "{{completedCount}}",
            conversionRate: "{{conversionRate}}",
            totalEarnings: "{{totalEarnings}}",
            qualityScore: "{{qualityScore}}",
          }
        ).html,
      },
    ];

    // Upsert templates into the database
    for (const template of templates) {
      await db
        .insert(emailTemplatesTable)
        .values(template)
        .onConflictDoUpdate({
          target: emailTemplatesTable.name,
          set: {
            subject: template.subject,
            content: template.content,
          },
        });
    }

    console.log("Email templates registered successfully");
  } catch (error) {
    console.error("Failed to register email templates:", error);
  }
}
