# message-hub

Чат с end-to-end шифрованием. Сейчас каркас для будущего продукта.

Структура:

- `backend/` — Go HTTP-сервер (`module message-hub/backend`). На каркасе ещё и отдаёт статический фронт; долгосрочно — push relay и серверные хелперы.
- `frontend/` — веб-клиент. Пока plain HTML/CSS, переедет на Vite + TS.
- `supabase/` — конфиг Supabase-проекта, SQL-миграции, Edge Functions.
