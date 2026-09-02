"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "@/lib/blog/api";
import { useEdit } from "@/lib/edit/edit-context";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: api.listCategories,
    staleTime: 60_000,
  });
}

export function usePosts(categorySlug?: string) {
  const { admin, editMode, preview } = useEdit();
  // Admins in edit mode (and not previewing) see drafts too — via the admin API.
  const includeDrafts = Boolean(admin && editMode && !preview);
  return useQuery({
    queryKey: ["posts", { categorySlug: categorySlug ?? null, includeDrafts }],
    queryFn: () =>
      includeDrafts
        ? api.listAdminPosts(categorySlug)
        : api.listPublishedPosts(categorySlug),
  });
}

export function usePost(slug: string) {
  const { admin, editMode, preview } = useEdit();
  const asAdmin = Boolean(admin && editMode && !preview);
  return useQuery({
    queryKey: ["post", slug, { asAdmin }],
    queryFn: () =>
      asAdmin ? api.getAdminPostBySlug(slug) : api.getPublishedPostBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createCategory(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => api.getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => api.updateCategory(id, name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["category"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; categoryId?: string | null }) =>
      api.createPost(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Parameters<typeof api.updatePost>[1] }) =>
      api.updatePost(id, patch),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", post.slug] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
