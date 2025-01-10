"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, NewRegistration } from "@/db/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRegistration } from "@/lib/actions/registration";
import { useToast } from "@/hooks/use-toast";

export function RegistrationForm({ referralCode }: { referralCode?: string }) {
  const { toast } = useToast();
  const form = useForm<NewRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      referralSource: referralCode ? "referral" : undefined,
      fee: 400,
    },
  });

  async function onSubmit(data: NewRegistration) {
    const result = await createRegistration(data);
    if (result.success) {
      toast({
        title: "Registration successful",
        description: "We'll contact you soon with further details.",
      });
      form.reset();
    } else {
      toast({
        title: "Registration failed",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participantType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participant Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select participant type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new_learner">New Learner</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="returning_gri">Returning GRI</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Registration</Button>
      </form>
    </Form>
  );
}
