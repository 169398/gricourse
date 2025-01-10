"use client";

import { Employee } from "@/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopPerformers({ employees }: { employees: Employee[] }) {
  const sortedEmployees = [...employees]
    .sort((a, b) => (b.totalReferrals || 0) - (a.totalReferrals || 0))
    .slice(0, 5);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Conversion Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEmployees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
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
              </TableCell>
              <TableCell>{employee.totalReferrals}</TableCell>
              <TableCell>
                <Badge variant="outline">Active</Badge>
              </TableCell>
              <TableCell className="text-right">
                {(
                  ((employee.completedReferrals || 0) /
                    (employee.totalReferrals || 0)) *
                  100
                ).toFixed(1)}
                %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
