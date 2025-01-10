"use client";

import { Registration } from "@/db/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { subMonths, format } from "date-fns";

export function RegistrationChart({ data }: { data: Registration[] }) {
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, "MMM yyyy");
  }).reverse();

  const chartData = last6Months.map((month) => {
    const registrations = data.filter(
      (reg) => format(new Date(reg.createdAt || ""), "MMM yyyy") === month
    );

    return {
      month,
      total: registrations.length,
      completed: registrations.filter((reg) => reg.status === "completed")
        .length,
      revenue: registrations.reduce((sum, reg) => sum + reg.fee, 0),
    };
  });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Registration Trends</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              name="Total Registrations"
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
              dataKey="revenue"
              stroke="#f59e0b"
              name="Revenue (€)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
