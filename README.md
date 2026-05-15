# message-hub

Чат с end-to-end шифрованием. Сейчас каркас для будущего продукта.

Доступ проектируется как invite-only: публичной регистрации не будет, приглашать
смогут пользователи, которые уже имеют доступ.

Структура:

- `backend/` — Go HTTP-сервер для trusted API, push relay и серверных хелперов.
- `frontend/` — Vite + React + TS. Собирается в static artifact и отдаётся Caddy.
- `supabase/` — конфиг Supabase-проекта и SQL-миграции.
