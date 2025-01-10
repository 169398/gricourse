import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistrationForm } from "@/components/registration/registration-form";

export default function RegisterPage({
  params,
}: {
  params: { referralCode?: string[] };
}) {
  const referralCode = params.referralCode?.[0];

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>GRI Certification Training Registration</CardTitle>
          <p className="text-muted-foreground">
            Register for the GRI Certified Sustainability Practitioner Program
          </p>
        </CardHeader>
        <CardContent>
          <RegistrationForm referralCode={referralCode} />
        </CardContent>
      </Card>
    </div>
  );
}
