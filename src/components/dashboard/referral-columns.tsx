"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Registration } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<Registration>[] = [
  {
    accessorKey: "name",
    header: "Participant Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "participantType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("participantType") as string;
      return <Badge variant="outline">{type.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants: Record<string, string> = {
        pending: "default",
        confirmed: "secondary",
        completed: "success",
      };
      return <Badge variant={variants[status] as "default" | "secondary" | "destructive" | "outline" | "success" | null | undefined}>{status}</Badge>;
    },
  },
  {
    accessorKey: "fee",
    header: "Commission",
    cell: ({ row }) => {
      const fee = row.getValue("fee") as number;
      const status = row.getValue("status") as string;
      const commission = fee * 0.1;
      return (
        <div className="font-medium">
          €{commission.toFixed(2)}
          {status !== "completed" && (
            <span className="text-muted-foreground ml-1">(pending)</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("createdAt")), "PPP");
    },
  },
];
