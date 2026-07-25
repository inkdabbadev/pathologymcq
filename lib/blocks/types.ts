export type BlockType = "heading" | "subheading" | "body" | "image" | "link" | "split";

export type SplitSideType = "empty" | "heading" | "subheading" | "body" | "image" | "link";

export type TextAlign = "left" | "center" | "right";

export interface SplitSide {
  type: SplitSideType;
  text: string;
  url: string;
  /** text-align, applies to heading/subheading/body side types. */
  align?: TextAlign;
}

export interface Block {
  id: string;
  type: BlockType;
  text: string;
  url: string;
  /** text-align, applies to heading/subheading/body block types. */
  align?: TextAlign;
  /** split only: left/right halves, each independently typed. */
  left?: SplitSide;
  right?: SplitSide;
}

export const BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: "heading", label: "Heading", icon: "H1" },
  { type: "subheading", label: "Subheading", icon: "H2" },
  { type: "body", label: "Body text", icon: "¶" },
  { type: "image", label: "Image", icon: "🖼" },
  { type: "split", label: "Split (two halves)", icon: "⬛" },
  { type: "link", label: "Hyperlink", icon: "🔗" },
];

export const SPLIT_SIDE_TYPES: { type: SplitSideType; label: string }[] = [
  { type: "empty", label: "Empty" },
  { type: "heading", label: "Heading" },
  { type: "subheading", label: "Subheading" },
  { type: "body", label: "Body text" },
  { type: "image", label: "Image" },
  { type: "link", label: "Hyperlink" },
];

export const emptySplitSide = (): SplitSide => ({ type: "empty", text: "", url: "", align: "left" });

export const newBlock = (type: BlockType): Block => ({
  id: crypto.randomUUID(),
  type,
  text: "",
  url: "",
  align: "left",
  ...(type === "split" ? { left: emptySplitSide(), right: emptySplitSide() } : {}),
});
