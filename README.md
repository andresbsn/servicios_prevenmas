# Seguridad Prevenmas (Migración Clarion)

## Stack
- Frontend: React + Vite (JavaScript)
- Backend: Node.js + Express
- DB: PostgreSQL
- Emails: SMTP (nodemailer)
- Job diario: node-cron

## Estructura
```
/backend
  /src (routes, controllers, services, repositories, validations, jobs)
  /db/migrations/001_init.sql
/frontend
  /src (pages, components)
```

## Backend
1. Copiar `backend/.env.example` a `backend/.env`.
2. Crear base de datos `seguridad_prevenmas`.
3. Ejecutar migración inicial:

```sql
\i backend/db/migrations/001_init.sql
```

4. Ejecutar:
```bash
cd backend
npm install
npm run dev
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables de entorno (backend)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `NOTIFY_EMAIL_TO`
- `TIMEZONE`, `CRON_SCHEDULE`
- `SEND_TO_CLIENT` (true/false)

## Job de vencimientos
- Se ejecuta automáticamente según `CRON_SCHEDULE`.
- Ejecutar manual: `POST /api/jobs/expiry-notify` (rol admin).

## Endpoints
- Auth: `POST /api/auth/login`
- Clientes: `GET/POST/PUT/DELETE /api/clientes`
- Catálogo: `GET/POST/PUT/DELETE /api/catalogo`
- Servicios: `GET/POST/PUT/DELETE /api/servicios`
- Facturas: `GET/POST/PUT/DELETE /api/facturas`
- Jobs: `POST /api/jobs/expiry-notify`, `GET /api/jobs/logs`

## Nota
Crear el primer usuario en la tabla `usuarios` (password encriptado). Podés generar el hash usando `bcryptjs` en un script simple o desde un cliente SQL.
