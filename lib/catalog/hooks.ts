"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Course, Product } from "@/lib/api/types";
import type { MockTestProduct } from "@/lib/mock/mock-test-products";
import type { MockTestType } from "@/lib/mock/mock-test-types";
import * as store from "@/lib/catalog/store";

const CATALOG_STALE_TIME = 60_000;

// Courses
export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => store.listCourses(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    queryFn: async () => store.getCourseBySlug(slug),
    enabled: Boolean(slug),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; category: string }) => store.createCourse(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Course> }) =>
      store.updateCourse(id, patch),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["course", c.slug] });
    },
  });
}
export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deleteCourse(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

// Bundles
export function useBundles() {
  return useQuery({
    queryKey: ["bundles"],
    queryFn: async () => store.listBundles(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => store.createBundle(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}
export function useUpdateBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Product> }) =>
      store.updateBundle(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}
export function useDeleteBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deleteBundle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}

// Hard copy books
export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => store.listBooks(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => store.createBook(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}
export function useUpdateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Product> }) =>
      store.updateBook(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}
export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deleteBook(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

// Mock tests
export function useMockTests() {
  return useQuery({
    queryKey: ["mockTests"],
    queryFn: async () => store.listMockTests(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateMockTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; category: string }) => store.createMockTest(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mockTests"] }),
  });
}
export function useUpdateMockTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<MockTestProduct> }) =>
      store.updateMockTest(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mockTests"] }),
  });
}
export function useDeleteMockTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deleteMockTest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mockTests"] }),
  });
}

// Mock test categories
export function useMockCategories() {
  return useQuery({
    queryKey: ["mockCategories"],
    queryFn: async () => store.listMockCategories(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateMockCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { label: string; description?: string }) =>
      store.createMockCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mockCategories"] }),
  });
}
export function useUpdateMockCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slugId,
      patch,
    }: {
      slugId: string;
      patch: Partial<Pick<MockTestType, "label" | "description">>;
    }) => store.updateMockCategory(slugId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mockCategories"] }),
  });
}
export function useDeleteMockCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slugId: string) => store.deleteMockCategory(slugId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mockCategories"] });
      qc.invalidateQueries({ queryKey: ["mockTests"] });
    },
  });
}

// ── Practice topics ──────────────────────────────────────────────────────────
import type { PracticeTopic, FacultyMember } from "@/lib/api/types";
import type { FaqCategory } from "@/lib/mock/faq-categories";
import type { StoredPracticeQuestion } from "@/lib/catalog/store";

export function usePracticeTopics() {
  return useQuery({
    queryKey: ["practice_topics"],
    queryFn: async () => store.listPracticeTopics(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreatePracticeTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { label: string; iconUrl?: string }) => store.createPracticeTopic(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_topics"] }),
  });
}
export function useUpdatePracticeTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, patch }: { slug: string; patch: Partial<PracticeTopic> }) =>
      store.updatePracticeTopic(slug, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_topics"] }),
  });
}
export function useDeletePracticeTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => store.deletePracticeTopic(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["practice_topics"] });
      qc.invalidateQueries({ queryKey: ["practice_questions"] });
    },
  });
}

// ── Practice questions ───────────────────────────────────────────────────────
export function usePracticeQuestions(topicSlug: string) {
  return useQuery({
    queryKey: ["practice_questions", topicSlug],
    queryFn: async () => store.listPracticeQuestions(topicSlug),
    enabled: Boolean(topicSlug),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreatePracticeQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (topicSlug: string) => store.createPracticeQuestion(topicSlug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_questions"] }),
  });
}
export function useUpdatePracticeQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<StoredPracticeQuestion> }) =>
      store.updatePracticeQuestion(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_questions"] }),
  });
}
export function useDeletePracticeQuestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deletePracticeQuestion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["practice_questions"] }),
  });
}

// ── Faculty ──────────────────────────────────────────────────────────────────
export function useFaculty() {
  return useQuery({
    queryKey: ["faculty"],
    queryFn: async () => store.listFaculty(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string }) => store.createFaculty(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculty"] }),
  });
}
export function useUpdateFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<FacultyMember> }) =>
      store.updateFaculty(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculty"] }),
  });
}
export function useDeleteFaculty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => store.deleteFaculty(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faculty"] }),
  });
}

// ── FAQ categories ───────────────────────────────────────────────────────────
export function useFaqCategories() {
  return useQuery({
    queryKey: ["faq_categories"],
    queryFn: async () => store.listFaqCategories(),
    staleTime: CATALOG_STALE_TIME,
  });
}
export function useCreateFaqCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string }) => store.createFaqCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq_categories"] }),
  });
}
export function useUpdateFaqCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ slug, patch }: { slug: string; patch: Partial<Pick<FaqCategory, "title" | "items">> }) =>
      store.updateFaqCategory(slug, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq_categories"] }),
  });
}
export function useDeleteFaqCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => store.deleteFaqCategory(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faq_categories"] }),
  });
}

// ── Site settings ────────────────────────────────────────────────────────────
import type { SiteSettings } from "@/lib/site/defaults";
import { DEFAULT_SETTINGS } from "@/lib/site/defaults";

export function useSiteSettings(): SiteSettings {
  const q = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => store.getSiteSettings(),
    staleTime: CATALOG_STALE_TIME,
  });
  return q.data ?? DEFAULT_SETTINGS;
}
export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<SiteSettings>) => store.updateSiteSettings(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}
