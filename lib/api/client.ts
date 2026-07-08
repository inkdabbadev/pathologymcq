const WP_URL = process.env.NEXT_PUBLIC_WP_URL;

export interface WPFetchOptions {
  revalidate?: number;
  tags?: string[];
}

/**
 * POSTs a query to WPGraphQL (`${WP_URL}/graphql`). Returns null (never throws) when
 * NEXT_PUBLIC_WP_URL is unset or the request/parse fails, so callers can fall back to
 * mock data and pages keep rendering while the WP backend isn't wired up yet.
 */
export async function wpGraphQLFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: WPFetchOptions
): Promise<T | null> {
  if (!WP_URL) return null;

  try {
    const res = await fetch(`${WP_URL}/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: options?.revalidate ?? 3600, tags: options?.tags },
    });

    if (!res.ok) {
      throw new Error(`WPGraphQL request failed with status ${res.status}`);
    }

    const json = (await res.json()) as { data?: T; errors?: { message: string }[] };

    if (json.errors?.length) {
      throw new Error(json.errors[0].message);
    }

    return json.data ?? null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[wp-graphql] falling back to mock data: ${(error as Error).message}`
      );
    }
    return null;
  }
}
