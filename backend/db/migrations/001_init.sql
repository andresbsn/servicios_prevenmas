CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS service_prevenmas;
SET search_path TO service_prevenmas;

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  razon_social VARCHAR(150) NOT NULL,
  cuit VARCHAR(30) NOT NULL,
  email VARCHAR(120),
  telefono VARCHAR(60),
  direccion VARCHAR(200),
  observaciones TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  fecha_alta DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_cuit ON clientes(cuit);
CREATE INDEX IF NOT EXISTS idx_clientes_razon_social ON clientes(razon_social);

CREATE TABLE IF NOT EXISTS servicios_catalogo (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(200) NOT NULL,
  importe_sugerido NUMERIC(12,2),
  observacion TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicios_cliente (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  servicio_id INTEGER NOT NULL REFERENCES servicios_catalogo(id),
  fecha_servicio DATE NOT NULL,
  proximo_vencimiento DATE NOT NULL,
  importe NUMERIC(12,2) NOT NULL,
  observacion TEXT,
  estado VARCHAR(20) NOT NULL DEFAULT 'vigente',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_servicios_cliente_cliente ON servicios_cliente(cliente_id);
CREATE INDEX IF NOT EXISTS idx_servicios_cliente_vencimiento ON servicios_cliente(proximo_vencimiento);

CREATE TABLE IF NOT EXISTS servicios_cliente_historial (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  servicio_id INTEGER NOT NULL REFERENCES servicios_catalogo(id),
  fecha_servicio DATE NOT NULL,
  proximo_vencimiento DATE NOT NULL,
  importe NUMERIC(12,2) NOT NULL,
  observacion TEXT,
  source_servicio_cliente_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_servicios_hist_cliente ON servicios_cliente_historial(cliente_id);

CREATE TABLE IF NOT EXISTS facturas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  importe NUMERIC(12,2) NOT NULL,
  fecha_emision DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  fecha_cancelacion DATE,
  observacion TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);

CREATE TABLE IF NOT EXISTS job_logs (
  id SERIAL PRIMARY KEY,
  run_at TIMESTAMP NOT NULL,
  expiries_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL,
  error TEXT
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'operador',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
