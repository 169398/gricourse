import db from "@/db/drizzle";
import { performanceMetrics } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { startOfWeek, endOfWeek } from "date-fns";

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "individual" | "team";
  metric: string;
  target: number;
  reward: string;
  startDate: Date;
  endDate: Date;
}

const CHALLENGES: Challenge[] = [
  {
    id: "weekly_referrals",
    title: "Weekly Referral Sprint",
    description: "Get the most referrals this week",
    type: "individual",
    metric: "referralCount",
    target: 10,
    reward: "Extra Commission",
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  },
  {
    id: "conversion_master",
    title: "Conversion Master",
    description: "Achieve highest conversion rate",
    type: "individual",
    metric: "conversionRate",
    target: 75,
    reward: "Performance Bonus",
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  },
  {
    id: "team_goal",
    title: "Team Revenue Goal",
    description: "Reach team revenue target",
    type: "team",
    metric: "totalRevenue",
    target: 10000,
    reward: "Team Celebration",
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
  },
];

export async function getActiveChallenges() {
  const now = new Date();
  return CHALLENGES.filter(
    (challenge) => challenge.startDate <= now && challenge.endDate >= now
  );
}

export async function getChallengeProgress(
  challengeId: string,
  employeeId?: number
) {
  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return null;

  const metrics = await db
    .select()
    .from(performanceMetrics)
    .where(
      and(
        employeeId ? eq(performanceMetrics.employeeId, employeeId) : undefined,
        gte(performanceMetrics.createdAt, challenge.startDate),
        lte(performanceMetrics.createdAt, challenge.endDate)
      )
    );

  // Calculate progress based on challenge type and metric
  const progress = metrics.reduce((sum, metric) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return sum + (metric as any)[challenge.metric];
  }, 0);

  return {
    challenge,
    progress,
    percentComplete: (progress / challenge.target) * 100,
    isComplete: progress >= challenge.target,
  };
}
