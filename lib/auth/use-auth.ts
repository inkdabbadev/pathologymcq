"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface AuthUser {
  email: string;
  name?: string;
}

const AUTH_ME_KEY = ["auth", "me"] as const;

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) return null;
  const json = (await res.json()) as { user: AuthUser };
  return json.user;
}

export function useAuthSession() {
  return useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
  });
}

export interface LoginInput {
  email: string;
  password: string;
}

export type LoginResult =
  | { kind: "mock" }
  | { kind: "success"; user: AuthUser }
  | { kind: "error"; message: string };

async function login(input: LoginInput): Promise<LoginResult> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json().catch(() => ({}))) as {
    mock?: boolean;
    user?: AuthUser;
    message?: string;
  };

  if (res.status === 503 && json.mock) {
    return { kind: "mock" };
  }
  if (res.ok && json.user) {
    return { kind: "success", user: json.user };
  }
  return { kind: "error", message: json.message ?? "Login failed" };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      if (result.kind === "success") {
        queryClient.setQueryData(AUTH_ME_KEY, result.user);
      }
    },
  });
}

async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_ME_KEY, null);
    },
  });
}
