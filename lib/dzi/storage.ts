import type { SupabaseClient } from "@supabase/supabase-js";

export type DziUpload = {
  id: string;
  name: string;
  createdAt: string | null;
  url: string | null;
};

export function validDziId(id: string): boolean {
  return /^dzi\/\d+-[a-z0-9]+$/.test(id) || /^\d+-[a-z0-9]+\.dzi$/i.test(id);
}

export function dziStorage(db: SupabaseClient) {
  return db.storage.from("blog");
}

type Storage = ReturnType<typeof dziStorage>;

async function* entries(storage: Storage, prefix: string) {
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const { data, error } = await storage.list(prefix, {
      limit, offset, sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(error.message);
    if (!data) throw new Error("Could not list slide files");
    for (const item of data) yield item;
    if (data.length < limit) break;
  }
}

async function findDescriptor(storage: Storage, prefix: string): Promise<string | null> {
  for await (const item of entries(storage, prefix)) {
    const path = `${prefix}/${item.name}`;
    if (item.id && /\.dzi$/i.test(item.name)) return path;
    if (!item.id && !/_files$/i.test(item.name)) {
      const found = await findDescriptor(storage, path);
      if (found) return found;
    }
  }
  return null;
}

export async function listDziUploads(storage: Storage): Promise<DziUpload[]> {
  const uploads: DziUpload[] = [];
  for await (const item of entries(storage, "dzi")) {
    const id = `dzi/${item.name}`;
    if (item.id || !validDziId(id)) continue;
    const descriptor = await findDescriptor(storage, id);
    const timestamp = Number(item.name.split("-")[0]);
    const date = new Date(timestamp);
    uploads.push({
      id,
      name: descriptor?.split("/").pop() ?? item.name,
      createdAt: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      url: descriptor ? storage.getPublicUrl(descriptor).data.publicUrl : null,
    });
  }
  // Older single-descriptor uploads live at the bucket root. Their external
  // tiles are not owned by the upload and must never be deleted with it.
  for await (const item of entries(storage, "")) {
    if (!item.id || !validDziId(item.name)) continue;
    uploads.push({ id: item.name, name: item.name, createdAt: item.created_at,
      url: storage.getPublicUrl(item.name).data.publicUrl });
  }
  return uploads.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}

export async function latestDziUpload(storage: Storage): Promise<DziUpload | null> {
  const { data, error } = await storage.list("dzi", {
    limit: 100,
    sortBy: { column: "name", order: "desc" },
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Could not list slide files");
  for (const item of data) {
    const id = `dzi/${item.name}`;
    if (item.id || !validDziId(id)) continue;
    const descriptor = await findDescriptor(storage, id);
    if (!descriptor) continue;
    const timestamp = Number(item.name.split("-")[0]);
    const date = new Date(timestamp);
    return {
      id,
      name: descriptor.split("/").pop() ?? item.name,
      createdAt: Number.isNaN(date.getTime()) ? null : date.toISOString(),
      url: storage.getPublicUrl(descriptor).data.publicUrl,
    };
  }
  return null;
}

async function* packageFiles(storage: Storage, prefix: string): AsyncGenerator<string> {
  const descriptors: string[] = [];
  for await (const item of entries(storage, prefix)) {
    const path = `${prefix}/${item.name}`;
    if (!item.id) yield* packageFiles(storage, path);
    else if (/\.dzi$/i.test(item.name)) descriptors.push(path);
    else yield path;
  }
  // Keep the descriptor visible in history until its tiles have been removed.
  yield* descriptors;
}

export async function deleteDziBatch(storage: Storage, id: string) {
  if (!validDziId(id)) throw new Error("Invalid slide id");
  const paths: string[] = [];
  // Supabase accepts up to 1,000 paths per remove call. A normal DZI package
  // therefore disappears in one request instead of requiring several browser
  // round trips that can be interrupted on Cloudflare.
  const limit = 1000;
  if (id.startsWith("dzi/")) {
    for await (const path of packageFiles(storage, id)) {
      paths.push(path);
      if (paths.length === limit) break;
    }
  } else paths.push(id);
  if (paths.length) {
    const { data, error } = await storage.remove(paths);
    if (error) throw new Error(error.message);
    if (!data || data.length !== paths.length) {
      throw new Error(`Storage removed ${data?.length ?? 0} of ${paths.length} slide files`);
    }
  }
  return { done: paths.length < limit, removed: paths.length };
}
