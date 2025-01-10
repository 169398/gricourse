/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { performanceMetrics } from "@/db/schema";
import { registrations } from "@/db/schema";
import { TrendAnalysisChart } from "./visualization/charts";

interface TrendsAnalysisProps {
  metrics: (typeof performanceMetrics.$inferSelect)[];
  registrations: (typeof registrations.$inferSelect)[];
}

export function TrendsAnalysis({
  metrics,
  registrations,
}: TrendsAnalysisProps) {
  const trendData = metrics.map((metric) => ({
    period: metric.period,
    referrals: metric.referralCount,
    conversion: metric.conversionRate,
    quality: metric.qualityScore,
  }));

  return (
    <div className="space-y-6">
      <TrendAnalysisChart data={trendData} />
    </div>
  );
}
