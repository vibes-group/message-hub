# Подключение проекта к реальной Supabase

Эта инструкция описывает, как подключить текущий React PWA messenger к реальному Supabase project.

## 1. Создать Supabase project

1. Открой Supabase Dashboard: https://supabase.com/dashboard
2. Создай новый project.
3. После создания открой:

```text
Project Settings -> API
```

4. Сохрани значения:

```text
Project URL
anon public key
```

Эти значения будут использоваться в instance manifest. `anon public key` можно использовать во frontend, если в базе включён RLS. `service_role` key во frontend или manifest добавлять нельзя.

## 2. Установить Supabase CLI

Если CLI ещё не установлен:

```bash
npm install -g supabase
```

Залогинься:

```bash
supabase login
```

## 3. Связать локальный проект с Supabase

В корне проекта:

```bash
cd /Users/legkiy/code-projects/mh
supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` находится в Supabase URL:

```text
https://YOUR_PROJECT_REF.supabase.co
```

## 4. Применить migrations

В проекте есть migrations:

```text
supabase/migrations/0001_initial_messenger_schema.sql
supabase/migrations/0002_profile_display_name_setup.sql
```

Примени её к remote Supabase:

```bash
supabase db push
```

Эта migration создаёт:

- `profiles`
- `conversations`
- `conversation_members`
- `messages`
- `push_subscriptions`
- индексы для основных запросов
- RLS policies
- trigger создания `profiles` после регистрации пользователя
- поле `profiles.display_name_set_at`, по которому приложение понимает, что пользователь сам выбрал отображаемое имя

## 5. Включить email/password auth

В Supabase Dashboard:

```text
Authentication -> Providers -> Email
```

Проверь:

- Email provider включён.
- Email confirmation можно оставить включённым.

Если email confirmation включён, пользователь после регистрации должен подтвердить письмо. Приложение теперь не пускает в `/chat`, пока Supabase не создаст активную session.

## 6. Настроить redirect URLs

В Supabase Dashboard:

```text
Authentication -> URL Configuration
```

Для локальной разработки:

```text
Site URL:
http://127.0.0.1:5173
```

Добавь Redirect URL:

```text
http://127.0.0.1:5173/auth/callback
```

Для production позже добавь:

```text
https://your-domain.com/auth/callback
```

## 7. Настроить Google/Gmail OAuth

В Supabase Dashboard:

```text
Authentication -> Providers -> Google
```

Нужны `Client ID` и `Client Secret` из Google Cloud Console.

В Google Cloud Console:

1. Открой https://console.cloud.google.com/
2. Создай или выбери project.
3. Открой:

```text
APIs & Services -> OAuth consent screen
```

4. Настрой consent screen.
5. Затем открой:

```text
APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
```

6. Application type: `Web application`.
7. В `Authorized redirect URIs` добавь:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

8. Скопируй `Client ID` и `Client Secret`.
9. Вставь их в Supabase Google provider settings.
10. Включи Google provider.

## 8. Создать real instance manifest

Можно отредактировать файл:

```text
public/example.instance.json
```

Или создать отдельный:

```text
public/my-supabase.instance.json
```

Пример:

```json
{
  "schemaVersion": 1,
  "provider": "supabase",
  "name": "My Real Messenger",
  "supabaseUrl": "https://YOUR_PROJECT_REF.supabase.co",
  "supabaseAnonKey": "YOUR_SUPABASE_ANON_PUBLIC_KEY",
  "functionsUrl": "https://YOUR_PROJECT_REF.supabase.co/functions/v1",
  "vapidPublicKey": "temporary-public-vapid-key",
  "supportUrl": "https://your-domain.com"
}
```

Правила безопасности:

- В manifest можно класть только публичные значения.
- Нельзя класть `service_role`.
- Нельзя класть database password.
- Нельзя класть Google OAuth secret.
- Нельзя класть private VAPID key.

## 9. Запустить приложение

```bash
npm run dev
```

Открой:

```text
http://127.0.0.1:5173
```

В поле manifest URL введи:

```text
http://127.0.0.1:5173/my-supabase.instance.json
```

или:

```text
http://127.0.0.1:5173/example.instance.json
```

## 10. Проверить auth flow

Email/password:

1. Открой `/connect`.
2. Подключи real manifest.
3. Перейди на auth экран.
4. Нажми `Need an account? Sign up`.
5. Зарегистрируй email/password.
6. Если включён email confirmation, проверь почту и подтверди регистрацию.
7. После подтверждения войди через `Sign in`.
8. После успешного входа приложение откроет `/profile/setup`.
9. Введи отображаемое имя. Оно будет записано в `profiles.display_name`.
10. Только после этого приложение пустит в `/chat`.

Google/Gmail:

1. Подключи real manifest.
2. На auth экране нажми `Continue with Google`.
3. После OAuth redirect приложение вернётся на `/auth/callback`.
4. После получения session приложение перейдёт в `/chat`.

## 11. Текущий статус интеграции

Сейчас работает:

- загрузка public instance manifest;
- создание Supabase client на основе manifest;
- email/password sign up;
- email/password sign in;
- Google OAuth;
- auth callback route;
- защита `/chat` через Supabase session;
- блокировка доступа после email sign up до подтверждения почты.
- onboarding экран `/profile/setup`;
- сохранение отображаемого имени в `profiles.display_name`.

Пока не подключено к реальной базе:

- загрузка conversations из Postgres;
- создание conversations;
- отправка messages в Postgres;
- realtime subscriptions;
- push notifications.

Следующий шаг разработки: заменить локальные mock messages в `src/features/chat/chat-page.tsx` на реальные запросы к таблицам `conversations`, `conversation_members` и `messages`.
