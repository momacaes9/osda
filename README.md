# 🌱 OSDA — One Step Drives All

**Operação Sem Danos Ambientais** · *One Step Drives All*

🌐 **Live:** https://osda-ai.vercel.app · API: https://backend-zeta-lac-99.vercel.app/api/health · 🔎 AI status: https://backend-zeta-lac-99.vercel.app/api/ai/status

📸 [Instagram](https://www.instagram.com/one_step_drives_all/) · 💼 [LinkedIn](https://www.linkedin.com/company/osdaai/)

🏆 **GYC 2026 — Top 16 · Bronze** · 🌍 **Global Innovation Challenge — Top 10 world, #2 LATAM** · 🎤 **PFF25 — LATAM finalist** · 📚 **ESPM × Mizzou Academy — Outstanding award**

🙋 **Volunteers wanted** (high schoolers worldwide, free, until Feb 2027): [apply here](https://docs.google.com/forms/d/e/1FAIpQLSc-qMv-SE1B3E_nBGBgKBMxmzSVJX7xLwxTFJZlWeV5WkBvPw/viewform) · ✍️ [Write a blog post](https://forms.gle/GTza8ibVgH9oCC9H9) · 📧 osda.ambientalglobal@gmail.com · monicagrenadier@gmail.com

OSDA personalizes sustainability tips based on your lifestyle. Answer a 10-question assessment, get a score from 0 to 100, your level (Beginner → Expert), personalized tips, an AI analysis, and chat with a sustainability assistant — in **English and Portuguese**.

> 🇧🇷 [Versão em português abaixo](#-português)


## Team

| | Name | Role | University (Class of 2030) |
| --- | --- | --- | --- |
| <img src="frontend/public/team/julia.jpg" width="64"> | [Júlia Genzini](https://www.linkedin.com/in/juliagenzini/) | Systems and Ideation Manager | Purdue — Industrial Engineering |
| <img src="frontend/public/team/laura.jpg" width="64"> | [Laura Placido](https://www.linkedin.com/in/laura-franchini-/) | Finances and Business Manager | USC — Systems Engineering |
| <img src="frontend/public/team/monica.jpg" width="64"> | [Monica Macaes](https://www.linkedin.com/in/monicamacaes/) | Development and Marketing Director | UNC Chapel Hill — Data Science & Economics |
| <img src="frontend/public/team/priscila.jpg" width="64"> | [Priscila Gerhardt](https://www.linkedin.com/in/priscilagerhardt/) | Processes and Computer Manager | Georgia Tech — Computer Science |

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
- **CO2 footprint calculator** — part 2 of the quiz: car km & fuel, public transport, flights, electricity (kWh), cooking gas, meat meals, clothes and electronics, with a live estimate in t CO2e/year, breakdown by category, comparison with Brazil / world / 2030 target and the money you could save. Emission factors: DEFRA/DESNZ 2024, Brazil grid (MCTI), Poore & Nemecek 2018 (`backend/src/data/carbon.ts`, mirrored in `frontend/src/data/carbon.ts` — check with `npm run check:carbon`).
- **Consumer profile** — The Commuter, Foodie, Homebody, Shopper, Globetrotter, Balanced or Guardian, based on where your footprint concentrates.
- **Light & dark themes** — night forest (dark) and recycled paper + sage (light), saved per browser.
- **Recognition, videos, research results, market comparison, UN SDGs (11–14), team, coming next and contact** on the home page.
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

## Google Search & Google Business

The site ships with SEO basics: descriptive title/description per page, canonical URL, Open Graph/Twitter cards, `robots.txt`, `sitemap.xml` and **schema.org Organization** structured data (founders, awards, email, social profiles).

To appear on Google (needs the team's Google account):
1. **Google Search Console** → add property `https://osda-ai.vercel.app` → verify with the *HTML tag* method (send us the `google-site-verification` code and we add it to `frontend/index.html`) → submit `sitemap.xml` → *Request indexing*.
2. **Google Business Profile** → business.google.com → create "OSDA — One Step Drives All", category *Environmental organization*, as a *service-area business* (São Paulo), website `https://osda-ai.vercel.app`, email `osda.ambientalglobal@gmail.com`. Google verifies it by phone/video.

## Deploy on Vercel

Production runs on two Vercel projects connected to this GitHub repo — **every push to `main` deploys automatically**:

| Project | Root directory | URL |
| --- | --- | --- |
| `frontend` (Vite) | `frontend` | https://osda-ai.vercel.app |
| `backend` (NestJS) | `backend` | https://backend-zeta-lac-99.vercel.app/api |

- **frontend** env: `VITE_API_URL=https://backend-zeta-lac-99.vercel.app/api`. `frontend/vercel.json` rewrites deep links to `index.html`.
- **backend** env: `DATABASE_URL` (Supabase transaction pooler, port 6543), `DATABASE_SCHEMA=osda`, `DATABASE_SSL=true`, `JWT_SECRET`, `CORS_ORIGIN` (frontend URLs), `VERCEL_FORCE_NO_BUILD_CACHE=1`, plus optional AI keys.
- Database: free **Supabase** project with a private `osda` schema (not exposed by the Supabase public REST API). Tables are created automatically on first start.
- Alternative single-project setup: the root `vercel.json` uses **Vercel Services** (Vite at `/`, API at `/api`) — https://osda-tau.vercel.app now redirects to https://osda-ai.vercel.app (one canonical address for search engines).

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
No ar em **https://osda-ai.vercel.app** (frontend) e **https://backend-zeta-lac-99.vercel.app/api** (API), dois projetos da Vercel ligados ao GitHub: cada push na `main` publica sozinho. Banco: Supabase grátis (schema privado `osda`).

---

“Built with 💚 by the OSDA team — for a more sustainable world.”
