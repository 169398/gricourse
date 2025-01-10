"use client";

import { Employee } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeUpdateInput } from "@/lib/validators";

interface EmployeeEditFormProps {
  employee: Employee;
  onSubmit: (data: EmployeeUpdateInput) => void;
}

export function EmployeeEditForm({
  employee,
  onSubmit,
}: EmployeeEditFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as "admin" | "employee",
      commissionRate: Number(formData.get("commissionRate")),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={employee.name} />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={employee.email}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select name="role" defaultValue={employee.role}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="commissionRate">Commission Rate (%)</Label>
        <Input
          id="commissionRate"
          name="commissionRate"
          type="number"
          defaultValue={employee.commissionRate}
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
