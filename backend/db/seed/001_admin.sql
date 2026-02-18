CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- importante: incluir public para que encuentre las funciones de la extensión
SET search_path TO service_prevenmas, public;

INSERT INTO service_prevenmas.usuarios (nombre, email, password_hash, rol)
VALUES (
  'Administrador',
  'admin@prevenmas.local',
  crypt('Admin123!', gen_salt('bf')),
  'admin'
);