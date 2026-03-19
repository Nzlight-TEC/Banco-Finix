# Banco Finix - Aplicação Bancária

## 🚀 Início Rápido (SQLite Local + Neon Postgres)

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Modo Local (SQLite)**:
   - Sem config extra
   - Demo user auto-criado

3. **Modo Neon Postgres**:
   - Execute `backend/migrations/schema.sql` no Neon Console (console.neon.tech)
   - Crie `.env` com sua DATABASE_URL:
     ```
     DATABASE_URL=postgresql://neondb_owner:npg_lsAjznoRk30N@ep-dawn-bird-anrtle68-pooler.c-6.us-east-1.aws.neon.tech/Banco%20Finix?sslmode=require&channel_binding=require
     ```
   - Schema inclui demo user (`user@test.com` / `123456`)

4. **Rodar servidor**:
   ```bash
   npm start
   ```
   Acesse: http://localhost:3000/principal.html
   Teste: http://localhost:3000/api/health

## 🔐 Demo
- **Login**: user@test.com / 123456
- **Health**: /api/health
- **Register**: POST /api/register {email, password, name}

## 📁 Estrutura Backend Modular
```
backend/
├── config/database.js     # Auto-detect: PG (DATABASE_URL) ou SQLite local
├── routes/               # Rotas separadas
│   ├── auth.js          # login/register com bcrypt
│   └── health.js
├── middleware/auth.js    # JWT futuro
├── migrations/schema.sql # Postgres schema (execute no Neon)
└── server.js            # App principal
```

## 🌐 Deploy (Render/Heroku/Vercel)
1. Set `DATABASE_URL` env var
2. `npm install`
3. `npm start`

## 📊 Próximos
- Endpoints banking (saque/depósito/transfer)
- JWT middleware
- Frontend SPA protegido

✅ Neon integrado! Schema pronto no seu DB.

