"use client";

import { Employee, Registration } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths } from "date-fns";

interface EmployeeAnalyticsProps {
  employee: Employee;
  referrals: Registration[];
}

export function EmployeeAnalytics({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  employee,
  referrals,
}: EmployeeAnalyticsProps) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, "MMM yyyy");
  }).reverse();

  const monthlyStats = last6Months.map((month) => {
    const monthReferrals = referrals.filter(
      (ref) =>
        ref.createdAt && format(new Date(ref.createdAt), "MMM yyyy") === month
    );

    return {
      month,
      referrals: monthReferrals.length,
      completed: monthReferrals.filter((r) => r.status === "completed").length,
      earnings: monthReferrals.reduce(
        (sum, r) => sum + (r.status === "completed" ? r.fee * 0.1 : 0),
        0
      ),
      conversionRate:
        monthReferrals.length > 0
          ? (monthReferrals.filter((r) => r.status === "completed").length /
              monthReferrals.length) *
            100
          : 0,
    };
  });

  const participantTypeStats = Object.entries(
    referrals.reduce((acc, ref) => {
      acc[ref.participantType] = (acc[ref.participantType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    type: type.replace("_", " "),
    count,
    percentage: (count / referrals.length) * 100,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="referrals"
                  stroke="#2563eb"
                  name="Total Referrals"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completed"
                  stroke="#16a34a"
                  name="Completed"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="earnings"
                  stroke="#f59e0b"
                  name="Earnings (€)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Participant Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participantTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium">
                  Average Conversion Rate
                </div>
                <div className="text-2xl font-bold">
                  {(
                    monthlyStats.reduce((sum, m) => sum + m.conversionRate, 0) /
                    monthlyStats.length
                  ).toFixed(1)}
                  %
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  Average Monthly Referrals
                </div>
                <div className="text-2xl font-bold">
                  {(
                    monthlyStats.reduce((sum, m) => sum + m.referrals, 0) /
                    monthlyStats.length
                  ).toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">
                  Average Monthly Earnings
                </div>
                <div className="text-2xl font-bold">
                  €
                  {(
                    monthlyStats.reduce((sum, m) => sum + m.earnings, 0) /
                    monthlyStats.length
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
