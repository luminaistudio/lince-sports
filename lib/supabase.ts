import { createClient } from "@supabase/supabase-js";
export type Kit = { id:string; slug:string; name:string; league:string; season:string; type:string; author:string|null; version:string|null; description:string|null; preview_path:string|null; files:string[]; download_count:number };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const pub = () => createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export const admin = () => createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
export const ini = (n:string) => n.replace(/[^A-Za-zÀ-ú ]/g,"").split(" ").map(w=>w[0]).join("").slice(0,3);
