# supabase

Конфиг Supabase-проекта, SQL-миграции и Edge Functions.

Инициализация локально через Supabase CLI:

```bash
supabase init
supabase link --project-ref <ref>
```

Структура:

- `migrations/` — нумерованные SQL-миграции (`0001_init.sql`, ...)
- `functions/<name>/index.ts` — Edge Functions (Deno/TS)
- `config.toml` — создаётся `supabase init`
- `seed.sql` — опциональный dev-сид
