import { pub, ini, type Kit } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Home() {
  let kits: Kit[] = [];
  let unavailable = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!unavailable) {
    try {
      const { data, error } = await pub().from("kits").select("*").eq("published", true).order("created_at", { ascending: false });
      unavailable = Boolean(error);
      kits = (data ?? []) as Kit[];
    } catch {
      unavailable = true;
    }
  }
  return <main className="w"><h1>O futebol nos detalhes.</h1><p className="mut">Os melhores kits para o PES 2014 PSP.</p>
    {kits.length ? <div className="grid">{kits.map(k => <a key={k.id} href={`/kits/${k.slug}`} className="card"><div className="im">{ini(k.name)}</div><small>{k.league}</small><b>{k.name}</b><small>{k.type === "kitpack" ? "Kitpack" : "Kit"} · {k.season}</small></a>)}</div>
      : <div className="empty"><b>{unavailable ? "Catálogo em preparação." : "Nenhum kit publicado ainda."}</b><br />{unavailable ? "Os kits estarão disponíveis em breve. Volte para conferir as novidades." : "Novos kits estarão disponíveis em breve."}</div>}</main>;
}
