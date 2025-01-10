"use client";

import { Employee, Registration, performanceMetrics } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeePerformanceTable } from "./employee-performance-table";
import { TrendsAnalysis } from "./trends-analysis";
import { QualityMetrics } from "./quality-metrics";
import { RevenueChart } from "./visualization/revenue-chart";
import { Leaderboard } from "./leaderboard";

interface PerformanceDashboardProps {
  employees: Employee[];
  metrics: (typeof performanceMetrics.$inferSelect)[];
  registrations: Registration[];
}

export function PerformanceDashboard({
  employees,
  metrics,
  registrations,
}: PerformanceDashboardProps) {
  const teamMetrics = {
    totalReferrals: employees.reduce(
      (sum, emp) => sum + (emp.totalReferrals || 0),
      0
    ),
    avgConversionRate:
      employees.reduce(
        (sum, emp) =>
          sum +
          ((emp.completedReferrals || 0) / (emp.totalReferrals || 0)) * 100,
        0
      ) / employees.length,
    topPerformers: employees
      .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
      .slice(0, 5),
    revenueByMonth: metrics.reduce((acc, metric) => {
      const month = metric.period;
      acc[month] = (acc[month] || 0) + (Number(metric.totalEarnings) || 0);
      return acc;
    }, {} as Record<string, number>),
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Referrals"
              value={teamMetrics.totalReferrals}
              trend={+10}
            />
            <MetricCard
              title="Avg Conversion Rate"
              value={`${teamMetrics.avgConversionRate.toFixed(1)}%`}
              trend={+2.5}
            />
            <MetricCard
              title="Active Employees"
              value={employees.filter((e) => e.status === "active").length}
            />
            <MetricCard
              title="Quality Score"
              value={calculateTeamQualityScore(metrics)}
              trend={-1.2}
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <RevenueChart data={teamMetrics.revenueByMonth} />
            <Leaderboard metrics={metrics} employees={employees} period="month" />
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <TrendsAnalysis metrics={metrics} registrations={registrations} />
        </TabsContent>

        <TabsContent value="performance">
          <EmployeePerformanceTable employees={employees} metrics={metrics} />
        </TabsContent>

        <TabsContent value="quality">
          <QualityMetrics metrics={metrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper components
function MetricCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string | number;
  trend?: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p
            className={`text-xs ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function calculateTeamQualityScore(metrics: (typeof performanceMetrics.$inferSelect)[]): string {
  const avgScore =
    metrics.reduce((sum, m) => sum + (m.qualityScore || 0), 0) / metrics.length;
  return avgScore.toFixed(1);
}

// Add other helper components...
