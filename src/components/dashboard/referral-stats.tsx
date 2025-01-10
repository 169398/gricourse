"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Employee } from "@/db/schema";

export function ReferralStats({
  employee,
  totalEarnings,
}: {
  employee: Employee;
  totalEarnings: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{employee.totalReferrals}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalEarnings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Referral Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium text-muted-foreground break-all">
            {`${process.env.NEXT_PUBLIC_APP_URL}/register/${employee.referralCode}`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
