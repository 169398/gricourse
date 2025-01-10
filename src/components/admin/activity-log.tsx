"use client";

import { useEffect, useState } from "react";
import { getEmployeeActivities } from "@/lib/actions/activity";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const actionColors = {
  registration_created: "bg-green-100 text-green-800",
  registration_updated: "bg-blue-100 text-blue-800",
  profile_updated: "bg-yellow-100 text-yellow-800",
  payment_processed: "bg-purple-100 text-purple-800",
  status_changed: "bg-orange-100 text-orange-800",
  admin_action: "bg-red-100 text-red-800",
};

export function ActivityLog({ employeeId }: { employeeId: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      const result = await getEmployeeActivities(employeeId);
      if (result.success) {
        setActivities(result.data);
      }
    };
    fetchActivities();
  }, [employeeId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={activity.id}>
            <TableCell>{format(new Date(activity.timestamp), "PPp")}</TableCell>
            <TableCell>
              <Badge
                className={
                  actionColors[activity.action as keyof typeof actionColors]
                }
              >
                {activity.action.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>{activity.details}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
