import { getProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { NotificationSettings } from "@/components/dashboard/notification-settings";
import { PaymentSettings } from "@/components/dashboard/payment-settings";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default async function ProfilePage() {
  const { data: profile, error } = await getProfile();
  if (!profile) redirect("/login");

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <ProfileForm profile={profile} />
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <NotificationSettings
              preferences={profile.notificationPreferences}
            />
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="p-6">
            <PaymentSettings
              bankAccount={profile.bankAccount}
              preferredPaymentMethod={profile.preferredPaymentMethod}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
