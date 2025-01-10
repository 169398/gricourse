"use client";

import { Employee, performanceMetrics } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medal } from "lucide-react";

interface LeaderboardProps {
  employees: Employee[];
  metrics: (typeof performanceMetrics.$inferSelect)[];
  period: string;
}

export function Leaderboard({ employees, metrics, period }: LeaderboardProps) {
  const categories = [
    { id: "referrals", name: "Top Referrers" },
    { id: "conversion", name: "Best Conversion" },
    { id: "quality", name: "Quality Score" },
    { id: "streak", name: "Longest Streak" },
  ];

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard - {period}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="referrals">
          <TabsList className="grid grid-cols-4 mb-4">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id}>
              <div className="space-y-4">
                {employees
                  .sort((a, b) => {
                    switch (cat.id) {
                      case "referrals":
                        return (
                          (b.totalReferrals || 0) - (a.totalReferrals || 0)
                        );
                      case "conversion":
                        return (
                          (b.completedReferrals || 0) /
                            (b.totalReferrals || 0) -
                          (a.completedReferrals || 0) / (a.totalReferrals || 0)
                        );
                      case "quality":
                        return (
                          (metrics.find((m) => m.employeeId === b.id)
                            ?.qualityScore || 0) -
                          (metrics.find((m) => m.employeeId === a.id)
                            ?.qualityScore || 0)
                        );
                      default:
                        return 0;
                    }
                  })
                  .slice(0, 10)
                  .map((employee, index) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold w-8">
                          {index < 3 ? (
                            <Medal className={getMedalColor(index)} />
                          ) : (
                            `#${index + 1}`
                          )}
                        </div>
                        <Avatar>
                          <AvatarFallback>
                            {employee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {cat.id === "referrals" && employee.totalReferrals}
                          {cat.id === "conversion" &&
                            `${(
                              (employee.completedReferrals || 0) /
                              (employee.totalReferrals || 0)
                            ).toFixed(1)}%`}
                          {cat.id === "quality" &&
                            metrics.find((m) => m.employeeId === employee.id)
                              ?.qualityScore}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
