"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormField, inputClassName } from "@/components/ui/form-field";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

export function RegisterForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { agreeToTerms: false },
  });

  const onSubmit = async () => {
    setStatus("submitting");
    // No live WordPress backend is connected yet — this simulates the WPGraphQL
    // JWT Authentication round trip so the form/UX can be built and reviewed
    // ahead of the real Auth phase. Nothing is persisted.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setTimeout(() => router.push(redirectTo || "/"), 900);
  };

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-panel border border-hema-700/30 bg-mist-100 p-4 text-sm text-plum-900">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-hema-700" />
        <div>
          <p className="font-semibold">Preview only &mdash; account creation isn&apos;t wired up yet</p>
          <p className="mt-1 text-slate-700">
            Real registration lands with the Auth phase (WPGraphQL JWT). Redirecting you back
            {redirectTo ? " to the course you were viewing" : " home"}&hellip;
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClassName(!!errors.name)}
          placeholder="Dr. Jane Doe"
          {...register("name")}
        />
      </FormField>

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
          autoComplete="new-password"
          className={inputClassName(!!errors.password)}
          placeholder="At least 8 characters"
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirm password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClassName(!!errors.confirmPassword)}
          placeholder="Re-enter your password"
          {...register("confirmPassword")}
        />
      </FormField>

      <div>
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-iris-300 text-royal-500"
            {...register("agreeToTerms")}
          />
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-rose-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-medium text-rose-700">
            Privacy Policy
          </Link>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-xs text-rose-700">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full">
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account&hellip;
          </>
        ) : (
          "Create free account"
        )}
      </Button>

      <p className="flex items-start gap-2 text-xs text-smoke-400">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This is a UI preview. No account is created yet.
      </p>

      <p className="text-center text-sm text-slate-700">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-rose-700">
          Log in
        </Link>
      </p>
    </form>
  );
}
