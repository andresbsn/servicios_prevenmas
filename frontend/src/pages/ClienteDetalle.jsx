import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";

const ClienteDetalle = () => {
  const { id } = useParams();
  const formatDate = (value) => (value ? value.split("T")[0] : "-");
  const [cliente, setCliente] = useState(null);
  const [catalogo, setCatalogo] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    servicio_id: "",
    fecha_servicio: "",
    proximo_vencimiento: "",
    importe: "",
    observacion: ""
  });
  const [invoiceForm, setInvoiceForm] = useState({
    descripcion: "",
    importe: "",
    fecha_emision: "",
    estado: "PENDIENTE"
  });

  const load = async () => {
    const [clienteRes, catalogoRes] = await Promise.all([
      api.get(`/clientes/${id}`),
      api.get("/catalogo")
    ]);
    setCliente(clienteRes.data);
    setCatalogo(catalogoRes.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    await api.post("/servicios", {
      cliente_id: Number(id),
      servicio_id: Number(serviceForm.servicio_id),
      fecha_servicio: serviceForm.fecha_servicio,
      proximo_vencimiento: serviceForm.proximo_vencimiento,
      importe: Number(serviceForm.importe),
      observacion: serviceForm.observacion,
      estado: "vigente"
    });
    setServiceForm({ servicio_id: "", fecha_servicio: "", proximo_vencimiento: "", importe: "", observacion: "" });
    load();
  };

  const handleInvoiceSubmit = async (event) => {
    event.preventDefault();
    await api.post("/facturas", {
      cliente_id: Number(id),
      descripcion: invoiceForm.descripcion,
      importe: Number(invoiceForm.importe),
      fecha_emision: invoiceForm.fecha_emision,
      estado: invoiceForm.estado
    });
    setInvoiceForm({ descripcion: "", importe: "", fecha_emision: "", estado: "PENDIENTE" });
    load();
  };

  if (!cliente) return null;

  return (
    <div>
      <div className="header">
        <h2>{cliente.razon_social}</h2>
      </div>
      <div className="panel">
        <p>
          <strong>CUIT:</strong> {cliente.cuit} | <strong>Email:</strong> {cliente.email || "-"}
        </p>
        <p>
          <strong>Tel:</strong> {cliente.telefono || "-"} | <strong>Dirección:</strong> {cliente.direccion || "-"}
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="panel">
          <h3>Agregar servicio</h3>
          <form onSubmit={handleServiceSubmit}>
            <select
              value={serviceForm.servicio_id}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, servicio_id: event.target.value }))}
              required
            >
              <option value="">Servicio</option>
              {catalogo.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.descripcion}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={serviceForm.fecha_servicio}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, fecha_servicio: event.target.value }))}
              required
            />
            <input
              type="date"
              value={serviceForm.proximo_vencimiento}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, proximo_vencimiento: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Importe"
              value={serviceForm.importe}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, importe: event.target.value }))}
              required
            />
            <textarea
              placeholder="Observación"
              value={serviceForm.observacion}
              onChange={(event) => setServiceForm((prev) => ({ ...prev, observacion: event.target.value }))}
            />
            <button type="submit">Guardar servicio</button>
          </form>
        </div>
        <div className="panel">
          <h3>Crear factura</h3>
          <form onSubmit={handleInvoiceSubmit}>
            <input
              placeholder="Descripción"
              value={invoiceForm.descripcion}
              onChange={(event) => setInvoiceForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              required
            />
            <input
              type="number"
              placeholder="Importe"
              value={invoiceForm.importe}
              onChange={(event) => setInvoiceForm((prev) => ({ ...prev, importe: event.target.value }))}
              required
            />
            <input
              type="date"
              value={invoiceForm.fecha_emision}
              onChange={(event) => setInvoiceForm((prev) => ({ ...prev, fecha_emision: event.target.value }))}
              required
            />
            <select
              value={invoiceForm.estado}
              onChange={(event) => setInvoiceForm((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="COBRADA">Cobrada</option>
            </select>
            <button type="submit">Guardar factura</button>
          </form>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3>Vencimientos vigentes</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Fecha servicio</th>
              <th>Próximo vencimiento</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {cliente.servicios.map((row) => (
              <tr key={row.id}>
                <td>{row.servicio_descripcion}</td>
                <td>{formatDate(row.fecha_servicio)}</td>
                <td>{formatDate(row.proximo_vencimiento)}</td>
                <td>{row.importe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3>Historial</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Fecha servicio</th>
              <th>Próximo vencimiento</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {cliente.historial.map((row) => (
              <tr key={row.id}>
                <td>{row.servicio_descripcion}</td>
                <td>{formatDate(row.fecha_servicio)}</td>
                <td>{formatDate(row.proximo_vencimiento)}</td>
                <td>{row.importe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3>Facturación</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Importe</th>
              <th>Estado</th>
              <th>Emisión</th>
            </tr>
          </thead>
          <tbody>
            {cliente.facturas.map((row) => (
              <tr key={row.id}>
                <td>{row.descripcion}</td>
                <td>{row.importe}</td>
                <td>{row.estado}</td>
                <td>{formatDate(row.fecha_emision)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClienteDetalle;
