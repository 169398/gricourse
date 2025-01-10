import db from "@/db/drizzle";
import { achievements, employeeAchievements, employees } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function checkAchievements(employeeId: number) {
  const employee = await db.query.employees.findFirst({
    where: eq(employees.id, employeeId),
    with: {
      referrals: true,
    },
  });

  if (!employee) return [];

  const allAchievements = await db.select().from(achievements);
  const unlockedAchievements = await db
    .select()
    .from(employeeAchievements)
    .where(eq(employeeAchievements.employeeId, employeeId));

  const newAchievements = [];

  for (const achievement of allAchievements) {
    const alreadyUnlocked = unlockedAchievements.some(
      (ua) => ua.achievementId === achievement.id
    );

    if (!alreadyUnlocked) {
      const qualified = await qualifiesForAchievement(employee, achievement);
      if (qualified) {
        await db.insert(employeeAchievements).values({
          employeeId,
          achievementId: achievement.id,
        });
        newAchievements.push(achievement);
      }
    }
  }

  return newAchievements;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function qualifiesForAchievement(employee: any, achievement: any) {
  switch (achievement.type) {
    case "referral_count":
      return employee.totalReferrals >= achievement.threshold;
    case "conversion_rate":
      const rate =
        (employee.completedReferrals / employee.totalReferrals) * 100;
      return rate >= achievement.threshold;
    case "streak":
      // Implement streak logic
      return false;
    default:
      return false;
  }
}

export async function getEmployeeAchievements(employeeId: number) {
  return db
    .select({
      id: employeeAchievements.id,
      unlockedAt: employeeAchievements.unlockedAt,
      achievement: {
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
      },
    })
    .from(employeeAchievements)
    .innerJoin(
      achievements,
      eq(achievements.id, employeeAchievements.achievementId)
    )
    .where(eq(employeeAchievements.employeeId, employeeId));
}
