"use client";

import * as React from "react";
import { Crop, ImageIcon } from "lucide-react";

import { uploadImage } from "@/lib/blog/api";

type ImageCropUploadProps = {
  value?: string;
  label?: string;
  aspectRatio?: number;
  cropEnabled?: boolean;
  onChange: (url: string) => void;
  className?: string;
};

export function ImageCropUpload({
  value,
  label = "Upload",
  aspectRatio = 1,
  cropEnabled = true,
  onChange,
  className = "",
}: ImageCropUploadProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [sourceUrl, setSourceUrl] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef<{ active: boolean; startX: number; startY: number; startOffsetX: number; startOffsetY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const handleFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result ?? "");
      setSourceUrl(url);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    reader.readAsDataURL(file);
  };

  const applyCrop = React.useCallback(async () => {
    if (!sourceUrl) return;

    if (!cropEnabled || !selectedFile) {
      if (!selectedFile) {
        setSourceUrl(null);
        return;
      }

      setUploading(true);
      try {
        const uploadedUrl = await uploadImage(selectedFile);
        onChange(uploadedUrl);
      } finally {
        setUploading(false);
        setSourceUrl(null);
      }
      return;
    }

    const img = new window.Image();
    img.onload = async () => {
      const frameWidth = 1200;
      const frameHeight = Math.round(frameWidth / aspectRatio);
      const scale = Math.max(frameWidth / img.naturalWidth, frameHeight / img.naturalHeight) * zoom;
      const displayWidth = img.naturalWidth * scale;
      const displayHeight = img.naturalHeight * scale;
      const baseX = (frameWidth - displayWidth) / 2 + offsetX;
      const baseY = (frameHeight - displayHeight) / 2 + offsetY;

      const sx = Math.max(0, (-baseX) / scale);
      const sy = Math.max(0, (-baseY) / scale);
      const sw = Math.min(img.naturalWidth, frameWidth / scale);
      const sh = Math.min(img.naturalHeight, frameHeight / scale);

      const canvas = document.createElement("canvas");
      canvas.width = frameWidth;
      canvas.height = frameHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, frameWidth, frameHeight);
      ctx.drawImage(
        img,
        sx,
        sy,
        sw,
        sh,
        0,
        0,
        frameWidth,
        frameHeight,
      );

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) return;

      setUploading(true);
      try {
        const uploadedUrl = await uploadImage(new File([blob], "cropped-image.jpg", { type: "image/jpeg" }));
        onChange(uploadedUrl);
      } finally {
        setUploading(false);
        setSourceUrl(null);
      }
    };

    img.src = sourceUrl;
  }, [aspectRatio, cropEnabled, offsetX, offsetY, onChange, selectedFile, sourceUrl, zoom]);

  return (
    <div className={className}>
      {value ? (
        <div className="mb-2 overflow-hidden rounded-xl border border-iris-300/60 bg-white">
          <img src={value} alt="Uploaded preview" className="h-20 w-full object-cover" />
        </div>
      ) : null}

      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-iris-300/60 bg-white px-3 py-2 text-xs font-medium text-plum-900 hover:border-royal-500"
        onClick={() => inputRef.current?.click()}
      >
        <ImageIcon className="h-3.5 w-3.5" />
        {uploading ? "Uploading…" : label}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          handleFile(file);
          e.target.value = "";
        }}
      />

      {sourceUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-plum-900">
                <Crop className="h-4 w-4" /> {cropEnabled ? "Adjust crop" : "Original image"}
              </div>
              <button
                type="button"
                className="rounded-full border border-iris-300/60 px-2 py-1 text-xs text-plum-900"
                onClick={() => setSourceUrl(null)}
              >
                Close
              </button>
            </div>

            <div
              className="relative mx-auto overflow-hidden rounded-xl border border-iris-300/60 bg-slate-100"
              style={{ aspectRatio, maxHeight: 420, width: "100%", touchAction: "none" }}
              onPointerMove={(event) => {
                if (!dragRef.current.active) return;
                const dx = event.clientX - dragRef.current.startX;
                const dy = event.clientY - dragRef.current.startY;
                setOffsetX(dragRef.current.startOffsetX + dx * 1.2);
                setOffsetY(dragRef.current.startOffsetY + dy * 1.2);
              }}
              onPointerUp={() => {
                dragRef.current.active = false;
                setDragging(false);
              }}
              onPointerLeave={() => {
                dragRef.current.active = false;
                setDragging(false);
              }}
            >
              <img
                src={sourceUrl}
                alt="Crop preview"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${zoom})`,
                  transformOrigin: "center",
                  cursor: dragging ? "grabbing" : "grab",
                  userSelect: "none",
                }}
                onPointerDown={(event) => {
                  dragRef.current = {
                    active: true,
                    startX: event.clientX,
                    startY: event.clientY,
                    startOffsetX: offsetX,
                    startOffsetY: offsetY,
                  };
                  setDragging(true);
                  event.preventDefault();
                }}
              />
              <div className="pointer-events-none absolute inset-0 ring-2 ring-royal-500/80 ring-inset" />
            </div>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-plum-900">
                Zoom: {zoom.toFixed(1)}x
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="mt-1 w-full"
                />
              </label>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Drag the image inside the fixed frame to choose the visible area.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-full border border-iris-300/60 px-3 py-2 text-sm text-plum-900"
                onClick={() => setSourceUrl(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full bg-plum-900 px-3 py-2 text-sm text-white"
                onClick={() => {
                  void applyCrop();
                }}
              >
                {cropEnabled ? "Save crop" : "Upload original"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
