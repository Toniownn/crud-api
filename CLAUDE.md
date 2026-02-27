# CLAUDE.md

Full-stack e-commerce app: Express.js v5.2.1 REST API backend (`server/`) + React v19.2.0 frontend (`client/`).

Features: role-based auth (user/admin), product catalog, shopping cart, orders/checkout, admin dashboard, user profiles.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express.js v5.2.1, CommonJS modules |
| Database | PostgreSQL + Sequelize v6.37.7 |
| Frontend | React v19.2.0, Vite 7.3.1, Tailwind CSS v4.2.1, react-router-dom v7.13.1 |
| Auth | JWT (bcrypt + 24h tokens), role-based (user/admin) |

## Project Structure

```
server/          # Express.js REST API (CommonJS)
client/          # React SPA (Vite + Tailwind)
.claude/
  rules/         # Project rules (auto-loaded)
  agents/        # Custom agents for this project
  skills/        # Reusable convention docs
  commands/      # Slash commands
```

## Rules (`.claude/rules/` — auto-loaded)

| File | Topic |
|------|-------|
| `01-overview.md` | Project overview and structure |
| `02-commands.md` | Dev commands, env vars |
| `03-backend-architecture.md` | Server file layout, route groups, layers |
| `04-database.md` | Sequelize models, relationships, conventions |
| `05-authentication.md` | Auth flow, JWT, middleware patterns |
| `06-api-endpoints.md` | All REST endpoints by resource |
| `07-frontend-architecture.md` | Components, API modules, file layout |
| `08-pages-routing.md` | Pages, routes, route protection |
| `09-styling.md` | Tailwind CSS v4 conventions |
| `10-agent-strategy.md` | Parallel agent strategy, common pitfalls |
| `11-known-issues.md` | Known bugs and anti-patterns |

## Agents (`.claude/agents/`)

| Agent | Purpose |
|-------|---------|
| `backend-feature` | Creates a complete backend feature (model, controller, route, wiring, migration) |
| `frontend-feature` | Creates a complete frontend feature (API module, page, routing, nav) |
| `full-stack-feature` | Orchestrates end-to-end features across backend and frontend |
| `code-review` | Reviews code changes for project convention compliance |
| `database` | Creates/modifies Sequelize models, associations, and migration SQL |
| `migration` | Generates PostgreSQL migration statements for `server/migrations.sql` |

## Skills (`.claude/skills/`)

| Skill | Purpose |
|-------|---------|
| `create-model` | Sequelize model with `freezeTableName: true`, `timestamps: false` |
| `create-controller` | Express controller with try/catch, `req.query.id` pattern |
| `create-route` | Express route file with auth middleware |
| `create-page` | React page with Tailwind CSS v4 styling |
| `create-api` | Frontend API module using shared axios instance |
| `wire-route` | Mount a new route group in `server/index.js` |
| `react-component` | General React component (page or reusable) |

## Slash Commands (`.claude/commands/`)

| Command | Description |
|---------|-------------|
| `/create-model` | Create a Sequelize model — arg: `"ModelName: field(TYPE), ..."` |
| `/create-controller` | Create an Express controller — arg: `"name: methods"` |
| `/create-route` | Create an Express route file — arg: `"name: endpoints"` |
| `/create-page` | Create a React page component — arg: `"Name: description"` |
| `/create-api` | Create a frontend API module — arg: `"name: endpoints"` |
| `/wire-route` | Mount a route in `server/index.js` — arg: `"prefix routeFile"` |

## Workflow Rules

**Always use the matching skill, agent, or rule — never freestyle conventions.**

### 1. Creating Files → Use the Matching Skill

When creating a new file, follow the corresponding skill as the convention guide:

| Creating... | Use Skill |
|-------------|-----------|
| Sequelize model | `create-model` |
| Express controller | `create-controller` |
| Express route file | `create-route` |
| React page component | `create-page` |
| Frontend API module | `create-api` |
| Mounting a route in `server/index.js` | `wire-route` |

### 2. Building Multi-File Features → Use the Matching Agent

When a task spans multiple files, use the appropriate agent to orchestrate:

| Task Scope | Use Agent |
|------------|-----------|
| Backend-only feature (model + controller + route + migration) | `backend-feature` |
| Frontend-only feature (API module + page + routing + nav) | `frontend-feature` |
| Full-stack feature (backend + frontend end-to-end) | `full-stack-feature` |
| Database model or association changes | `database` |
| SQL migration generation | `migration` |
| Reviewing code for convention compliance | `code-review` |

### 3. Editing Existing Files → Consult the Relevant Rules

When modifying existing files, consult the matching rule files to maintain conventions:

| Editing... | Consult Rule |
|------------|-------------|
| Backend files | `03-backend-architecture`, `05-authentication` |
| Database models | `04-database` |
| API endpoints | `06-api-endpoints` |
| Frontend components/pages | `07-frontend-architecture`, `08-pages-routing` |
| Styling | `09-styling` |
| Multi-agent work | `10-agent-strategy` |

### 4. Post-Feature Review

**Always** run the `code-review` agent after completing any feature to verify convention compliance.
