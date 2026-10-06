import { NextResponse } from "next/server";

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

export async function POST(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const db = getSupabaseAdmin();
  if (!db) return NextResponse.json({ message: "Supabase not configured" }, { status: 503 });

  const form = await request.formData();
  const mode = String(form.get("mode") ?? "");
  const file = form.get("file");

  if (mode === "dzi-from-image") {
    return NextResponse.json(
      { message: "Generate the DZI folder locally with npm run dzi:generate, then upload the folder." },
      { status: 422 }
    );
  }

  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  const rawPaths = form.getAll("paths").map(String);

  // Large DZI folders are uploaded in small batches that share one packageId.
  // Paths are relative to the .dzi file's folder; the batch holding the .dzi rewrites its tile Url.
  if (mode === "dzi-batch") {
    const packageId = String(form.get("packageId") ?? "");
    if (!/^dzi\/\d+-[a-z0-9]+$/.test(packageId)) {
      return NextResponse.json({ message: "Invalid package id" }, { status: 400 });
    }
    if (files.length === 0 || files.length !== rawPaths.length) {
      return NextResponse.json({ message: "Batch paths are incomplete" }, { status: 400 });
    }
    const tileFolder = safeStoragePath(String(form.get("tileFolder") ?? ""));
    let dziUrl: string | undefined;
    for (let i = 0; i < files.length; i++) {
      const safePath = safeStoragePath(rawPaths[i]);
      if (!safePath) return NextResponse.json({ message: "Invalid file path" }, { status: 400 });
      const isDzi = /\.dzi$/i.test(safePath);
      if (isDzi && !tileFolder) {
        return NextResponse.json({ message: "Missing tile folder name" }, { status: 400 });
      }
      const bytes = isDzi
        ? new TextEncoder().encode(withDziTileFolder(await files[i].text(), tileFolder!))
        : new Uint8Array(await files[i].arrayBuffer());
      const storagePath = `${packageId}/${safePath}`;
      const { error } = await db.storage.from("blog").upload(storagePath, bytes, {
        contentType: contentTypeFor(files[i], safePath),
        cacheControl: "31536000",
        upsert: true,
      });
      if (error) return NextResponse.json({ message: error.message }, { status: 400 });
      if (isDzi) dziUrl = db.storage.from("blog").getPublicUrl(storagePath).data.publicUrl;
    }
    return NextResponse.json({ url: dziUrl ?? null });
  }

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
