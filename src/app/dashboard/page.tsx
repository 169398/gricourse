import { getCurrentUser } from "@/lib/actions/auth";
import { getRegistrations } from "@/lib/actions/registration";
import { ReferralStats } from "@/components/dashboard/referral-stats";
import { ReferralLinkCard } from "@/components/dashboard/referral-link-card";
import { PerformanceStats } from "@/components/dashboard/performance-stats";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "@/components/dashboard/referral-columns";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { data: referrals } = await getRegistrations({
    referredById: user.id,
  });

  const totalEarnings = referrals.reduce((sum, reg) => {
    return sum + (reg.status === "completed" ? reg.fee * 0.1 : 0);
  }, 0);

  const pendingEarnings = referrals.reduce((sum, reg) => {
    return sum + (reg.status === "confirmed" ? reg.fee * 0.1 : 0);
  }, 0);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}!</h1>

      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ReferralStats
            totalReferrals={user.totalReferrals}
            totalEarnings={totalEarnings}
            pendingEarnings={pendingEarnings}
          />
          <ReferralLinkCard referralCode={user.referralCode} />
        </div>

        <PerformanceStats referrals={referrals} />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Referrals</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <DataTable columns={columns} data={referrals} />
          </TabsContent>
          <TabsContent value="pending">
            <DataTable
              columns={columns}
              data={referrals.filter((r) => r.status === "pending")}
            />
          </TabsContent>
          <TabsContent value="confirmed">
            <DataTable
              columns={columns}
              data={referrals.filter((r) => r.status === "confirmed")}
            />
          </TabsContent>
          <TabsContent value="completed">
            <DataTable
              columns={columns}
              data={referrals.filter((r) => r.status === "completed")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
