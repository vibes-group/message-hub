# supabase

Конфиг Supabase-проекта и SQL-миграции.

Инициализация локально через Supabase CLI:

```bash
supabase init
supabase link --project-ref <ref>
```

Структура:

- `migrations/` — нумерованные SQL-миграции (`0001_init.sql`, ...)
- `config.toml` — создаётся `supabase init`
- `seed.sql` — опциональный dev-сид
