"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, inputClassName } from "@/components/ui/form-field";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";
import { useLogin } from "@/lib/auth/use-auth";
import { MockModeBadge } from "@/components/auth/mock-mode-badge";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const loginMutation = useLogin();
  const [outcome, setOutcome] = React.useState<"mock" | "success" | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    const result = await loginMutation.mutateAsync(values);

    if (result.kind === "mock") {
      setOutcome("mock");
      setTimeout(() => router.push(redirectTo || "/"), 900);
      return;
    }
    if (result.kind === "success") {
      setOutcome("success");
      setTimeout(() => router.push(redirectTo || "/"), 900);
      return;
    }
    setErrorMessage(result.message);
  };

  if (outcome === "mock") {
    return (
      <div className="flex flex-col gap-3 rounded-panel border border-hema-700/30 bg-mist-100 p-4 text-sm text-plum-900">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hema-700" />
          <div>
            <p className="font-semibold">Preview only &mdash; login isn&apos;t wired up yet</p>
            <p className="mt-1 text-slate-700">
              No WordPress backend is configured, so this is a simulated login. Redirecting you back
              {redirectTo ? " to where you came from" : " home"}&hellip;
            </p>
          </div>
        </div>
        <MockModeBadge />
      </div>
    );
  }

  if (outcome === "success") {
    return (
      <div className="flex items-start gap-3 rounded-panel border border-hema-700/30 bg-mist-100 p-4 text-sm text-plum-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hema-700" />
        <div>
          <p className="font-semibold">Welcome back</p>
          <p className="mt-1 text-slate-700">
            Redirecting you back{redirectTo ? " to where you came from" : " home"}&hellip;
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClassName(!!errors.email)}
          placeholder="you@example.com"
          {...register("email")}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={inputClassName(!!errors.password)}
          placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
          {...register("password")}
        />
      </FormField>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-iris-300 text-royal-500" />
          Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-rose-700">
          Forgot password?
        </Link>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2 rounded-panel border border-rose-700/30 bg-cyto-100 p-3 text-sm text-rose-700">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={loginMutation.isPending} className="w-full">
        {loginMutation.isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in&hellip;
          </>
        ) : (
          "Log in"
        )}
      </Button>

      <p className="text-center text-sm text-slate-700">
        New here?{" "}
        <Link href="/register" className="font-semibold text-rose-700">
          Create an account
        </Link>
      </p>
    </form>
  );
}
