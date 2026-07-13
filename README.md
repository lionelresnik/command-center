# 🎯 Command Center v2

> **The AI Engineering Operating System** — run multi-agent missions, capture knowledge, manage crews, and ship faster.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lionelresnik/command-center)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-Cursor_native-purple.svg)](https://modelcontextprotocol.io)

---

## What is this?

Command Center v2 is a **local-first AI mission control dashboard** built for engineers who use AI agents (Cursor, Claude, GPT) daily. It gives you:

- A **mission system** — define a goal, assign a crew of AI roles, run them sequentially or in parallel with live streaming output
- A **knowledge base** — capture architecture decisions, connection patterns, runbooks, and assumptions from every mission run. Semantic search via OpenAI embeddings.
- **Crews & Roles** — compose teams of AI agents (Architect, Backend Engineer, QA, Security Analyst…) each with their own system prompt, tools, and behavior
- **Workspaces** — group multiple projects/repos into a workspace; run missions scoped to an entire workspace for multi-repo tasks
- An **ambient assistant `@lu`** — type `@lu status` in Cursor to see what's running right now, `@lu todo add`, `@lu search <query>` and more
- A **native MCP server** — connects directly to Cursor. Ask "what missions are active?" or "search knowledge for auth" without leaving the IDE
- **MCP integrations** — fires GitHub PRs, Jira comments, and Slack notifications on mission complete
- Full **import/export** compatible with v1 CLI YAML files

---

## Screenshots

### Dashboard — Mission Control

```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 Mission Control          Monday, Jul 13, 2026                │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ 2 Active │ │ 12 Done  │ │ 31 Knowl.│ │ $0.042 AI spend  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│                                                                  │
│  Active Missions                          Needs Attention (3)   │
│  ┌────────────────────────────────┐       ┌───────────────────┐ │
│  │ 🔄 JWT Auth Refresh Loop Fix  │       │ ⚠ Rate limiting   │ │
│  │ Architect → Backend → QA      │       │ ⚠ Events queue    │ │
│  │ ████████░░░░ 65%              │       │ ⚡ 2 open todos   │ │
│  └────────────────────────────────┘       └───────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Mission Detail — Live Streaming

```
┌───────────────────────────────────────────────────────────────────┐
│ ← JWT Auth Refresh Loop Fix  [Running]  PLAT-441  #platform-api  │
│ Fix the infinite 401 loop when JWT expires during active session  │
│ ████████████░░░░░░░░ 60%                          1,247 tokens   │
├──────────────┬────────────────────────────────────────────────────┤
│  Agents      │  ● Live Log                        ▼ 4 events     │
│              │  ┌──────────────────────────────────────────────┐  │
│  ✓ Architect │  │ 14:22:01  ▶ Starting Backend Engineer…       │  │
│  │           │  │ 14:22:02  The issue is in auth.middleware.ts  │  │
│  ⟳ Backend  │  │           The /refresh endpoint needs to be  │  │
│  │           │  │           excluded from JWT verification…    │  │
│  ○ QA        │  └──────────────────────────────────────────────┘  │
│              │                                                    │
│  Behavior    │  Backend Engineer — implement                      │
│  [Assume ✓]  │  ─────────────────────────────────────────────     │
│  [Ask me  ]  │  ## Implementation Plan                           │
│  [Async   ]  │  1. Add /refresh to auth bypass list             │
│              │  2. Handle 401 with token refresh retry logic    │
└──────────────┴────────────────────────────────────────────────────┘
```

### Knowledge Base — Grouped by Project

```
┌────────────────────────────────────────────────────────────┐
│ Knowledge Base            5 entries · 1 assumed            │
│                                      [+ Add entry]         │
├────────────────────────────────────────────────────────────┤
│ [All projects] [● Platform API (3)] [● Auth Service (2)]   │
│                                                            │
│ ● Platform API  3 entries  ⚠ 1 assumed          [▼]       │
│ ├── ✓ Postgres — main DB connection pattern   [database]  │
│ ├── ✓ events-queue — async processing         [infra]     │
│ └── ⚠ Rate limiting — per-tenant assumption   [arch] Confirm│
│                                                            │
│ ● Auth Service  2 entries                       [▼]       │
│ ├── ✓ JWT refresh loop root cause              [arch]     │
│ └── ✓ Log groups — service naming convention   [logs]     │
└────────────────────────────────────────────────────────────┘
```

### Crews — Full CRUD

```
┌─────────────────────────────────────────────────────────┐
│ Crews                              [+ New Crew]         │
├─────────────────────────────────────────────────────────┤
│ 👥 Backend Crew                              [✎] [Use] │
│ Full backend feature development             Built-in   │
│ [Architect] [Backend] [QA] [Security]                   │
│ plan → implement → test → audit → review                │
├─────────────────────────────────────────────────────────┤
│ 👥 Bug Hunter                                [✎] [Use] │
│ Rapid bug investigation — no ceremonies      Built-in   │
│ [Architect] [Backend] [QA]                              │
│ investigate → fix → verify                              │
└─────────────────────────────────────────────────────────┘
```

---

## Architecture

```
command-center/
├── app/                        # Next.js 16 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── missions/           # Mission list + detail (SSE streaming)
│   │   │   ├── projects/           # Project settings + AGENTS.md editor
│   │   │   ├── crews/              # Crew CRUD (teams of AI roles)
│   │   │   ├── roles/              # Role editor (system prompts, tools)
│   │   │   ├── knowledge/          # Knowledge base (semantic search)
│   │   │   ├── settings/           # API keys, integrations, import/export
│   │   │   └── api/                # All REST API routes
│   │   ├── components/
│   │   │   ├── layout/             # Sidebar, ThemeProvider
│   │   │   └── ui/                 # shadcn/ui components + ConfirmDialog
│   │   └── lib/
│   │       ├── db/                 # Drizzle ORM + SQLite schema + queries
│   │       ├── embeddings.ts       # OpenAI text-embedding-3-small + cosine sim
│   │       ├── git/worktrees.ts    # Git worktree management per mission role
│   │       └── mcp/client.ts       # GitHub / Jira / Slack MCP integrations
│   └── package.json
├── mcp/                        # Native MCP server for Cursor integration
│   ├── src/index.ts                # 10 MCP tools (status, missions, KB, todos…)
│   └── package.json
├── cursor/
│   ├── agents/lucius.md            # @lu ambient assistant definition
│   ├── roles/*.yaml                # v1-compatible role definitions
│   ├── teams/*.yaml                # v1-compatible team definitions
│   └── rules/*.mdc                 # Cursor rule files
└── docs/
    └── OVERVIEW.md
```

**Tech stack:**
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Database | SQLite via Drizzle ORM (local, zero-config) |
| AI | Vercel AI SDK — Anthropic Claude, OpenAI, Gemini, Ollama |
| Semantic search | OpenAI `text-embedding-3-small` + cosine similarity |
| Streaming | Server-Sent Events (SSE) |
| Integrations | GitHub REST API, Jira REST API, Slack Web API |
| Cursor native | MCP server (`@modelcontextprotocol/sdk`, stdio transport) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic or OpenAI API key

### Install & run

```bash
git clone https://github.com/lionelresnik/command-center
cd command-center/app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### First-time setup

1. **Seed the database** — visit `/api/seed` once to populate built-in roles and crews
2. **Add a project** — go to Projects → New project, set name + color
3. **Set API keys** — Settings → add your Anthropic/OpenAI key
4. **Create a mission** — Missions → New mission, pick a project + crew, set a goal
5. **Run it** — click "Run next role" and watch agents stream their output live

### Optional: semantic search

Set `OPENAI_API_KEY` in your environment (or in Settings), then click **Embed all** on the Knowledge page to enable similarity search.

### Optional: integrations

In Settings, add:
- `GITHUB_TOKEN` — creates PRs on mission complete
- `JIRA_BASE_URL` + `JIRA_EMAIL` + `JIRA_TOKEN` — posts comments to tickets
- `SLACK_BOT_TOKEN` — sends mission summary to your channel

Per-project Jira URL and Slack channel are configured in **Projects → [project] → Settings**.

---

## Key Features

### Multi-agent missions with live streaming

Each mission runs a **crew** — an ordered sequence of AI roles. Each role gets:
- Its own system prompt and tools
- The previous role's artifact as context
- A live-streamed output visible in the dashboard
- An isolated git worktree (if repo path is configured)

### Knowledge Base

Entries are automatically created from mission "assumptions" and "open questions". Each entry has:
- Type (architecture, database, runbook, logs, etc.)
- Confidence (confirmed / assumed / investigating)
- Tags
- Project grouping
- Semantic embedding for similarity search

### `@lu` Ambient Assistant

In Cursor, type `@lu` followed by:

| Command | What it does |
|---|---|
| `@lu status` | Active missions, open todos, today's log count |
| `@lu todo add <text>` | Creates a new todo |
| `@lu capture <text>` | Saves to knowledge base |
| `@lu search <query>` | Semantic search over knowledge |
| `@lu standup` | Generates today's standup from daily log |
| `@lu open` | Opens the dashboard |

### Import / Export

Export everything as:
- **JSON bundle** — full portable backup of all data
- **YAML ZIP** — v1-compatible role/team YAML files + JSON bundle

Import from:
- v2 JSON bundle
- v1 role YAML (`cursor/roles/*.yaml`)
- v1 team YAML (`cursor/teams/*.yaml`)
- ZIP containing any of the above

---

## Cursor MCP Integration

Command Center ships a **native MCP server** that connects directly to Cursor. Once configured, you can query your missions, knowledge base, and todos without leaving the IDE.

### Setup (one-time)

```bash
cd command-center/mcp
npm install
npm run build
```

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "command-center": {
      "command": "node",
      "args": ["/path/to/command-center/mcp/dist/index.js"]
    }
  }
}
```

Restart Cursor. The tools are now available in every chat.

### Available tools (17 total)

**Mission lifecycle**

| Tool | What it does |
|---|---|
| `cc_create_mission` | Create a mission — finds project + crew by name, builds task graph |
| `cc_run_mission` | Run the next agent role, returns artifact preview + questions |
| `cc_get_questions` | List unanswered agent questions across all missions |
| `cc_answer_question` | Answer an agent question from chat — saved for next role |

**Observability**

| Tool | What it does |
|---|---|
| `cc_status` | Overview: active missions, todo counts, recent activity |
| `cc_list_missions` | List missions, filter by status or project |
| `cc_get_mission` | Full detail: task graph, artifacts, Q&A |
| `cc_list_projects` | List all projects with IDs |
| `cc_get_project_context` | Full context dump for a project (KB + missions + todos) |

**Workspaces**

| Tool | What it does |
|---|---|
| `cc_list_workspaces` | List all workspaces with their member projects |
| `cc_create_workspace` | Create a workspace and optionally assign projects to it |
| `cc_open` | Auto-detect current git repo, create or open the matching project/workspace |

**Todos**

| Tool | What it does |
|---|---|
| `cc_list_todos` | List todos, filter by priority/status |
| `cc_add_todo` | Create a todo from chat |
| `cc_complete_todo` | Mark a todo done from chat |

**Knowledge**

| Tool | What it does |
|---|---|
| `cc_search_knowledge` | Search the knowledge base by keyword |
| `cc_add_knowledge` | Add a knowledge entry from chat |

**Data**

| Tool | What it does |
|---|---|
| `cc_export` | Export project data as markdown — paste into Claude.ai, ChatGPT, etc. |
| `cc_import_v1` | Migrate v1 files (`todos.md`, `daily-log/`, `task-history/`) into v2 DB |

### Full mission flow from Cursor chat

```
"create mission: fix the JWT refresh bug, use Bug Hunter crew, project Platform API"
→ cc_create_mission — mission created, task graph shown

"run it"
→ cc_run_mission — Architect role executes, artifact preview returned
→ web UI also shows live streaming progress

"what questions does the agent have?"
→ cc_get_questions — shows any blocking questions from agents

"answer [id]: the token is stored in localStorage under auth_token"
→ cc_answer_question — saved to DB, used by next role as context

"run it again"
→ cc_run_mission — Backend Engineer runs with your answer as context
```

### Example queries

> *"what's my current status?"*  
> *"search knowledge for how we handle auth"*  
> *"add a todo: investigate rate limiting, high priority"*  
> *"give me full context for Platform API"*  
> *"export Platform API project for Claude"*  
> *"dry run the v1 import"*

The MCP server reads from `~/.command-center/cc.db` — the same database the web UI uses. Changes in either place are instantly visible in the other. Agent questions can be answered from Cursor **or** the web UI — both write to the same DB.

---

## v1 Compatibility

This project is the successor to the original Command Center CLI + Cursor plugin. v1 YAML files are fully importable:

```yaml
# cursor/roles/architect.yaml  (v1 format)
id: architect
display_name: Architect
system_prompt: |
  You are the Architect...
```

```yaml
# cursor/teams/backend-team.yaml  (v1 format)
id: backend-crew
leader: architect
members:
  - role: architect
    order: 1
workflow:
  - plan
  - implement
```

Use **Settings → Import** to load these files into v2.

---

## Roadmap

- [x] Native MCP server — Cursor-native tool integration ✅
- [x] Full mission lifecycle from Cursor chat (create, run, answer questions) ✅
- [x] Export to clipboard / import from v1 files ✅
- [x] Workspaces — group repos, multi-repo missions ✅
- [x] `cc_open` — auto-detect git repo in Cursor and open/create project ✅
- [ ] Deploy to Vercel (one-click)
- [ ] Demo video
- [ ] Mobile-friendly view
- [ ] Real-time multi-user collaboration

---

## Contributing

PRs welcome. The codebase is intentionally small and self-contained — no external database, no cloud required.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit and push
4. Open a PR

---

## Author

**Lionel Resnik**
[LinkedIn](https://www.linkedin.com/in/lionel-resnik)

> *"It's not who I am underneath, but what I build that defines me."*

---

## License

[MIT](./LICENSE) — free to use, modify, and distribute.
