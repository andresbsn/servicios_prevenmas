# Backend Seguridad Prevenmas

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Configuración
1. Copiar `.env.example` a `.env` y completar valores.
2. Crear base de datos `seguridad_prevenmas`:

```sql
\i db/create_db.sql
```
3. Ejecutar migración inicial:

```sql
-- psql
\i db/migrations/001_init.sql
```

4. Crear usuario admin:

```sql
\i db/seed/001_admin.sql
```

Usuario admin creado:
- email: `admin@prevenmas.local`
- password: `Admin123!`

## Ejecutar
```bash
npm install
npm run dev
```

## Endpoints principales
- `POST /api/auth/login`
- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `GET /api/catalogo`
- `POST /api/catalogo`
- `GET /api/servicios`
- `POST /api/servicios`
- `GET /api/facturas`
- `POST /api/facturas`
- `POST /api/jobs/expiry-notify` (admin)
- `GET /api/jobs/logs` (admin)

## Emails
- Configurar SMTP en `.env`.
- El job corre según `CRON_SCHEDULE`.
- Para ejecutar manual: `POST /api/jobs/expiry-notify`.
