"use client";

import { useState } from "react";
import { Employee } from "@/db/schema";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { updateEmployee } from "@/lib/actions/employee";
import {
  downloadToExcel,
  sendBulkEmails,
  updateEmployeeStatus,
} from "@/lib/actions/employee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BulkActionsProps {
  selectedEmployees: Employee[];
  onActionComplete: () => void;
}

export function BulkActions({
  selectedEmployees,
  onActionComplete,
}: BulkActionsProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [commissionRate, setCommissionRate] = useState("");
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleBulkCommissionUpdate = async () => {
    setIsUpdating(true);
    try {
      await Promise.all(
        selectedEmployees.map((employee) =>
          updateEmployee(employee.id, {
            commissionRate: parseFloat(commissionRate),
          })
        )
      );
      toast({
        title: "Success",
        description: `Updated commission rate for ${selectedEmployees.length} employees`,
      });
      setShowCommissionDialog(false);
      onActionComplete();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update commission rates",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await Promise.all(
        selectedEmployees.map((employee) =>
          updateEmployeeStatus(employee.id, selectedStatus)
        )
      );
      toast({
        title: "Success",
        description: `Updated status for ${selectedEmployees.length} employees`,
      });
      setShowStatusDialog(false);
      onActionComplete();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkEmail = async () => {
    try {
      await sendBulkEmails(
        selectedEmployees.map((e) => e.email),
        emailSubject,
        emailContent
      );
      toast({
        title: "Success",
        description: `Sent emails to ${selectedEmployees.length} employees`,
      });
      setShowEmailDialog(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to send emails",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      await downloadToExcel(selectedEmployees);
      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedEmployees.length} selected
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Bulk Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
            Update Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            Export Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={showCommissionDialog}
        onOpenChange={setShowCommissionDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Commission Rate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                New Commission Rate (%)
              </label>
              <Input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCommissionDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkCommissionUpdate}
                disabled={isUpdating}
              >
                Update {selectedEmployees.length} Employees
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Employee Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleBulkStatusUpdate}
              disabled={isUpdating || !selectedStatus}
            >
              Update {selectedEmployees.length} Employees
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={5}
              />
            </div>
            <Button onClick={handleBulkEmail}>
              Send to {selectedEmployees.length} Employees
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
