SET search_path TO service_prevenmas;

INSERT INTO clientes (razon_social, cuit, email, telefono, direccion, observaciones, estado)
VALUES
  ('Alfa Seguridad SRL', '30-71234567-1', 'contacto@alfaseguridad.com', '351-555111', 'Av. Colón 123', 'Cuenta corporativa', 'activo'),
  ('Beta Logística SA', '30-70987654-9', 'admin@betalogistica.com', '351-555222', 'Bv. San Juan 456', 'Renovaciones semestrales', 'activo'),
  ('Gamma Industria SA', '30-70011223-4', 'compras@gamma.com', '351-555333', 'Ruta 20 Km 12', 'Cliente estratégico', 'activo'),
  ('Delta Retail SRL', '27-30123456-8', 'delta@retail.com', '351-555444', 'Ituzaingó 890', 'Seguimiento mensual', 'activo'),
  ('Omega Servicios', '20-33112233-5', 'omega@servicios.com', '351-555555', 'Belgrano 321', 'Cuenta nueva', 'activo')
ON CONFLICT (cuit) DO NOTHING;

INSERT INTO servicios_catalogo (codigo, descripcion, importe_sugerido, observacion, estado)
VALUES
  ('EXT-ANUAL', 'Extintores - Inspección anual', 45000, 'Incluye etiquetas y prueba hidráulica', 'activo'),
  ('ALARMA-MANT', 'Mantenimiento de alarmas', 32000, 'Visita técnica trimestral', 'activo'),
  ('HIGIENE-IND', 'Higiene y seguridad industrial', 78000, 'Plan anual', 'activo'),
  ('CAP-RCP', 'Capacitación RCP y primeros auxilios', 52000, 'Hasta 25 personas', 'activo')
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO servicios_cliente (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado)
SELECT c.id, s.id, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '345 days', 45000, 'Inspección 2024/2025', 'vigente'
FROM clientes c
JOIN servicios_catalogo s ON s.codigo = 'EXT-ANUAL'
WHERE c.cuit = '30-71234567-1'
ON CONFLICT DO NOTHING;

INSERT INTO servicios_cliente (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado)
SELECT c.id, s.id, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '80 days', 32000, 'Q1', 'vigente'
FROM clientes c
JOIN servicios_catalogo s ON s.codigo = 'ALARMA-MANT'
WHERE c.cuit = '30-70987654-9'
ON CONFLICT DO NOTHING;

INSERT INTO servicios_cliente (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado)
SELECT c.id, s.id, CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', 78000, 'Plan anual vigente', 'vigente'
FROM clientes c
JOIN servicios_catalogo s ON s.codigo = 'HIGIENE-IND'
WHERE c.cuit = '30-70011223-4'
ON CONFLICT DO NOTHING;

INSERT INTO servicios_cliente (cliente_id, servicio_id, fecha_servicio, proximo_vencimiento, importe, observacion, estado)
SELECT c.id, s.id, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 52000, 'Primera edición', 'vigente'
FROM clientes c
JOIN servicios_catalogo s ON s.codigo = 'CAP-RCP'
WHERE c.cuit = '27-30123456-8'
ON CONFLICT DO NOTHING;

INSERT INTO facturas (cliente_id, descripcion, importe, fecha_emision, estado, observacion)
SELECT c.id, 'Servicio extintores anual', 45000, CURRENT_DATE - INTERVAL '15 days', 'PENDIENTE', 'Factura en revisión'
FROM clientes c
WHERE c.cuit = '30-71234567-1'
ON CONFLICT DO NOTHING;

INSERT INTO facturas (cliente_id, descripcion, importe, fecha_emision, estado, fecha_cancelacion, observacion)
SELECT c.id, 'Mantenimiento alarmas Q1', 32000, CURRENT_DATE - INTERVAL '20 days', 'COBRADA', CURRENT_DATE - INTERVAL '2 days', 'Pago recibido'
FROM clientes c
WHERE c.cuit = '30-70987654-9'
ON CONFLICT DO NOTHING;
