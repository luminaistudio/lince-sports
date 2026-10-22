import { pub, ini, type Kit } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data } = await pub().from("kits").select("*").order("created_at", { ascending: false });
  const kits = (data ?? []) as Kit[];
  return <main className="w"><h1>O futebol nos detalhes.</h1><p className="mut">Os melhores kits para o PES 2014 PSP.</p>
    {kits.length ? <div className="grid">{kits.map(k => <a key={k.id} href={`/kits/${k.slug}`} className="card"><div className="im">{ini(k.name)}</div><small>{k.league}</small><b>{k.name}</b><small>{k.type === "kitpack" ? "Kitpack" : "Kit"} · {k.season}</small></a>)}</div>
      : <div className="empty"><b>Nenhum kit publicado ainda.</b><br />Rode o importador do Drive e publique os kits.</div>}</main>;
}
