import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a free Pathology MCQ account to start practicing questions and track your progress.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start practicing free — no card required."
    >
      <RegisterForm redirectTo={redirect} />
    </AuthLayout>
  );
}
