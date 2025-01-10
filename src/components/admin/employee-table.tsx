"use client";

import { Employee } from "@/db/schema";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteEmployee, updateEmployee } from "@/lib/actions/employee";
import { useToast } from "@/hooks/use-toast";

export function EmployeeTable({ data }: { data: Employee[] }) {
  const { toast } = useToast();

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "referralCode",
      header: "Referral Code",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <Badge>{role}</Badge>;
      },
    },
    {
      accessorKey: "totalReferrals",
      header: "Referrals",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => {
                  const result = await updateEmployee(employee.id, {
                    role: employee.role === "admin" ? "employee" : "admin",
                  });
                  if (result.success) {
                    toast({
                      title: "Role updated",
                      description: `${employee.name}'s role has been updated.`,
                    });
                  }
                }}
              >
                Toggle Admin Role
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  const result = await deleteEmployee(employee.id);
                  if (result.success) {
                    toast({
                      title: "Employee deleted",
                      description: `${employee.name} has been removed.`,
                    });
                  }
                }}
                className="text-red-600"
              >
                Delete Employee
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
