import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { pub, admin, ini, type Kit } from "@/lib/supabase";
const get = async (slug: string) => (await pub().from("kits").select("*").eq("slug", slug).single()).data as Kit | null;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const k = await get((await params).slug); return k ? { title: `${k.name} ${k.season}`, description: `Kit do ${k.name} (${k.season}) para PES 2014 PSP.` } : {};
}
export default async function KitPage({ params }: { params: Promise<{ slug: string }> }) {
  const k = await get((await params).slug); if (!k) notFound();
  const preview = k.preview_path ? (await admin().storage.from("kits").createSignedUrl(k.preview_path, 3600)).data?.signedUrl : null;
  return <main className="w det"><div className="im big">{preview ? <img src={preview} alt={`Prévia do kit ${k.name}`} /> : ini(k.name)}</div>
    <div><small>{k.league}</small><h1>{k.name}</h1><p className="mut">{k.type === "kitpack" ? "Kitpack" : "Kit"} · {k.season}</p>
      <dl><dt>Compatibilidade</dt><dd>PES 2014 PSP</dd><dt>Autor</dt><dd>{k.author ?? "Não informado"}</dd><dt>Versão</dt><dd>{k.version ?? "—"}</dd><dt>Arquivos</dt><dd>{k.files.length}</dd><dt>Downloads</dt><dd>{k.download_count}</dd></dl>
      {k.description && <p>{k.description}</p>}
      {k.files.length ? <a className="dl" href={`/api/download/${k.slug}`} download>Baixar {k.type === "kitpack" ? "kitpack" : "kit"}</a> : <p className="mut">Arquivo ainda não disponível.</p>}</div></main>;
}
