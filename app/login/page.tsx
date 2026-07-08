import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Pathology MCQ account to access your courses and progress.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue your exam prep.">
      <LoginForm redirectTo={redirect} />
    </AuthLayout>
  );
}
