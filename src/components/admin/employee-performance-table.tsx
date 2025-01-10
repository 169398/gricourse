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

interface EmployeePerformanceTableProps {
  employees: Employee[];
  metrics: any[];
}

export function EmployeePerformanceTable({
  employees,
  metrics,
}: EmployeePerformanceTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Referrals</TableHead>
            <TableHead>Conversion Rate</TableHead>
            <TableHead>Quality Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const employeeMetrics = metrics.find(
              (m) => m.employeeId === employee.id
            );
            return (
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
                <TableCell>{employee.totalReferrals || 0}</TableCell>
                <TableCell>
                  {(
                    ((employee.completedReferrals || 0) /
                      (employee.totalReferrals || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </TableCell>
                <TableCell>{employeeMetrics?.qualityScore || 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === "active" ? "success" : "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
