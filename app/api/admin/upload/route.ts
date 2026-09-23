import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { getAdmin } from "@/lib/admin/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function safeStoragePath(path: string): string | null {
  const clean = path.replace(/\\/g, "/").replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0 || parts.some((part) => part === "." || part === "..")) return null;
  return parts.map((part) => part.replace(/[^a-zA-Z0-9._ -]/g, "-")).join("/");
}

function contentTypeFor(file: File, path: string): string {
  if (file.type) return file.type;
  return contentTypeForPath(path);
}

function contentTypeForPath(path: string): string {
  if (/\.dzi$/i.test(path)) return "application/xml";
  if (/\.jpe?g$/i.test(path)) return "image/jpeg";
  if (/\.png$/i.test(path)) return "image/png";
  if (/\.webp$/i.test(path)) return "image/webp";
  return "application/octet-stream";
}

function dirname(path: string): string {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index) : "";
}

function basenameWithoutExt(path: string): string {
  const name = path.split("/").pop() ?? path;
  return name.replace(/\.[^.]+$/, "");
}

function withDziTileFolder(xml: string, tileFolder: string): string {
  if (/\sUrl="[^"]*"/i.test(xml)) return xml.replace(/\sUrl="[^"]*"/i, ` Url="${tileFolder}/"`);
  return xml.replace(/<Image\b/i, `<Image Url="${tileFolder}/"`);
}

function hostedSingleDziXml(xml: string, fileName: string): string | null {
  const url = xml.match(/\sUrl="([^"]*)"/i)?.[1]?.trim();
  if (url && (/^(https?:)?\/\//i.test(url) || url.startsWith("/"))) return xml;
  if (url) return null;

  const tileFolder = `${basenameWithoutExt(fileName)}_files`;
  return withDziTileFolder(xml, `/dzi/${tileFolder}`);
}

async function walkFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);
      return entry.isDirectory() ? walkFiles(path) : [path];
    })
  );
  return files.flat();
}

async function uploadGeneratedDzi(db: ReturnType<typeof getSupabaseAdmin>, file: File): Promise<string> {
  if (!db) throw new Error("Supabase not configured");
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|tiff?|avif)$/i.test(file.name)) {
    throw new Error("Upload a JPG, PNG, WebP, AVIF or TIFF image to create DZI tiles.");
  }

  const tempDir = await mkdtemp(join(tmpdir(), "pathology-dzi-"));
  try {
    const baseName = (safeStoragePath(basenameWithoutExt(file.name)) ?? "slide").replace(/\//g, "-") || "slide";
    const outputBase = `${tempDir}/${baseName}`;
    const input = Buffer.from(await file.arrayBuffer());

    await sharp(input, { limitInputPixels: false })
      .rotate()
      .jpeg({ quality: 90 })
      .tile({ layout: "dz", size: 254, overlap: 1 })
      .toFile(outputBase);

    const packageId = `dzi/${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const generatedFiles = await walkFiles(tempDir);
    let publicDziPath = "";

    for (const generatedPath of generatedFiles) {
      const relativePath = relative(tempDir, generatedPath).replace(/\\/g, "/");
      const storagePath = `${packageId}/${relativePath}`;
      const bytes = await readFile(generatedPath);
      const { error } = await db.storage.from("blog").upload(storagePath, bytes, {
        contentType: contentTypeForPath(relativePath),
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) throw new Error(error.message);
      if (/\.dzi$/i.test(relativePath)) publicDziPath = storagePath;
    }

    if (!publicDziPath) throw new Error("DZI generation did not produce a .dzi file.");
    const { data } = db.storage.from("blog").getPublicUrl(publicDziPath);
    return data.publicUrl;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

  const form = await request.formData();
  const mode = String(form.get("mode") ?? "");
  const file = form.get("file");

  if (mode === "dzi-from-image") {
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 });
    }
    try {
      const url = await uploadGeneratedDzi(db, file);
      return NextResponse.json({ url });
    } catch (err) {
      return NextResponse.json(
        { message: err instanceof Error ? err.message : "DZI generation failed" },
        { status: 400 }
      );
    }
  }

  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  const rawPaths = form.getAll("paths").map(String);

  if (files.length > 0) {
    if (files.length !== rawPaths.length) {
      return NextResponse.json({ message: "DZI package paths are incomplete" }, { status: 400 });
    }

    const dziIndex = rawPaths.findIndex((path) => /\.dzi$/i.test(path));
    if (dziIndex < 0) {
      return NextResponse.json({ message: "Select a folder/package that includes a .dzi file" }, { status: 400 });
    }

    const packageId = `dzi/${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const safePaths = rawPaths.map((path) => safeStoragePath(path));
    if (safePaths.some((path) => !path)) {
      return NextResponse.json({ message: "One or more selected files has an invalid path" }, { status: 400 });
    }

    const safeDziPath = safePaths[dziIndex]!;
    const dziDir = dirname(safeDziPath);
    const expectedTileFolder = `${basenameWithoutExt(safeDziPath)}_files`;
    const actualTilePrefix =
      safePaths.find((path) => {
        if (!path || path === safeDziPath) return false;
        const relative = dziDir && path.startsWith(`${dziDir}/`) ? path.slice(dziDir.length + 1) : path;
        return relative.startsWith(`${expectedTileFolder}/`);
      }) ??
      safePaths.find((path) => {
        if (!path || path === safeDziPath) return false;
        const relative = dziDir && path.startsWith(`${dziDir}/`) ? path.slice(dziDir.length + 1) : path;
        return /_files\//i.test(relative);
      });

    if (!actualTilePrefix) {
      return NextResponse.json(
        { message: "The upload must include the .dzi file and its matching *_files tile folder" },
        { status: 400 }
      );
    }

    const tileFolder = (dziDir && actualTilePrefix.startsWith(`${dziDir}/`)
      ? actualTilePrefix.slice(dziDir.length + 1)
      : actualTilePrefix
    ).split("/")[0];
    let publicDziPath = "";

    for (let i = 0; i < files.length; i++) {
      const safePath = safePaths[i]!;

      const storagePath = `${packageId}/${safePath}`;
      const bytes =
        i === dziIndex
          ? new TextEncoder().encode(withDziTileFolder(await files[i].text(), tileFolder))
          : new Uint8Array(await files[i].arrayBuffer());
      const { error } = await db.storage.from("blog").upload(storagePath, bytes, {
        contentType: contentTypeFor(files[i], safePath),
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) return NextResponse.json({ message: error.message }, { status: 400 });
      if (i === dziIndex) publicDziPath = storagePath;
    }

    const { data } = db.storage.from("blog").getPublicUrl(publicDziPath);
    return NextResponse.json({ url: data.publicUrl });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const isSingleDzi = /\.dzi$/i.test(file.name);
  const dziText = isSingleDzi ? hostedSingleDziXml(await file.text(), file.name) : null;
  if (isSingleDzi && !dziText) {
    return NextResponse.json(
      { message: "This .dzi references local tiles that are not hosted. Upload the DZI package with its *_files folder instead." },
      { status: 400 }
    );
  }
  let bytes: Uint8Array;
  if (isSingleDzi) {
    bytes = new TextEncoder().encode(dziText!);
  } else {
    bytes = new Uint8Array(await file.arrayBuffer());
  }

  const { error } = await db.storage.from("blog").upload(path, bytes, {
    contentType: contentTypeFor(file, path),
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return NextResponse.json({ message: error.message }, { status: 400 });

  const { data } = db.storage.from("blog").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
