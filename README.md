# Lince Sports
1. Crie um projeto no Supabase e rode `supabase/schema.sql` no SQL Editor.
2. Copie `.env.example` para `.env.local` e preencha as chaves.
3. `npm install` e `npm run dev`.
4. Importar o Drive: crie uma conta de serviço do Google com a Drive API, compartilhe a pasta com o e-mail dela e rode `npm run import:drive`.
5. Publique os kits: `update kits set published = true where slug = '...';`
6. Admin: `insert into admins(user_id) values ('<id do usuário no Auth>');`

Ao clicar em Baixar, `/api/download/<slug>` monta o .zip com os arquivos do kit e o navegador baixa na hora. Cada visitante conta 1 download por kit por dia.
Ainda não incluído: painel admin visual, login, favoritos, filtros, kitpacks, sitemap. Não foi testado com Supabase real.
