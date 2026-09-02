"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  GripVertical,
  Heading,
  Image as ImageIcon,
  Minus,
  Plus,
  Quote,
  Trash2,
  Type,
} from "lucide-react";

import type { Block, BlockAlign, BlockType } from "@/lib/blog/types";
import { newBlock } from "@/lib/blog/types";
import { uploadImage } from "@/lib/blog/api";

/** Auto-growing textarea used for text cells (Colab-style). */
function GrowText({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={`w-full resize-none border-none bg-transparent outline-none placeholder:text-smoke-400 ${className ?? ""}`}
    />
  );
}

function SortableBlock({
  block,
  onChange,
  onDelete,
}: {
  block: Block;
  onChange: (b: Block) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });
  const [uploading, setUploading] = React.useState(false);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const alignSelf =
    block.align === "center" ? "mx-auto" : block.align === "right" ? "ml-auto" : "mr-auto";
  const textAlign =
    block.align === "center" ? "text-center" : block.align === "right" ? "text-right" : "text-left";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange({ ...block, src: url });
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="group/block relative">
      <div className="flex gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 flex h-7 w-6 shrink-0 cursor-grab items-center justify-center rounded text-smoke-400 opacity-0 transition hover:bg-mist-100 hover:text-plum-900 group-hover/block:opacity-100 active:cursor-grabbing"
          title="Drag to reorder"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Cell body */}
        <div
          className="flex-1 rounded-panel border border-transparent p-2 transition hover:border-iris-300/50"
          style={{ maxWidth: "100%" }}
        >
          <div style={{ width: `${block.width}%` }} className={alignSelf}>
            {block.type === "heading" && (
              <GrowText
                value={block.text ?? ""}
                onChange={(v) => onChange({ ...block, text: v })}
                placeholder="Heading"
                className={`font-display font-bold text-plum-900 ${textAlign} ${
                  block.level === 1 ? "text-3xl" : block.level === 3 ? "text-lg" : "text-2xl"
                }`}
              />
            )}
            {block.type === "paragraph" && (
              <GrowText
                value={block.text ?? ""}
                onChange={(v) => onChange({ ...block, text: v })}
                placeholder="Write something…"
                className={`text-base leading-relaxed text-slate-700 ${textAlign}`}
              />
            )}
            {block.type === "quote" && (
              <div className="border-l-4 border-royal-500 pl-4">
                <GrowText
                  value={block.text ?? ""}
                  onChange={(v) => onChange({ ...block, text: v })}
                  placeholder="Quote…"
                  className={`text-lg italic text-plum-900 ${textAlign}`}
                />
              </div>
            )}
            {block.type === "image" && (
              <div>
                {block.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={block.src} alt={block.alt ?? ""} className="w-full rounded-card" />
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-iris-300/60 bg-mist-100/50 p-8 text-sm text-slate-700 hover:border-royal-500">
                    <ImageIcon className="h-6 w-6 text-royal-500" />
                    {uploading ? "Uploading…" : "Click to upload an image"}
                    <input type="file" accept="image/*" className="hidden" onChange={onFile} />
                  </label>
                )}
                {block.src && (
                  <input
                    value={block.alt ?? ""}
                    onChange={(e) => onChange({ ...block, alt: e.target.value })}
                    placeholder="Alt text (accessibility)"
                    className="mt-2 w-full rounded-panel border border-iris-300/40 bg-white px-2 py-1 text-xs outline-none focus:border-royal-500"
                  />
                )}
              </div>
            )}
            {block.type === "divider" && <hr className="border-iris-300/60" />}
          </div>
        </div>
      </div>

      {/* Per-block toolbar */}
      <div className="ml-8 mt-1 flex flex-wrap items-center gap-1 opacity-0 transition group-hover/block:opacity-100">
        {block.type !== "divider" && (
          <>
            <div className="flex overflow-hidden rounded-md border border-iris-300/50">
              {(["left", "center", "right"] as BlockAlign[]).map((a) => {
                const Icon = a === "left" ? AlignLeft : a === "center" ? AlignCenter : AlignRight;
                return (
                  <button
                    key={a}
                    onClick={() => onChange({ ...block, align: a })}
                    className={`p-1.5 ${block.align === a ? "bg-plum-900 text-white" : "bg-white text-smoke-400 hover:text-plum-900"}`}
                    title={`Align ${a}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
            {block.type === "heading" && (
              <select
                value={block.level ?? 2}
                onChange={(e) =>
                  onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })
                }
                className="rounded-md border border-iris-300/50 bg-white px-1.5 py-1 text-xs text-plum-900 outline-none"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
            )}
            <label className="flex items-center gap-1 rounded-md border border-iris-300/50 bg-white px-2 py-1 text-xs text-smoke-400">
              W
              <input
                type="range"
                min={25}
                max={100}
                step={5}
                value={block.width}
                onChange={(e) => onChange({ ...block, width: Number(e.target.value) })}
                className="h-1 w-20 accent-royal-500"
              />
              <span className="w-8 text-plum-900">{block.width}%</span>
            </label>
          </>
        )}
        <button
          onClick={onDelete}
          className="rounded-md border border-iris-300/50 bg-white p-1.5 text-smoke-400 hover:text-rose-700"
          title="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const ADD_MENU: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: "paragraph", label: "Text", icon: Type },
  { type: "heading", label: "Heading", icon: Heading },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "divider", label: "Divider", icon: Minus },
];

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = blocks.findIndex((b) => b.id === active.id);
    const newIndex = blocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(blocks, oldIndex, newIndex));
  }

  function updateBlock(id: string, next: Block) {
    onChange(blocks.map((b) => (b.id === id ? next : b)));
  }
  function deleteBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
  }
  function addBlock(type: BlockType) {
    onChange([...blocks, newBlock(type)]);
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-3">
            {blocks.map((b) => (
              <SortableBlock
                key={b.id}
                block={b}
                onChange={(next) => updateBlock(b.id, next)}
                onDelete={() => deleteBlock(b.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <p className="py-6 text-center text-sm text-smoke-400">
          Empty post — add your first cell below.
        </p>
      )}

      {/* Add-cell menu */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-panel border border-dashed border-iris-300/60 bg-mist-100/40 p-3">
        <span className="flex items-center gap-1 text-xs font-semibold text-plum-900">
          <Plus className="h-4 w-4" /> Add cell:
        </span>
        {ADD_MENU.map((m) => (
          <button
            key={m.type}
            onClick={() => addBlock(m.type)}
            className="flex items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-1.5 text-xs font-medium text-plum-900 transition hover:border-royal-500 hover:shadow-soft"
          >
            <m.icon className="h-3.5 w-3.5" /> {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
