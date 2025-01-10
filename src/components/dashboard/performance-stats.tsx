"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Registration } from "@/db/schema";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface StatsProps {
  referrals: Registration[];
}

export function PerformanceStats({ referrals }: StatsProps) {
  const monthlyStats = referrals.reduce((acc, reg) => {
    const month = new Date(reg.createdAt || "").toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) {
      acc[month] = { month, total: 0, completed: 0 };
    }
    acc[month].total += 1;
    if (reg.status === "completed") {
      acc[month].completed += 1;
    }
    return acc;
  }, {} as Record<string, { month: string; total: number; completed: number }>);

  const chartData = Object.values(monthlyStats);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" name="Total Referrals" fill="#2563eb" />
              <Bar dataKey="completed" name="Completed" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
