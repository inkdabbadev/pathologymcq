"use client";

import { useEffect, useRef, useState } from "react";
import { AlignCenter, AlignLeft, AlignRight, GripVertical } from "lucide-react";

import {
  BLOCK_TYPES,
  SPLIT_SIDE_TYPES,
  emptySplitSide,
  newBlock,
  type Block,
  type BlockType,
  type SplitSide,
  type SplitSideType,
  type TextAlign,
} from "@/lib/blocks/types";
import { cn } from "@/lib/utils";

function alignClass(align: TextAlign | undefined): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// A "heading" starts a new section at the top level; everything after it —
// subheadings and regular content alike — nests one level in, until the next
// heading resets back to the top. Subheadings are siblings, not deeper nesting.
function computeIndentLevels(blocks: Block[]): number[] {
  let current = 0;
  return blocks.map((block) => {
    if (block.type === "heading") {
      current = 1;
      return 0;
    }
    return current;
  });
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY_MS = 800;

export function PageBlockEditor({
  slug,
  initialBlocks,
  isAdmin,
}: {
  slug: string;
  initialBlocks: Block[];
  isAdmin: boolean;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [picker, setPicker] = useState<number | null>(null); // index where + was clicked
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const blocksRef = useRef(initialBlocks);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const persist = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: blocksRef.current }),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
  };

  const commit = (next: Block[]) => {
    blocksRef.current = next;
    setBlocks(next);
    setSaveStatus("idle");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void persist(), AUTOSAVE_DELAY_MS);
  };

  const flushSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    void persist();
  };

  const update = (id: string, patch: Partial<Block>) => {
    commit(blocksRef.current.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };
  const remove = (id: string) => {
    if (editingId === id) setEditingId(null);
    commit(blocksRef.current.filter((x) => x.id !== id));
  };
  const move = (i: number, dir: 1 | -1) => {
    const j = i + dir;
    if (j < 0 || j >= blocksRef.current.length) return;
    const copy = [...blocksRef.current];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    commit(copy);
  };
  const reorderTo = (to: number) => {
    if (draggingIndex === null || draggingIndex === to) return;
    commit(moveItem(blocksRef.current, draggingIndex, to));
  };
  const insertAt = (i: number, type: BlockType) => {
    const created = newBlock(type);
    const copy = [...blocksRef.current];
    copy.splice(i, 0, created);
    commit(copy);
    setPicker(null);
    setEditingId(created.id);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    // Full reload, same reasoning as login: guarantees this page (and the
    // client router cache entry for it) re-checks the cleared cookie fresh.
    window.location.reload();
  };

  const exitEditingIfBlurredAway = (e: React.FocusEvent<HTMLDivElement>, blockId: string) => {
    if (editingId !== blockId) return;
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setEditingId(null);
      flushSave();
    }
  };

  const indentLevels = computeIndentLevels(blocks);

  return (
    <div className="w-full px-[var(--gutter)]">
      <div className="flex flex-col">
        {isAdmin && (
          <Inserter
            onPick={(t) => insertAt(0, t)}
            open={picker === 0}
            setOpen={(v) => setPicker(v ? 0 : null)}
          />
        )}

        {blocks.map((block, i) => {
          const isEditing = isAdmin && editingId === block.id;
          return (
            <div
              key={block.id}
              className={cn(
                "group relative rounded-md",
                indentLevels[i] > 0 && "border-l-2 border-[#e2e6ee] pl-6",
                draggingIndex === i && "opacity-40",
                dragOverIndex === i &&
                  draggingIndex !== null &&
                  draggingIndex !== i &&
                  "outline outline-2 outline-offset-2 outline-[#4f7cff]"
              )}
              onBlur={(e) => exitEditingIfBlurredAway(e, block.id)}
              onDragOver={(e) => {
                if (draggingIndex === null) return;
                e.preventDefault();
                if (dragOverIndex !== i) setDragOverIndex(i);
              }}
              onDragLeave={() => setDragOverIndex((cur) => (cur === i ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                reorderTo(i);
                setDraggingIndex(null);
                setDragOverIndex(null);
              }}
            >
              {isEditing ? (
                <BlockEdit block={block} onChange={(p) => update(block.id, p)} />
              ) : isAdmin ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setEditingId(block.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingId(block.id);
                  }}
                  className="cursor-text rounded-md transition-colors hover:bg-[#f7f9fc]"
                >
                  <BlockReadOnly block={block} />
                </div>
              ) : (
                <BlockReadOnly block={block} />
              )}
              {isAdmin && (
                <div className="my-0.5 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <button
                    draggable
                    onDragStart={(e) => {
                      setDraggingIndex(i);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", block.id);
                    }}
                    onDragEnd={() => {
                      setDraggingIndex(null);
                      setDragOverIndex(null);
                    }}
                    className="flex h-7 w-[30px] cursor-grab items-center justify-center rounded-md border border-[#ddd] bg-white active:cursor-grabbing"
                    title="Drag to reorder"
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <button
                    className="h-7 w-[30px] cursor-pointer rounded-md border border-[#ddd] bg-white"
                    onClick={() => move(i, -1)}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="h-7 w-[30px] cursor-pointer rounded-md border border-[#ddd] bg-white"
                    onClick={() => move(i, 1)}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    className="h-7 w-[30px] cursor-pointer rounded-md border border-[#ddd] bg-white"
                    onClick={() => remove(block.id)}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              )}
              {isAdmin && (
                <Inserter
                  onPick={(t) => insertAt(i + 1, t)}
                  open={picker === i + 1}
                  setOpen={(v) => setPicker(v ? i + 1 : null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full bg-[#1f2430]/95 px-4 py-2 text-xs text-white shadow-lg">
          <span>
            {saveStatus === "saving" && "Saving…"}
            {saveStatus === "saved" && "Saved"}
            {saveStatus === "error" && "Save failed"}
            {saveStatus === "idle" && "Editing"}
          </span>
          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

// ── The + inserter (Colab-style) ───────────────────────────────
function Inserter({
  onPick,
  open,
  setOpen,
}: {
  onPick: (t: BlockType) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div className="relative py-1">
      <button
        className="w-full cursor-pointer rounded-lg border border-dashed border-[#c7cdd8] bg-[#f7f9fc] px-3 py-1.5 text-left text-[13px] text-[#64748b]"
        onClick={() => setOpen(!open)}
      >
        + Add block
      </button>
      {open && (
        <div className="absolute z-20 mt-1 min-w-[200px] rounded-[10px] border border-[#e2e6ee] bg-white p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          {BLOCK_TYPES.map((t) => (
            <button
              key={t.type}
              className="flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-[9px] text-left text-sm hover:bg-[#f1f4f9]"
              onClick={() => onPick(t.type)}
            >
              <span className="inline-block w-[22px] text-center">{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Read-only render of one block (public view + admin, when not the block being edited) ──
function BlockReadOnly({ block }: { block: Block }) {
  const { type, text, url, align } = block;

  if (type === "heading")
    return <h1 className={cn("my-3 text-[32px] font-bold", alignClass(align))}>{text}</h1>;
  if (type === "subheading")
    return (
      <h2 className={cn("my-2.5 text-[22px] font-semibold text-[#333]", alignClass(align))}>
        {text}
      </h2>
    );
  if (type === "body")
    return <p className={cn("text-base leading-[1.6] text-[#333]", alignClass(align))}>{text}</p>;
  if (type === "image")
    return text ? (
      <img className="mx-auto my-2 block max-w-full rounded-lg" src={text} alt={url || ""} />
    ) : null;
  if (type === "split")
    return (
      <div className="my-3 flex flex-col items-start gap-5 sm:flex-row">
        <SplitSideView side={block.left} />
        <SplitSideView side={block.right} />
      </div>
    );
  if (type === "link")
    return url ? (
      <a className="text-[#2563eb]" href={url} target="_blank" rel="noreferrer">
        {text || url}
      </a>
    ) : null;
  return null;
}

// ── Editable render of one block (only the block currently focused) ──
function BlockEdit({
  block,
  onChange,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
}) {
  const { type, text, url } = block;

  if (type === "image") return <ImageBlockEdit text={text} url={url} onChange={onChange} />;
  if (type === "split")
    return (
      <div className="my-3 flex flex-col items-start gap-5 sm:flex-row">
        <SplitSideEdit
          side={block.left ?? emptySplitSide()}
          onChange={(left) => onChange({ left })}
        />
        <SplitSideEdit
          side={block.right ?? emptySplitSide()}
          onChange={(right) => onChange({ right })}
        />
      </div>
    );

  if (type === "link")
    return (
      <div className="flex flex-col gap-1.5 py-1.5">
        <input
          className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
          placeholder="Link text"
          value={text}
          autoFocus
          onChange={(e) => onChange({ text: e.target.value })}
        />
        <input
          className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
          placeholder="https://..."
          value={url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </div>
    );

  // heading / subheading / body -> textarea
  const cls =
    type === "heading"
      ? "text-[32px] font-bold"
      : type === "subheading"
        ? "text-[22px] font-semibold text-[#333]"
        : "text-base leading-[1.6]";
  return (
    <div>
      <AlignControl align={block.align} onChange={(align) => onChange({ align })} />
      <textarea
        className={cn(
          "w-full resize-y rounded-lg border border-[#4f7cff] bg-[#fbfcff] p-2 outline-none",
          cls,
          alignClass(block.align)
        )}
        placeholder={`Type ${type}…`}
        value={text}
        autoFocus
        rows={type === "body" ? 3 : 1}
        onChange={(e) => onChange({ text: e.target.value })}
      />
    </div>
  );
}

// ── Left / center / right text-alignment control (shown while editing) ──
function AlignControl({
  align,
  onChange,
}: {
  align: TextAlign | undefined;
  onChange: (align: TextAlign) => void;
}) {
  const options: { value: TextAlign; label: string; Icon: typeof AlignLeft }[] = [
    { value: "left", label: "Align left", Icon: AlignLeft },
    { value: "center", label: "Align center", Icon: AlignCenter },
    { value: "right", label: "Align right", Icon: AlignRight },
  ];
  const current = align ?? "left";

  return (
    <div className="mb-1 flex gap-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          onClick={() => onChange(value)}
          className={cn(
            "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#ddd] bg-white text-[#64748b]",
            current === value && "border-[#4f7cff] bg-[#eef2ff] text-[#4f7cff]"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function useImageUpload(onUploaded: (url: string) => void) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (!res.ok || !json.url) throw new Error(json.message ?? "Upload failed");
      onUploaded(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, handleFile };
}

function ImageBlockEdit({
  text,
  url,
  onChange,
}: {
  text: string;
  url: string;
  onChange: (patch: Partial<Block>) => void;
}) {
  const { uploading, error, handleFile } = useImageUpload((uploadedUrl) =>
    onChange({ text: uploadedUrl })
  );

  return (
    <div className="flex flex-col gap-1.5 py-1.5">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={uploading}
      />
      {uploading && <span className="text-xs text-[#64748b]">Uploading…</span>}
      {error && <span className="text-xs text-red-600">{error}</span>}
      <input
        className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
        placeholder="Or paste an image URL"
        value={text}
        onChange={(e) => onChange({ text: e.target.value })}
      />
      <input
        className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
        placeholder="Alt text"
        value={url}
        onChange={(e) => onChange({ url: e.target.value })}
      />
      {text && <img className="mx-auto my-2 block max-w-full rounded-lg" src={text} alt={url} />}
    </div>
  );
}

// ── Read-only render of one half of a split block ──────────────
function SplitSideView({ side }: { side: SplitSide | undefined }) {
  if (!side || side.type === "empty") return <div className="min-w-0 flex-1" />;
  const { type, text, url, align } = side;

  return (
    <div className="min-w-0 flex-1">
      {type === "heading" && (
        <h1 className={cn("my-3 text-[32px] font-bold", alignClass(align))}>{text}</h1>
      )}
      {type === "subheading" && (
        <h2 className={cn("my-2.5 text-[22px] font-semibold text-[#333]", alignClass(align))}>
          {text}
        </h2>
      )}
      {type === "body" && (
        <p className={cn("text-base leading-[1.6] text-[#333]", alignClass(align))}>{text}</p>
      )}
      {type === "image" && text && (
        <img className="my-2 w-full rounded-lg" src={text} alt={url || ""} />
      )}
      {type === "link" && url && (
        <a className="text-[#2563eb]" href={url} target="_blank" rel="noreferrer">
          {text || url}
        </a>
      )}
    </div>
  );
}

// ── Editable render of one half of a split block ────────────────
function SplitSideEdit({
  side,
  onChange,
}: {
  side: SplitSide;
  onChange: (side: SplitSide) => void;
}) {
  const { type, text, url } = side;
  const { uploading, error, handleFile } = useImageUpload((uploadedUrl) =>
    onChange({ ...side, text: uploadedUrl })
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-1.5">
      <select
        className="mb-1.5 w-full rounded-[7px] border border-[#dfe3ea] bg-[#f7f9fc] px-2 py-1.5 text-[13px] text-[#333]"
        value={type}
        onChange={(e) => onChange({ type: e.target.value as SplitSideType, text: "", url: "" })}
      >
        {SPLIT_SIDE_TYPES.map((t) => (
          <option key={t.type} value={t.type}>
            {t.label}
          </option>
        ))}
      </select>

      {type === "empty" && <p className="text-xs text-[#64748b]">Left blank.</p>}

      {(type === "heading" || type === "subheading" || type === "body") && (
        <>
          <AlignControl align={side.align} onChange={(align) => onChange({ ...side, align })} />
          <textarea
            className={cn(
              "w-full resize-y rounded-lg border border-[#4f7cff] bg-[#fbfcff] p-2 outline-none",
              type === "heading"
                ? "text-[32px] font-bold"
                : type === "subheading"
                  ? "text-[22px] font-semibold text-[#333]"
                  : "text-base leading-[1.6]",
              alignClass(side.align)
            )}
            placeholder={`Type ${type}…`}
            value={text}
            rows={type === "body" ? 3 : 1}
            onChange={(e) => onChange({ ...side, text: e.target.value })}
          />
        </>
      )}

      {type === "image" && (
        <>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            onChange={(e) => handleFile(e.target.files?.[0])}
            disabled={uploading}
          />
          {uploading && <span className="text-xs text-[#64748b]">Uploading…</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
          <input
            className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
            placeholder="Or paste an image URL"
            value={text}
            onChange={(e) => onChange({ ...side, text: e.target.value })}
          />
          <input
            className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
            placeholder="Alt text"
            value={url}
            onChange={(e) => onChange({ ...side, url: e.target.value })}
          />
          {text && <img className="my-2 w-full rounded-lg" src={text} alt={url} />}
        </>
      )}

      {type === "link" && (
        <>
          <input
            className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
            placeholder="Link text"
            value={text}
            onChange={(e) => onChange({ ...side, text: e.target.value })}
          />
          <input
            className="rounded-[7px] border border-[#dfe3ea] p-2 text-sm"
            placeholder="https://..."
            value={url}
            onChange={(e) => onChange({ ...side, url: e.target.value })}
          />
        </>
      )}
    </div>
  );
}
