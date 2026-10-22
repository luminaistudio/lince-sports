// Copia o Drive (Brasil/<ano>/<liga>/<clube>/arquivos) para o Supabase. Kits entram como NÃO publicados.
// A pasta do Drive precisa estar compartilhada com o e-mail da conta de serviço.
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";
const drive = google.drive({ version: "v3", auth: new google.auth.GoogleAuth({ scopes: ["https://www.googleapis.com/auth/drive.readonly"] }) });
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const slugify = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const FOLDER = "application/vnd.google-apps.folder";
async function list(id: string) { const out: any[] = []; let t: string | undefined;
  do { const r = await drive.files.list({ q: `'${id}' in parents and trashed=false`, fields: "nextPageToken,files(id,name,mimeType)", pageSize: 1000, pageToken: t }); out.push(...(r.data.files ?? [])); t = r.data.nextPageToken ?? undefined; } while (t); return out; }
async function walk(id: string, path: string[]) {
  const items = await list(id), files = items.filter(f => f.mimeType !== FOLDER);
  for (const f of items.filter(f => f.mimeType === FOLDER)) await walk(f.id, [...path, f.name]);
  if (!files.length || path.length < 4) return;
  const [, year, league, club] = path.slice(-4), slug = slugify(`${club}-${year}`), stored: string[] = [];
  for (const f of files) {
    const r = await drive.files.get({ fileId: f.id, alt: "media" }, { responseType: "arraybuffer" });
    const p = `${slug}/${f.name}`;
    const { error } = await db.storage.from("kits").upload(p, Buffer.from(r.data as ArrayBuffer), { upsert: true });
    if (error) { console.error("falhou", p, error.message); continue; } stored.push(p);
  }
  const preview = stored.find(p => /\.(png|jpe?g|webp)$/i.test(p)) ?? null;
  await db.from("kits").upsert({ slug, name: club, league, season: year, files: stored, preview_path: preview }, { onConflict: "slug" });
  console.log("ok", slug, stored.length, "arquivos");
}
walk(process.env.DRIVE_ROOT_FOLDER_ID!, []).then(() => console.log("fim"));
