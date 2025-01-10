import { getRegistrations } from "@/lib/actions/registration";
import { getEmployees } from "@/lib/actions/employee";
import { AdminStats } from "@/components/admin/admin-stats";
import { RegistrationChart } from "@/components/admin/registration-chart";
import { TopPerformers } from "@/components/admin/top-performers";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminDashboardPage() {
  const { data: registrations } = await getRegistrations();
  const { data: employees } = await getEmployees();

  const stats = {
    totalRegistrations: registrations.length,
    totalRevenue: registrations.reduce((sum, reg) => sum + reg.fee, 0),
    totalCommissions: registrations.reduce(
      (sum, reg) => sum + (reg.status === "completed" ? reg.fee * 0.1 : 0),
      0
    ),
    activeEmployees: employees.filter((emp) => emp.totalReferrals > 0).length,
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="space-y-8">
        <AdminStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <RegistrationChart data={registrations} />
          </Card>
          <Card className="p-6">
            <TopPerformers employees={employees} />
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Employees</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          {/* Add tab contents */}
        </Tabs>
      </div>
    </div>
  );
}
