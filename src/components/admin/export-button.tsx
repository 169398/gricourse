"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Registration } from "@/db/schema";
import { Download } from "lucide-react";
import Papa from "papaparse";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ExportOptions {
  includeEmail: boolean;
  includeFinancials: boolean;
  dateRange: "all" | "thisMonth" | "lastMonth" | "thisYear";
}

export function ExportButton({ data }: { data: Registration[] }) {
  const [options, setOptions] = useState<ExportOptions>({
    includeEmail: true,
    includeFinancials: true,
    dateRange: "all",
  });

  const handleExport = () => {
    const filteredData = filterDataByDateRange(data, options.dateRange);
    const exportData = filteredData.map((reg) => ({
      Name: reg.name,
      ...(options.includeEmail && { Email: reg.email }),
      Type: reg.participantType.replace("_", " "),
      Status: reg.status,
      ...(options.includeFinancials && {
        Fee: `€${reg.fee}`,
        Commission: `€${(reg.fee * 0.1).toFixed(2)}`,
      }),
      "Registration Date": reg.createdAt
        ? new Date(reg.createdAt).toLocaleDateString()
        : "",
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `registrations_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeEmail"
              checked={options.includeEmail}
              onCheckedChange={(checked) =>
                setOptions({ ...options, includeEmail: !!checked })
              }
            />
            <Label htmlFor="includeEmail">Include Email Addresses</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeFinancials"
              checked={options.includeFinancials}
              onCheckedChange={(checked) =>
                setOptions({ ...options, includeFinancials: !!checked })
              }
            />
            <Label htmlFor="includeFinancials">Include Financial Data</Label>
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {options.dateRange === "all"
                    ? "All Time"
                    : options.dateRange === "thisMonth"
                    ? "This Month"
                    : options.dateRange === "lastMonth"
                    ? "Last Month"
                    : "This Year"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => setOptions({ ...options, dateRange: "all" })}
                >
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setOptions({ ...options, dateRange: "thisMonth" })
                  }
                >
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setOptions({ ...options, dateRange: "lastMonth" })
                  }
                >
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setOptions({ ...options, dateRange: "thisYear" })
                  }
                >
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button onClick={handleExport} className="w-full">
            Download CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function filterDataByDateRange(
  data: Registration[],
  range: ExportOptions["dateRange"]
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return data.filter((reg) => {
    const date = reg.createdAt ? new Date(reg.createdAt) : new Date();
    switch (range) {
      case "thisMonth":
        return date >= startOfMonth;
      case "lastMonth":
        return date >= startOfLastMonth && date < startOfMonth;
      case "thisYear":
        return date >= startOfYear;
      default:
        return true;
    }
  });
}
