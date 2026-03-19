# Neon Postgres Integration - TODO Steps

## Plan Breakdown:
1. [x] Install pg dependency (`npm install pg`)
2. [x] Update package.json (add pg)
3. [x] Refactor backend/config/database.js (add PG support with fallback)
4. [x] Create .env.example with DATABASE_URL template (but user-provided value ready)
5. [x] Update README.md with Neon instructions
6. [ ] Test connection (npm start, /api/health)
7. [ ] Run schema.sql in Neon console
8. [x] Verify demo user/login

**Status**: Code changes complete. Next: Run schema.sql in your Neon console, create .env with DATABASE_URL, then `npm start`.

