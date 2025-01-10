"use client";

import { Employee, Registration } from "@/db/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateEmployee } from "@/lib/actions/employee";
import { EmployeeUpdateInput } from "@/lib/validators";
import { ActivityLog } from "./activity-log";
import { EmployeeEditForm } from "./employee-edit-form";

interface EmployeeDetailsProps {
  employee: Employee;
  referrals: Registration[];
}

export function EmployeeManagement({
  employee,
  referrals,
}: EmployeeDetailsProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const stats = {
    totalReferrals: referrals.length,
    completedReferrals: referrals.filter((r) => r.status === "completed")
      .length,
    pendingReferrals: referrals.filter((r) => r.status === "pending").length,
    totalEarnings: referrals.reduce(
      (sum, r) => sum + (r.status === "completed" ? r.fee * 0.1 : 0),
      0
    ),
  };

  const handleUpdate = async (data: EmployeeUpdateInput) => {
    const result = await updateEmployee(employee.id, data);
    if (result.success) {
      toast({
        title: "Employee updated",
        description: "Employee details have been successfully updated.",
      });
      setIsEditing(false);
    } else {
      toast({
        title: "Update failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{employee.name}</CardTitle>
              <CardDescription>{employee.email}</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Role</Label>
              <div className="font-medium">{employee.role}</div>
            </div>
            <div>
              <Label>Commission Rate</Label>
              <div className="font-medium">{employee.commissionRate}%</div>
            </div>
            <div>
              <Label>Total Referrals</Label>
              <div className="font-medium">{stats.totalReferrals}</div>
            </div>
            <div>
              <Label>Total Earnings</Label>
              <div className="font-medium">€{stats.totalEarnings}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityLog employeeId={employee.id} />
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
          </DialogHeader>
          <EmployeeEditForm employee={employee} onSubmit={handleUpdate} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
