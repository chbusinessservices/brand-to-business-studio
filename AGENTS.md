<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Business details, booking URL, and all marketing copy live in `src/lib/site.ts`; components read from it so details change in one place.
- Inquiry validation and spam/rate-limit rules live in `src/lib/inquiry-schema.ts`, shared by the form and the `submitInquiry` server function; tests in `src/test/inquiry-rules.test.ts` cover them.
- Inquiries are inserted only by the `submitInquiry` server function (service client, after validation); the public has no insert/select access, so never add anon policies to `inquiries`.
- Owner access comes only from `public.user_roles` (`admin`), granted automatically by a trigger when a confirmed account's email is in `public.owner_allowlist`; never grant roles from client code or user metadata.
- The owner dashboard reads/updates inquiries with the browser client under RLS (`has_role(auth.uid(),'admin')`); keep it under `src/routes/_authenticated/`.
- Logos are CDN asset pointers in `src/assets/*.asset.json`; use `Logo`/`Monogram` from `src/components/site/Logo.tsx` (onLight vs onDark variants) rather than raw images.
