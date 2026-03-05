# Atlas - Personal Reflection Copilot

Atlas is a deployable full-stack app for personal journaling and reflection. It combines:
- Next.js (TypeScript) frontend (App Router)
- Python serverless API routes under `/api` (Vercel runtime)
- Supabase Postgres + `pgvector` for storage and retrieval
- OpenAI for embeddings and answer generation

## Features

1. Journal capture and browsing
- Create journal entries with optional title.
- View latest 50 entries with preview text.

2. RAG Q&A with citations
- Ask reflective questions about your journal history.
- Backend performs hybrid retrieval:
  - Vector similarity over embedded chunks (`pgvector`, cosine distance)
  - Keyword boosting via `ILIKE`
- Returns answer plus explicit citations:
  - entry id, document id, date, and snippet.

3. Weekly reflection
- Input a week start date.
- Generates summary, themes, and exactly 2 small experiments.

4. Safety guardrail
- Self-harm intent patterns are checked before coaching.
- If flagged, API returns crisis-support response and no citations.
- UI renders `SafetyBanner`.

## Project Structure

- `app/` - Next.js pages (`/`, `/journal`, `/ask`, `/weekly`)
- `app/components/` - `EntryEditor`, `EntryList`, `AskBox`, `CitationCard`, `SafetyBanner`
- `api/` - Python serverless endpoints
  - `health.py`, `entries_create.py`, `entries_list.py`, `ask.py`, `weekly_reflection.py`
- `rag/` - retrieval and prompt logic
  - `chunking.py`, `retrieval.py`, `prompts.py`, `safety.py`
- `db/` - DB connection and schema
  - `supabase.py`, `schema.sql`
- `providers/` - OpenAI abstraction
  - `embeddings_provider.py`, `llm_provider.py`
- `tests/` - unit tests for chunking/retrieval query-building

## RAG Pipeline

1. Entry ingestion (`POST /api/entries_create`):
- Save full entry in `entries`.
- Chunk entry text (`rag/chunking.py`).
- Embed chunks using `text-embedding-3-small`.
- Store chunks in `documents`, vectors in `embeddings` (`vector(1536)`).

2. Question answering (`POST /api/ask`):
- Safety check first.
- Embed question.
- Retrieve top chunks with hybrid search:
  - Vector query ordered by cosine distance.
  - Keyword query using `ILIKE` tokens from question.
  - Merge unique documents, rank by score.
- Call LLM with citation-constrained prompt and retrieved context.
- Return answer + citations + debug count.

## Safety Guardrails

`rag/safety.py` detects high-risk phrases (for example: “kill myself”, “suicide”, “want to die”).
If detected:
- No coaching is provided.
- API responds with crisis-support guidance.
- UI displays `SafetyBanner` to emphasize support resources.

## Database Setup (Supabase)

Run SQL from `db/schema.sql` in your Supabase SQL editor.

It creates:
- extension: `vector`
- tables: `entries`, `documents`, `embeddings`
- indexes on `user_id`, `created_at`, and vector index for embeddings

For MVP auth, pass `X-User-Id` in API request headers.

## Environment Variables

Copy `.env.example` to `.env.local` (Next.js) and configure:

- `OPENAI_API_KEY`
- `SUPABASE_DB_HOST`
- `SUPABASE_DB_PORT`
- `SUPABASE_DB_NAME`
- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`

## Local Development

1. Install JS deps:
```bash
npm install
```

2. Install Python deps:
```bash
pip install -r requirements.txt
```

3. Run frontend:
```bash
npm run dev
```

4. Run tests:
```bash
pytest -q
```

Notes:
- Python routes are designed for Vercel serverless deployment under `/api`.
- For full local end-to-end parity, use `vercel dev`.

## API Endpoints

- `GET /api/health` -> `{ ok: true }`
- `POST /api/entries_create`
  - body: `{ title?, content }`
  - header: `X-User-Id` required
- `GET /api/entries_list`
  - header: `X-User-Id` required
- `POST /api/ask`
  - body: `{ question, dateRange? }`
  - header: `X-User-Id` required
- `POST /api/weekly_reflection`
  - body: `{ weekStartISO }`
  - header: `X-User-Id` required

## Deploy to Vercel

1. Push repo to Git provider.
2. Import project in Vercel.
3. Add all environment variables in Vercel project settings.
4. Ensure Supabase schema is applied.
5. Deploy.

`vercel.json` config sets Python runtime for `api/*.py`.
