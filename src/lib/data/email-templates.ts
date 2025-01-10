export const emailTemplates = {
  performanceReport: {
    name: "Monthly Performance Report",
    subject: "Your Monthly Performance Report - {{period}}",
    content: `
Hi {{name}},

Here's your performance summary for {{period}}:

📊 Key Metrics:
- Total Referrals: {{referralCount}}
- Completed Registrations: {{completedCount}}
- Conversion Rate: {{conversionRate}}
- Total Earnings: {{earnings}}

🌟 Quality Score: {{qualityScore}}/100

Keep up the great work!

Best regards,
The GRI Team
    `,
  },

  achievementUnlocked: {
    name: "Achievement Unlocked",
    subject: "🎉 Congratulations! New Achievement Unlocked",
    content: `
Congratulations {{name}}!

You've just unlocked a new achievement: {{achievementName}}

{{achievementDescription}}

Current Stats:
{{stats}}

Keep pushing forward!
    `,
  },

  weeklyDigest: {
    name: "Weekly Performance Digest",
    subject: "Your Weekly Performance Digest",
    content: `
Hi {{name}},

Here's your weekly performance summary:

This Week's Highlights:
- New Referrals: {{weeklyReferrals}}
- Conversion Rate: {{weeklyConversion}}
- Quality Score: {{qualityScore}}

Trending:
{{trendingMetrics}}

Goals Progress:
{{goalsProgress}}

Keep up the momentum!
    `,
  },
};

export function registerEmailTemplates() {
  // Register templates in the database
  Object.values(emailTemplates).forEach(async (template) => {
    // Insert or update template in the database
  });
}
