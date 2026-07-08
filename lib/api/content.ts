import { wpGraphQLFetch } from "@/lib/api/client";
import { MOCK_COURSES } from "@/lib/mock/courses";
import { MOCK_FACULTY } from "@/lib/mock/faculty";
import { MOCK_POSTS } from "@/lib/mock/posts";
import { MOCK_STATS, MOCK_TESTIMONIALS } from "@/lib/mock/testimonials";
import { TEAM_MEMBERS } from "@/lib/mock/team";
import type { Course, FacultyMember, Post, Stat, Testimonial } from "@/lib/api/types";

/**
 * NOTE: These queries assume custom WPGraphQL types (`courses`, `testimonials`,
 * `facultyMembers`) exposed via a WPGraphQL-for-Tutor-LMS bridge / ACF-to-GraphQL
 * registration. Adjust field names once the real WP schema is confirmed — until
 * then, every fetch here fails closed and falls back to mock content.
 */
const FEATURED_COURSES_QUERY = /* GraphQL */ `
  query FeaturedCourses {
    courses(first: 6, where: { featured: true }) {
      nodes {
        id
        slug
        title
        subspecialty
        examTargets
        imageUrl
        priceCents
        currency
        rating
        reviewCount
        lessonCount
        faculty {
          id
          name
          title
          affiliation
          avatarUrl
        }
      }
    }
  }
`;

const TESTIMONIALS_QUERY = /* GraphQL */ `
  query Testimonials {
    testimonials(first: 6) {
      nodes {
        id
        quote
        name
        role
        avatarUrl
      }
    }
  }
`;

const FACULTY_QUERY = /* GraphQL */ `
  query Faculty {
    facultyMembers(first: 12) {
      nodes {
        id
        name
        title
        affiliation
        avatarUrl
      }
    }
  }
`;

export async function getFeaturedCourses(): Promise<Course[]> {
  const data = await wpGraphQLFetch<{ courses: { nodes: Course[] } }>(
    FEATURED_COURSES_QUERY,
    undefined,
    { tags: ["courses"] }
  );
  return data?.courses.nodes ?? MOCK_COURSES;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await wpGraphQLFetch<{ testimonials: { nodes: Testimonial[] } }>(
    TESTIMONIALS_QUERY,
    undefined,
    { tags: ["testimonials"] }
  );
  return data?.testimonials.nodes ?? MOCK_TESTIMONIALS;
}

export async function getFaculty(): Promise<FacultyMember[]> {
  const data = await wpGraphQLFetch<{ facultyMembers: { nodes: FacultyMember[] } }>(
    FACULTY_QUERY,
    undefined,
    { tags: ["faculty"] }
  );
  return data?.facultyMembers.nodes ?? MOCK_FACULTY;
}

/** Platform-wide stats are curated marketing copy, not (yet) backed by a WP query. */
export async function getStats(): Promise<Stat[]> {
  return MOCK_STATS;
}

const COURSE_BY_SLUG_QUERY = /* GraphQL */ `
  query CourseBySlug($slug: ID!) {
    course(id: $slug, idType: SLUG) {
      id
      slug
      category
      title
      tagline
      subspecialty
      examTargets
      imageUrl
      priceCents
      currency
      rating
      reviewCount
      lessonCount
      whoFor
      whatYouGet
      curriculum {
        title
        lessons
      }
      faqs {
        question
        answer
      }
      faculty {
        id
        name
        title
        affiliation
        avatarUrl
      }
    }
  }
`;

/** Public course page data — never gated behind auth; enrollment/purchase is the only auth boundary. */
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const data = await wpGraphQLFetch<{ course: Course | null }>(
    COURSE_BY_SLUG_QUERY,
    { slug },
    { tags: [`course:${slug}`] }
  );
  if (data?.course) return data.course;
  return MOCK_COURSES.find((course) => course.slug === slug) ?? null;
}

export async function getAllCourseSlugs(): Promise<string[]> {
  return MOCK_COURSES.map((course) => course.slug);
}

export async function getAllCourses(): Promise<Course[]> {
  return getFeaturedCourses();
}

const RECENT_POSTS_QUERY = /* GraphQL */ `
  query RecentPosts {
    posts(first: 3) {
      nodes {
        id
        slug
        title
        excerpt
        imageUrl
        publishedAt
        category
      }
    }
  }
`;

export async function getRecentPosts(): Promise<Post[]> {
  const data = await wpGraphQLFetch<{ posts: { nodes: Post[] } }>(
    RECENT_POSTS_QUERY,
    undefined,
    { tags: ["posts"] }
  );
  return data?.posts.nodes ?? MOCK_POSTS;
}

const TEAM_QUERY = /* GraphQL */ `
  query Team {
    teamMembers(first: 20) {
      nodes {
        id
        name
        title
        affiliation
        avatarUrl
      }
    }
  }
`;

/** The real About Us team roster — distinct from getFaculty(), which backs per-course assignments. */
export async function getTeamMembers(): Promise<FacultyMember[]> {
  const data = await wpGraphQLFetch<{ teamMembers: { nodes: FacultyMember[] } }>(
    TEAM_QUERY,
    undefined,
    { tags: ["team"] }
  );
  return data?.teamMembers.nodes ?? TEAM_MEMBERS;
}
