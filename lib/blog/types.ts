/**
 * Blog domain types shared by the editor, renderer and data layer.
 *
 * A post's body is an ordered list of "blocks" (Colab-cell style). Each block
 * carries its own alignment + width so it renders identically for admins (edit)
 * and normal users (published view).
 */

export type BlockType = "heading" | "paragraph" | "image" | "quote" | "divider";
export type BlockAlign = "left" | "center" | "right";

export interface Block {
  id: string;
  type: BlockType;
  /** Rich-ish text (plain string; line breaks preserved). Used by text blocks. */
  text?: string;
  /** Image blocks. */
  src?: string;
  alt?: string;
  /** Heading level for `heading` blocks. */
  level?: 1 | 2 | 3;
  /** Horizontal alignment of the block within the column. */
  align: BlockAlign;
  /** Block width as a percentage of the content column (25–100). */
  width: number;
}

export type PostStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  category_id: string | null;
  status: PostStatus;
  content: Block[];
  created_at?: string;
  updated_at?: string;
  /** Joined on read for display. */
  category?: Category | null;
}

/** A fresh block with sensible defaults. */
export function newBlock(type: BlockType): Block {
  const base: Block = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    type,
    align: "left",
    width: 100,
  };
  if (type === "heading") return { ...base, text: "New heading", level: 2 };
  if (type === "paragraph") return { ...base, text: "Start writing…" };
  if (type === "quote") return { ...base, text: "A memorable quote." };
  if (type === "image") return { ...base, src: "", alt: "" };
  return base; // divider
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "post";
}
