"use client";

import { useEffect, useState } from "react";
import { getRealTimeMetrics } from "@/lib/services/real-time-tracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function RealTimeTracker({ employeeId }: { employeeId: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = async () => {
      const data = await getRealTimeMetrics(employeeId);
      setMetrics(data);
      setLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [employeeId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Referrals Today</div>
              <div className="text-2xl font-bold">{metrics.todayReferrals}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Earnings Today</div>
              <div className="text-2xl font-bold">€{metrics.todayEarnings}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Current Streak</div>
              <div className="text-2xl font-bold">
                {metrics.currentStreak} days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
