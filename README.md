# Porua AI

Porua AI is an AI-powered PDF workspace. Upload a PDF, and the app embeds its
contents into a vector store so you can select text in a rich editor and ask the
AI for context-aware answers drawn from the document. Answers are generated with
Google Gemini and can be saved as notes.

## Features

- 📄 **PDF upload & ingestion** — PDFs are parsed, chunked, embedded, and stored
  for semantic retrieval.
- 🔎 **Semantic search over your document** — selected text is matched against
  the PDF's embeddings (RAG) before answering.
- 🤖 **AI answers** — Google Gemini generates HTML-formatted answers grounded in
  the retrieved passages.
- 📝 **Rich text editor** — a TipTap-based editor with formatting, headings,
  lists, alignment, and highlighting.
- 💾 **Notes** — save the editor contents per file. (Need to update the note writing way to notion style interface)
- 🔐 **Authentication** — user sign-in/sign-up handled by Clerk.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + React 18 |
| Backend / DB | [Convex](https://convex.dev) (data, file storage, actions, vector index) |
| Auth | [Clerk](https://clerk.com) |
| AI / Embeddings | [Google Gemini](https://ai.google.dev) via [LangChain](https://js.langchain.com) (`gemini-embedding-001`, `gemini-2.0-flash`) |
| Editor | [TipTap](https://tiptap.dev) |
| Styling | Tailwind CSS, DaisyUI, Radix UI, Sass |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) application
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root (it is git-ignored):

```env
# Convex (populated automatically by `npx convex dev`)
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini (client-side chat model)
NEXT_PUBLIC_GEMINI_API_KEY=
```

You also need to set the Gemini key on the Convex deployment so server-side
actions (embeddings) can authenticate:

```bash
npx convex env set GOOGLE_API_KEY YOUR_GEMINI_API_KEY
```

> **Note:** The client chat model and the Convex embedding actions each need the
> Gemini key. `NEXT_PUBLIC_GEMINI_API_KEY` is read in the browser; `GOOGLE_API_KEY`
> is read inside Convex actions.

### 3. Start Convex

In a separate terminal, run the Convex dev server (this also provisions your
deployment and fills in the `CONVEX_*` variables):

```bash
npx convex dev
```

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How It Works

1. **Upload** — a PDF is stored via Convex file storage; the file entry is saved
   to the `pdfFiles` table (`convex/pdfStorage.js`).
2. **Ingest** — `/api/pdf-loader` extracts and splits the text, then the
   `myAction:ingest` Convex action embeds the chunks with Gemini and writes them
   to the `documents` table's vector index (`convex/myAction.js`).
3. **Ask** — in the workspace editor, selecting text and clicking the 🤖 button
   calls the `myAction:search` action, which embeds the query, runs a similarity
   search over the document's vectors, and returns the top matches.
4. **Answer** — the retrieved passages plus the question are sent to
   `gemini-2.0-flash` (`configs/AIMODEL.js`), and the HTML answer is inserted
   into the editor and saved as a note.

## Project Structure

```
app/                    # Next.js App Router pages & components
  dashboard/            # File list, upload dialog
  workspace/            # PDF viewer + editor
  api/pdf-loader/       # PDF text extraction endpoint
configs/AIMODEL.js      # Gemini chat model configuration
convex/                 # Convex schema, actions, mutations
  schema.js             # Tables + 3072-dim vector index
  myAction.js           # ingest + search (RAG) actions
  pdfStorage.js         # file upload / storage helpers
  notes.js              # notes mutations
middleware.js           # Clerk route protection
```

## Security Note

Never commit API keys to source control. Google automatically revokes keys that
are detected in public repositories. Keep all secrets in `.env.local` (git-ignored)
and in the Convex environment, and rotate any key that has been exposed.

## Deploy

Deploy the frontend on [Vercel](https://vercel.com/new) and run `npx convex deploy`
for the production Convex deployment. Remember to set the same environment
variables (Clerk, Convex, and `GOOGLE_API_KEY`) in your hosting and Convex
production environments.
