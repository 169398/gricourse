"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { performanceMetrics } from "@/db/schema";

interface QualityMetricsProps {
  metrics: (typeof performanceMetrics.$inferSelect)[];
}

export function QualityMetrics({ metrics }: QualityMetricsProps) {
  const averageQualityScore =
    metrics.reduce((sum, m) => sum + (m.qualityScore || 0), 0) / metrics.length;

  const qualityFactors = [
    { name: "Response Time", score: averageQualityScore * 0.3 },
    { name: "Conversion Rate", score: averageQualityScore * 0.4 },
    { name: "Customer Satisfaction", score: averageQualityScore * 0.3 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityFactors.map((factor) => (
              <div key={factor.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{factor.name}</span>
                  <span>{factor.score.toFixed(1)}/100</span>
                </div>
                <Progress value={factor.score} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
