import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { isAdminSession } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect: redirectTo } = await searchParams;

  if (await isAdminSession()) {
    redirect(redirectTo || "/");
  }

  return (
    <AuthLayout title="Admin login" subtitle="Sign in to edit page content.">
      <AdminLoginForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}
