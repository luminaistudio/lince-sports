import { createHash } from "crypto";
import JSZip from "jszip";
import { admin } from "@/lib/supabase";
export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = admin();
  const { data: kit } = await db.from("kits").select("id,slug,files").eq("slug", slug).eq("published", true).single();
  if (!kit || !kit.files.length) return Response.json({ error: "Arquivo indisponível para este kit." }, { status: 404 });

  const zip = new JSZip();
  for (const path of kit.files as string[]) {
    const { data, error } = await db.storage.from("kits").download(path);
    if (error || !data) return Response.json({ error: "Falha ao ler os arquivos do kit." }, { status: 502 });
    zip.file(path.split("/").pop()!, await data.arrayBuffer());
  }
  const body = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });

  const h = req.headers;
  const visitor = createHash("sha256").update((h.get("x-forwarded-for") ?? "") + (h.get("user-agent") ?? "")).digest("hex");
  await db.rpc("register_download", { p_kit: kit.id, p_visitor: visitor });

  return new Response(body, { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="${kit.slug}.zip"`, "Cache-Control": "no-store" } });
}
