# Rules for AI agents

This repository is **public**. Treat every commit as visible.

## Never commit

- Real names, emails, phone numbers, messenger handles
- Absolute home paths (`/home/<user>/...`, `C:\Users\<name>\...`) — use `~` or relative
- Real hostnames / IPs of prod, dev, or test VPS — use placeholders (`your-host.example.com`, `<server-ip>`)
- `.env` contents, tokens, keys, passwords, SSH keys — even as "examples"
- Supabase `service_role` key, JWT secret, FCM server key
- Per-user secrets (`recovery_key`, `user_master_key`, `room_key`) — never exist server-side; never include in logs, fixtures, or test data
- Output of `whoami`, `hostname`, `id`, `env`
- Personal asides like "(me)", "on my laptop"

## Doc style

- README and comments — signal only. Don't explain the obvious, don't apologise, don't pre-empt unasked questions.
- No planning `*.md` files in the repo. Plans live in PR descriptions or tickets.
- Delete a feature's planning doc once it ships.
- Before PR: grep for "not yet" / "TODO" on shipped features and refresh.

## Security (E2EE)

- Plaintext messages and files never reach Supabase, app logs, or push payloads. Exception: opt-in `plaintext_preview` for push is forwarded, never persisted, never logged.
- `room_key`, `user_master_key`, `recovery_key` exist only on the client. Backend and Edge Functions see ciphertext only.
- Supabase `service_role` key is server-side only (push relay, Edge Functions). The browser uses `anon` exclusively.
- RLS enabled on every `public` table. Any `security definer` RPC checks `auth.uid()` / membership explicitly.

## Env naming

`APP_*` for app settings (`APP_ADDR`, `APP_WEB_DIR`). `<DOMAIN>_*` for subsystems with ≥2 vars (`SUPABASE_*`, `FCM_*`, `DB_*`). Infra-provided values (`IMAGE_TAG`) stay unprefixed.

Required vars have no defaults and crash on startup. Secrets only via env, never as flags, never logged.

## Git

- Conventional commits (`feat:`, `fix:`, `chore(supabase):`, `refactor:`, ...).
- No `--amend` on published commits, no `--force-push` to `master`.
