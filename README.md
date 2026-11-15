# 🌱 OSDA — One Step Drives All

**Operação Sem Danos Ambientais** · *Um Passo Impulsiona Tudo*

OSDA personalizes sustainability tips based on your lifestyle. Answer a 10-question assessment, get a score from 0 to 100, your level (Beginner → Expert), personalized tips, an AI analysis, and chat with a sustainability assistant — in **English and Portuguese**.

> 🇧🇷 [Versão em português abaixo](#-português)

## Architecture

```
User (browser) ⇄ Front-End (Vite + React + TypeScript) ⇄ Backend API (NestJS + TypeScript) ⇄ PostgreSQL
                                                               ⇅
                                                         Vercel AI SDK
                                                               ⇅
                                  OpenAI GPT-4.1-nano · or free APIs (Groq, Gemini, OpenRouter) · or Vercel AI Gateway
```

| Part | Stack | Folder |
| --- | --- | --- |
| Front-end | Vite, React 19, TypeScript, React Router | `frontend/` |
| Backend API | NestJS 12, TypeORM, PostgreSQL | `backend/` |
| AI | Vercel AI SDK (`ai` + `@ai-sdk/openai`) | `backend/src/modules/ai` |
| Auth | bcrypt hashed passwords, JWT access + refresh tokens, Passport guards, session table | `backend/src/modules/authentication`, `backend/src/auth` |

### Features
- **Questionnaire** — 10 questions (transport, energy, e-waste, waste, food, reuse, consumption, local products, plastic, awareness), stored in PostgreSQL (`questionnaires.answers` as `jsonb`, plus score, level and language).
- **Bilingual** — every question, option, tip and UI text exists in EN and PT. Switch any time with the EN/PT toggle; the AI answers in the selected language and each analysis is cached per language.
- **AI chatbot** — floating chat on every page + `/chat` page.
- **AI questionnaire analysis** — personalized recommendations from your answers.
- **Authentication** — register / login / logout / refresh, per-user history at `/dashboard`.
- **Works without an AI key** — a built-in offline assistant answers until you add a key.

### API
| Method | Route | Auth |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh` | — |
| POST | `/api/auth/logout` | JWT |
| GET | `/api/users/me` · PATCH `/api/users/me/language` | JWT |
| GET | `/api/questionnaire/forms` | — |
| POST | `/api/questionnaire` | optional |
| GET | `/api/questionnaire/mine` | JWT |
| GET | `/api/questionnaire/:id` | owner (or public if anonymous) |
| POST | `/api/ai/generate-chat-message` | — |
| POST | `/api/ai/generate-questionnaire-text-response` | owner |
| POST | `/api/ai/generate-text` | — |
| GET | `/api/ai/status`, `/api/health` | — |

## Run locally

Requirements: Node 22+, Docker (for PostgreSQL).

```bash
npm run install:all
npm run db:up                         # PostgreSQL on localhost:5432
cp backend/.env.example backend/.env  # then set JWT_SECRET (openssl rand -hex 32) and an AI key
npm run dev:api                       # http://localhost:3000/api
npm run dev:web                       # http://localhost:5173
```

### AI models with automatic fallback
The API keeps an ordered chain of models and **switches to the next one automatically** when a provider fails, hits a rate limit or runs out of credits (that provider is skipped for 15 minutes). Works with **zero keys**: the free, keyless [Pollinations](https://pollinations.ai) model is always the last online fallback, then a built-in offline assistant.

`AI_API_KEY / OpenAI` → `Groq` → `Gemini` → `OpenRouter` → `Vercel AI Gateway` → `Pollinations (free, no key)` → `offline`

| Provider | Env var | Default models | Cost |
| --- | --- | --- | --- |
| OpenAI (ChatGPT) | `AI_API_KEY` (+ `AI_BASE_URL` for any compatible API) | `gpt-4.1-nano` | paid |
| Groq | `GROQ_API_KEY` | `llama-3.3-70b-versatile`, `llama-3.1-8b-instant` | free tier |
| Google Gemini | `GEMINI_API_KEY` | `gemini-2.5-flash`, `gemini-2.5-flash-lite` | free tier |
| OpenRouter | `OPENROUTER_API_KEY` | `meta-llama/llama-3.3-70b-instruct:free`, `openrouter/free` | free models |
| Vercel AI Gateway | `AI_GATEWAY_API_KEY` | `openai/gpt-4.1-nano` | free credits (card required) |
| Pollinations | — | `openai` (GPT-OSS 20B) | free, no key |

See which model answered last: `GET /api/ai/status`.

## Deploy on Vercel

`vercel.json` uses **Vercel Services**: one project, the Vite app at `/` and the NestJS API at `/api`.

1. Import this GitHub repo in Vercel (root directory = repo root).
2. Add a Postgres database from the Vercel Marketplace (Neon or Supabase) — it sets `DATABASE_URL`. Also set `DATABASE_SSL=true`.
3. Add `JWT_SECRET`. AI works with no keys (free Pollinations); optionally add `GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENROUTER_API_KEY` or `AI_API_KEY` for more models.
4. Deploy. Tables are created automatically on first start (`DATABASE_SYNCHRONIZE=true`).

---

## 🇧🇷 Português

A OSDA personaliza dicas de sustentabilidade com base no seu estilo de vida: responda 10 perguntas, receba uma pontuação de 0 a 100, seu nível (Iniciante → Expert), dicas personalizadas, uma análise feita por IA e converse com um assistente de sustentabilidade — em **inglês e português**.

- **Front-end:** Vite + React + TypeScript (`frontend/`)
- **Backend:** API própria em NestJS + TypeScript com PostgreSQL (`backend/`)
- **IA:** Vercel AI SDK com OpenAI GPT-4.1-nano ou APIs gratuitas (Groq, Gemini, OpenRouter)
- **Autenticação própria:** senhas com hash bcrypt, tokens JWT, guards
- **Questionário armazenado** no Postgres (respostas em `jsonb`, pontuação, nível e idioma)

### Rodar localmente
```bash
npm run install:all
npm run db:up
cp backend/.env.example backend/.env   # defina JWT_SECRET e uma chave de IA
npm run dev:api
npm run dev:web                         # abra http://localhost:5173
```
Sem nenhuma chave, a IA usa a Pollinations (grátis, sem cadastro). Adicione chaves grátis do Groq/Gemini/OpenRouter: quando um modelo fica sem créditos ou cai, o próximo assume automaticamente.

### Deploy na Vercel
Importe o repositório na Vercel, adicione um Postgres pelo Marketplace (Neon/Supabase), defina `JWT_SECRET`, `DATABASE_SSL=true` e a chave de IA, e faça o deploy.

---

“Built with 💚 by the OSDA team — for a more sustainable world.”
