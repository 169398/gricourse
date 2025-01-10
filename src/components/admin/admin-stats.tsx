"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Euro, Users, UserCheck, TrendingUp } from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalRegistrations: number;
    totalRevenue: number;
    totalCommissions: number;
    activeEmployees: number;
  };
}

export function AdminStats({ stats }: AdminStatsProps) {
  const items = [
    {
      title: "Total Registrations",
      value: stats.totalRegistrations,
      description: "All-time registrations",
      icon: Users,
      trend: "+12% from last month",
    },
    {
      title: "Total Revenue",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      description: "Gross revenue",
      icon: Euro,
      trend: "+8% from last month",
    },
    {
      title: "Total Commissions",
      value: `€${stats.totalCommissions.toLocaleString()}`,
      description: "Paid commissions",
      icon: TrendingUp,
      trend: "+15% from last month",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      description: "With referrals",
      icon: UserCheck,
      trend: "+3 from last month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <p className="text-xs text-green-500 mt-1">{item.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
