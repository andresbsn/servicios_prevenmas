--
-- PostgreSQL database dump
--

\restrict GSET964thpYZoW457vsEq6kCWdXG1p3YXICWnThN0y5fm9sTGdfv9WrWu3sC9mq

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente DROP CONSTRAINT IF EXISTS servicios_cliente_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente_historial DROP CONSTRAINT IF EXISTS servicios_cliente_historial_servicio_id_fkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente_historial DROP CONSTRAINT IF EXISTS servicios_cliente_historial_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente DROP CONSTRAINT IF EXISTS servicios_cliente_cliente_id_fkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.facturas DROP CONSTRAINT IF EXISTS facturas_cliente_id_fkey;
DROP INDEX IF EXISTS service_prevenmas.idx_servicios_hist_cliente;
DROP INDEX IF EXISTS service_prevenmas.idx_servicios_cliente_vencimiento;
DROP INDEX IF EXISTS service_prevenmas.idx_servicios_cliente_cliente;
DROP INDEX IF EXISTS service_prevenmas.idx_facturas_estado;
DROP INDEX IF EXISTS service_prevenmas.idx_facturas_cliente;
DROP INDEX IF EXISTS service_prevenmas.idx_clientes_razon_social;
DROP INDEX IF EXISTS service_prevenmas.idx_clientes_cuit;
ALTER TABLE IF EXISTS ONLY service_prevenmas.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente DROP CONSTRAINT IF EXISTS servicios_cliente_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_cliente_historial DROP CONSTRAINT IF EXISTS servicios_cliente_historial_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_catalogo DROP CONSTRAINT IF EXISTS servicios_catalogo_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.servicios_catalogo DROP CONSTRAINT IF EXISTS servicios_catalogo_codigo_key;
ALTER TABLE IF EXISTS ONLY service_prevenmas.job_logs DROP CONSTRAINT IF EXISTS job_logs_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.facturas DROP CONSTRAINT IF EXISTS facturas_pkey;
ALTER TABLE IF EXISTS ONLY service_prevenmas.clientes DROP CONSTRAINT IF EXISTS clientes_pkey;
ALTER TABLE IF EXISTS service_prevenmas.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.servicios_cliente_historial ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.servicios_cliente ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.servicios_catalogo ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.job_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.facturas ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS service_prevenmas.clientes ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS service_prevenmas.usuarios_id_seq;
DROP TABLE IF EXISTS service_prevenmas.usuarios;
DROP SEQUENCE IF EXISTS service_prevenmas.servicios_cliente_id_seq;
DROP SEQUENCE IF EXISTS service_prevenmas.servicios_cliente_historial_id_seq;
DROP TABLE IF EXISTS service_prevenmas.servicios_cliente_historial;
DROP TABLE IF EXISTS service_prevenmas.servicios_cliente;
DROP SEQUENCE IF EXISTS service_prevenmas.servicios_catalogo_id_seq;
DROP TABLE IF EXISTS service_prevenmas.servicios_catalogo;
DROP SEQUENCE IF EXISTS service_prevenmas.job_logs_id_seq;
DROP TABLE IF EXISTS service_prevenmas.job_logs;
DROP SEQUENCE IF EXISTS service_prevenmas.facturas_id_seq;
DROP TABLE IF EXISTS service_prevenmas.facturas;
DROP SEQUENCE IF EXISTS service_prevenmas.clientes_id_seq;
DROP TABLE IF EXISTS service_prevenmas.clientes;
DROP SCHEMA IF EXISTS service_prevenmas;
--
-- Name: service_prevenmas; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA service_prevenmas;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clientes; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.clientes (
    id integer NOT NULL,
    razon_social character varying(150) NOT NULL,
    cuit character varying(30) NOT NULL,
    email character varying(120),
    telefono character varying(60),
    direccion character varying(200),
    observaciones text,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    fecha_alta date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.clientes_id_seq OWNED BY service_prevenmas.clientes.id;


--
-- Name: facturas; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.facturas (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    descripcion text NOT NULL,
    importe numeric(12,2) NOT NULL,
    fecha_emision date NOT NULL,
    estado character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    fecha_cancelacion date,
    observacion text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: facturas_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.facturas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: facturas_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.facturas_id_seq OWNED BY service_prevenmas.facturas.id;


--
-- Name: job_logs; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.job_logs (
    id integer NOT NULL,
    run_at timestamp without time zone NOT NULL,
    expiries_count integer DEFAULT 0 NOT NULL,
    status character varying(20) NOT NULL,
    error text
);


--
-- Name: job_logs_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.job_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.job_logs_id_seq OWNED BY service_prevenmas.job_logs.id;


--
-- Name: servicios_catalogo; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.servicios_catalogo (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    descripcion character varying(200) NOT NULL,
    importe_sugerido numeric(12,2),
    observacion text,
    estado character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: servicios_catalogo_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.servicios_catalogo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_catalogo_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.servicios_catalogo_id_seq OWNED BY service_prevenmas.servicios_catalogo.id;


--
-- Name: servicios_cliente; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.servicios_cliente (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    servicio_id integer NOT NULL,
    fecha_servicio date NOT NULL,
    proximo_vencimiento date NOT NULL,
    importe numeric(12,2) NOT NULL,
    observacion text,
    estado character varying(20) DEFAULT 'vigente'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: servicios_cliente_historial; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.servicios_cliente_historial (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    servicio_id integer NOT NULL,
    fecha_servicio date NOT NULL,
    proximo_vencimiento date NOT NULL,
    importe numeric(12,2) NOT NULL,
    observacion text,
    source_servicio_cliente_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: servicios_cliente_historial_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.servicios_cliente_historial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_cliente_historial_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.servicios_cliente_historial_id_seq OWNED BY service_prevenmas.servicios_cliente_historial.id;


--
-- Name: servicios_cliente_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.servicios_cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servicios_cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.servicios_cliente_id_seq OWNED BY service_prevenmas.servicios_cliente.id;


--
-- Name: usuarios; Type: TABLE; Schema: service_prevenmas; Owner: -
--

CREATE TABLE service_prevenmas.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(120) NOT NULL,
    password_hash character varying(200) NOT NULL,
    rol character varying(20) DEFAULT 'operador'::character varying NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: service_prevenmas; Owner: -
--

CREATE SEQUENCE service_prevenmas.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: service_prevenmas; Owner: -
--

ALTER SEQUENCE service_prevenmas.usuarios_id_seq OWNED BY service_prevenmas.usuarios.id;


--
-- Name: clientes id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.clientes ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.clientes_id_seq'::regclass);


--
-- Name: facturas id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.facturas ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.facturas_id_seq'::regclass);


--
-- Name: job_logs id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.job_logs ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.job_logs_id_seq'::regclass);


--
-- Name: servicios_catalogo id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_catalogo ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.servicios_catalogo_id_seq'::regclass);


--
-- Name: servicios_cliente id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.servicios_cliente_id_seq'::regclass);


--
-- Name: servicios_cliente_historial id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente_historial ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.servicios_cliente_historial_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.usuarios ALTER COLUMN id SET DEFAULT nextval('service_prevenmas.usuarios_id_seq'::regclass);


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.clientes (id, razon_social, cuit, email, telefono, direccion, observaciones, estado, fecha_alta, created_at) FROM stdin;
1	Alfa Seguridad SRL	30-71234567-1	contacto@alfaseguridad.com	351-555111	Av. Colón 123	Cuenta corporativa	activo	2026-02-18	2026-02-18 13:51:59.951371
2	Beta Logística SA	30-70987654-9	admin@betalogistica.com	351-555222	Bv. San Juan 456	Renovaciones semestrales	activo	2026-02-18	2026-02-18 13:51:59.951371
3	Gamma Industria SA	30-70011223-4	compras@gamma.com	351-555333	Ruta 20 Km 12	Cliente estratégico	activo	2026-02-18	2026-02-18 13:51:59.951371
4	Delta Retail SRL	27-30123456-8	delta@retail.com	351-555444	Ituzaingó 890	Seguimiento mensual	activo	2026-02-18	2026-02-18 13:51:59.951371
5	Omega Servicios	20-33112233-5	omega@servicios.com	351-555555	Belgrano 321	Cuenta nueva	activo	2026-02-18	2026-02-18 13:51:59.951371
\.


--
-- Data for Name: facturas; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.facturas (id, cliente_id, descripcion, importe, fecha_emision, estado, fecha_cancelacion, observacion, created_at) FROM stdin;
1	1	Servicio extintores anual	45000.00	2026-02-03	PENDIENTE	\N	Factura en revisión	2026-02-18 13:52:17.517315
2	2	Mantenimiento alarmas Q1	32000.00	2026-01-29	COBRADA	2026-02-16	Pago recibido	2026-02-18 13:52:21.058815
\.


--
-- Data for Name: job_logs; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.job_logs (id, run_at, expiries_count, status, error) FROM stdin;
\.


--
-- Data for Name: servicios_catalogo; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.servicios_catalogo (id, codigo, descripcion, importe_sugerido, observacion, estado, created_at) FROM stdin;
1	EXT-ANUAL	Extintores - Inspección anual	45000.00	Incluye etiquetas y prueba hidráulica	activo	2026-02-18 13:52:02.199797
2	ALARMA-MANT	Mantenimiento de alarmas	32000.00	Visita técnica trimestral	activo	2026-02-18 13:52:02.199797
3	HIGIENE-IND	Higiene y seguridad industrial	78000.00	Plan anual	activo	2026-02-18 13:52:02.199797
4	CAP-RCP	Capacitación RCP y primeros auxilios	52000.00	Hasta 25 personas	activo	2026-02-18 13:52:02.199797
\.


--
-- Data for Name: servicios_cliente; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.servicios_cliente (id, cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado, created_at) FROM stdin;
3	3	3	2025-11-20	2026-11-20	78000.00	Plan anual vigente	vigente	2026-02-18 13:52:10.932182
4	4	4	2026-02-13	2026-03-15	52000.00	Primera edición	vigente	2026-02-18 13:52:13.465765
6	1	4	2026-02-18	2026-03-05	0.00		vigente	2026-02-18 13:58:29.898615
1	1	1	2026-01-29	2026-03-02	45000.00	Inspección 2024/2025	vigente	2026-02-18 13:52:06.125422
2	2	2	2026-02-08	2026-02-27	32000.00	Q1	vigente	2026-02-18 13:52:08.487404
5	3	4	2026-02-19	2026-03-06	45000.00		vigente	2026-02-18 13:54:12.212569
\.


--
-- Data for Name: servicios_cliente_historial; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.servicios_cliente_historial (id, cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, source_servicio_cliente_id, created_at) FROM stdin;
1	3	4	2026-02-19	2026-03-27	45000.00		5	2026-02-18 13:54:12.220673
2	1	4	2026-02-18	2026-03-19	0.00		6	2026-02-18 13:58:29.906701
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: service_prevenmas; Owner: -
--

COPY service_prevenmas.usuarios (id, nombre, email, password_hash, rol, activo, created_at) FROM stdin;
1	Administrador	admin@prevenmas.local	$2a$10$TmCk7J4OVK0KFjUeqynb5ew31xaNIkVntDdwT6YHQsBwQNUs0gHU2	admin	t	2026-02-18 11:39:18.683549
\.


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.clientes_id_seq', 5, true);


--
-- Name: facturas_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.facturas_id_seq', 2, true);


--
-- Name: job_logs_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.job_logs_id_seq', 1, false);


--
-- Name: servicios_catalogo_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.servicios_catalogo_id_seq', 4, true);


--
-- Name: servicios_cliente_historial_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.servicios_cliente_historial_id_seq', 2, true);


--
-- Name: servicios_cliente_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.servicios_cliente_id_seq', 6, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: service_prevenmas; Owner: -
--

SELECT pg_catalog.setval('service_prevenmas.usuarios_id_seq', 1, true);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: facturas facturas_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.facturas
    ADD CONSTRAINT facturas_pkey PRIMARY KEY (id);


--
-- Name: job_logs job_logs_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.job_logs
    ADD CONSTRAINT job_logs_pkey PRIMARY KEY (id);


--
-- Name: servicios_catalogo servicios_catalogo_codigo_key; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_catalogo
    ADD CONSTRAINT servicios_catalogo_codigo_key UNIQUE (codigo);


--
-- Name: servicios_catalogo servicios_catalogo_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_catalogo
    ADD CONSTRAINT servicios_catalogo_pkey PRIMARY KEY (id);


--
-- Name: servicios_cliente_historial servicios_cliente_historial_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente_historial
    ADD CONSTRAINT servicios_cliente_historial_pkey PRIMARY KEY (id);


--
-- Name: servicios_cliente servicios_cliente_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente
    ADD CONSTRAINT servicios_cliente_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_clientes_cuit; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE UNIQUE INDEX idx_clientes_cuit ON service_prevenmas.clientes USING btree (cuit);


--
-- Name: idx_clientes_razon_social; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_clientes_razon_social ON service_prevenmas.clientes USING btree (razon_social);


--
-- Name: idx_facturas_cliente; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_facturas_cliente ON service_prevenmas.facturas USING btree (cliente_id);


--
-- Name: idx_facturas_estado; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_facturas_estado ON service_prevenmas.facturas USING btree (estado);


--
-- Name: idx_servicios_cliente_cliente; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_servicios_cliente_cliente ON service_prevenmas.servicios_cliente USING btree (cliente_id);


--
-- Name: idx_servicios_cliente_vencimiento; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_servicios_cliente_vencimiento ON service_prevenmas.servicios_cliente USING btree (proximo_vencimiento);


--
-- Name: idx_servicios_hist_cliente; Type: INDEX; Schema: service_prevenmas; Owner: -
--

CREATE INDEX idx_servicios_hist_cliente ON service_prevenmas.servicios_cliente_historial USING btree (cliente_id);


--
-- Name: facturas facturas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.facturas
    ADD CONSTRAINT facturas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES service_prevenmas.clientes(id) ON DELETE CASCADE;


--
-- Name: servicios_cliente servicios_cliente_cliente_id_fkey; Type: FK CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente
    ADD CONSTRAINT servicios_cliente_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES service_prevenmas.clientes(id) ON DELETE CASCADE;


--
-- Name: servicios_cliente_historial servicios_cliente_historial_cliente_id_fkey; Type: FK CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente_historial
    ADD CONSTRAINT servicios_cliente_historial_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES service_prevenmas.clientes(id) ON DELETE CASCADE;


--
-- Name: servicios_cliente_historial servicios_cliente_historial_servicio_id_fkey; Type: FK CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente_historial
    ADD CONSTRAINT servicios_cliente_historial_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES service_prevenmas.servicios_catalogo(id);


--
-- Name: servicios_cliente servicios_cliente_servicio_id_fkey; Type: FK CONSTRAINT; Schema: service_prevenmas; Owner: -
--

ALTER TABLE ONLY service_prevenmas.servicios_cliente
    ADD CONSTRAINT servicios_cliente_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES service_prevenmas.servicios_catalogo(id);


--
-- PostgreSQL database dump complete
--

\unrestrict GSET964thpYZoW457vsEq6kCWdXG1p3YXICWnThN0y5fm9sTGdfv9WrWu3sC9mq

