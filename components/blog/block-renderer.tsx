import type { Block } from "@/lib/blog/types";

const alignClass: Record<Block["align"], string> = {
  left: "mr-auto text-left items-start",
  center: "mx-auto text-center items-center",
  right: "ml-auto text-right items-end",
};

function BlockView({ block }: { block: Block }) {
  const wrap = `flex flex-col ${alignClass[block.align]}`;
  const style = { width: `${block.width}%`, maxWidth: "100%" };

  switch (block.type) {
    case "heading": {
      const cls =
        block.level === 1
          ? "font-display text-3xl font-bold text-plum-900 md:text-4xl"
          : block.level === 3
            ? "font-display text-lg font-semibold text-plum-900"
            : "font-display text-2xl font-bold text-plum-900";
      return (
        <div className={wrap} style={style}>
          <p className={cls}>{block.text}</p>
        </div>
      );
    }
    case "paragraph":
      return (
        <div className={wrap} style={style}>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
            {block.text}
          </p>
        </div>
      );
    case "quote":
      return (
        <div className={wrap} style={style}>
          <blockquote className="border-l-4 border-royal-500 pl-4 text-lg italic text-plum-900">
            {block.text}
          </blockquote>
        </div>
      );
    case "image":
      if (!block.src) return null;
      return (
        <div className={wrap} style={style}>
          <span className="relative block w-full overflow-hidden rounded-card">
            {/* remote images of unknown dimensions → plain img keeps it simple */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt ?? ""}
              className="h-auto w-full rounded-card object-cover"
            />
          </span>
        </div>
      );
    case "divider":
      return <hr className="my-2 border-iris-300/50" style={style} />;
    default:
      return null;
  }
}


export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks?.length) {
    return <p className="text-slate-700">This post has no content yet.</p>;
  }
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((b) => (
        <BlockView key={b.id} block={b} />
      ))}
    </div>
  );
}
