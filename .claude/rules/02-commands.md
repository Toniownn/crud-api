## Dev Commands

- Start backend: `cd server && node index.js` (port from `.env`, default 3000)
- Start backend (auto-reload): `cd server && npx nodemon index.js`
- Start frontend: `cd client && npm run dev` (Vite dev server, proxies `/api` to backend)
- Build frontend: `cd client && npm run build`
- Install backend deps: `cd server && npm install`
- Install frontend deps: `cd client && npm install`
- Run migrations: `psql -U <username> -d <dbname> -f server/migrations.sql`
- No test suite configured — `npm test` is a placeholder in both.

## Environment Variables (`server/.env`)

`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `DIALECT`, `JWT_SECRET`, `PORT`, `OPENAI_API_KEY`
