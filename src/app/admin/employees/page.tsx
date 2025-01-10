import { getEmployees } from "@/lib/actions/employee";
import { getRegistrations } from "@/lib/actions/registration";
import { EmployeeManagement } from "@/components/admin/employee-management";
import { EmployeeAnalytics } from "@/components/admin/employee-analytics";
import { BulkActions } from "@/components/admin/bulk-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function EmployeesPage() {
  const { data: employees } = await getEmployees();
  const { data: registrations } = await getRegistrations();

  const employeeReferrals = employees.map((employee) => ({
    employee,
    referrals: registrations.filter((reg) => reg.referredById === employee.id),
  }));

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <BulkActions
          selectedEmployees={employees}
          onActionComplete={() => {
            // Refresh data
          }}
        />
      </div>

      <div className="space-y-8">
        {employeeReferrals.map(({ employee, referrals }) => (
          <Tabs key={employee.id} defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <EmployeeManagement employee={employee} referrals={referrals} />
            </TabsContent>

            <TabsContent value="analytics">
              <EmployeeAnalytics employee={employee} referrals={referrals} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityLog employeeId={employee.id} />
            </TabsContent>
          </Tabs>
        ))}
      </div>
    </div>
  );
}
