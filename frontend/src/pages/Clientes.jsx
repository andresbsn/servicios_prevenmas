import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.js";
import Modal from "../components/Modal.jsx";

const emptyForm = {
  razon_social: "",
  cuit: "",
  email: "",
  telefono: "",
  direccion: "",
  observaciones: "",
  estado: "activo"
};

const Clientes = () => {
  const today = new Date().toISOString().slice(0, 10);
  const formatDate = (value) => (value ? value.split("T")[0] : "");
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ search: "", estado: "" });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("datos");
  const [catalog, setCatalog] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceEditingId, setServiceEditingId] = useState(null);
  const buildServiceForm = (overrides = {}) => ({
    servicio_id: "",
    fecha_servicio: today,
    proximo_vencimiento: "",
    importe: "",
    observacion: "",
    ...overrides
  });
  const [serviceForm, setServiceForm] = useState(buildServiceForm());

  const load = async () => {
    const { data } = await api.get("/clientes", { params: filters });
    setClients(data);
  };

  useEffect(() => {
    load();
  }, [filters.search, filters.estado]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/clientes/${editingId}`, form);
    } else {
      const { data } = await api.post("/clientes", form);
      setEditingId(data.id);
      await loadClientDetail(data.id);
      setActiveTab("vencimientos");
    }
    setForm(emptyForm);
    load();
  };

  const loadClientDetail = async (clientId) => {
    if (!clientId) return;
    const [clientRes, catalogRes] = await Promise.all([
      api.get(`/clientes/${clientId}`),
      api.get("/catalogo")
    ]);
    setServices(clientRes.data.servicios || []);
    setCatalog(catalogRes.data);
  };

  const handleServiceSubmit = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    const payload = {
      cliente_id: editingId,
      servicio_id: Number(serviceForm.servicio_id),
      fecha_servicio: serviceForm.fecha_servicio || today,
      proximo_vencimiento: serviceForm.proximo_vencimiento,
      importe: serviceForm.importe ? Number(serviceForm.importe) : 0,
      observacion: serviceForm.observacion,
      estado: "vigente"
    };
    if (serviceEditingId) {
      await api.put(`/servicios/${serviceEditingId}`, payload);
    } else {
      await api.post("/servicios", payload);
    }
    setServiceEditingId(null);
    setServiceForm(buildServiceForm());
    loadClientDetail(editingId);
  };

  const startEdit = (client) => {
    setEditingId(client.id);
    setForm({
      razon_social: client.razon_social,
      cuit: client.cuit,
      email: client.email || "",
      telefono: client.telefono || "",
      direccion: client.direccion || "",
      observaciones: client.observaciones || "",
      estado: client.estado
    });
    setActiveTab("datos");
    loadClientDetail(client.id);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setServices([]);
    setServiceEditingId(null);
    setServiceForm(buildServiceForm());
    setActiveTab("datos");
    setIsModalOpen(true);
  };

  const startEditService = (row) => {
    setServiceEditingId(row.id);
    setServiceForm(
      buildServiceForm({
        servicio_id: String(row.servicio_id),
        fecha_servicio: row.fecha_servicio,
        proximo_vencimiento: row.proximo_vencimiento,
        importe: String(row.importe),
        observacion: row.observacion || ""
      })
    );
  };

  return (
    <div>
      <div className="header">
        <h2>Clientes</h2>
      </div>

      <div className="panel">
        <div className="table-toolbar">
          <div className="filters">
            <input
              placeholder="Buscar por nombre o CUIT"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            />
            <select
              value={filters.estado}
              onChange={(event) => setFilters((prev) => ({ ...prev, estado: event.target.value }))}
            >
              <option value="">Estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="card-row">
            <span className="table-total">Total: {clients.length}</span>
            <button onClick={openNew}>Nuevo cliente</button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CUIT</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td data-label="Cliente">
                  <Link to={`/clientes/${client.id}`}>{client.razon_social}</Link>
                </td>
                <td data-label="CUIT">{client.cuit}</td>
                <td data-label="Estado">
                  <span className="badge">{client.estado}</span>
                </td>
                <td data-label="Acciones">
                  <button className="secondary" onClick={() => startEdit(client)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title={editingId ? "Editar cliente" : "Nuevo cliente"} onClose={() => setIsModalOpen(false)}>
          <div className="modal-tabs">
            <button
              type="button"
              className={activeTab === "datos" ? "active" : ""}
              onClick={() => setActiveTab("datos")}
            >
              Datos
            </button>
            <button
              type="button"
              className={activeTab === "vencimientos" ? "active" : ""}
              onClick={() => {
                setActiveTab("vencimientos");
                setServiceEditingId(null);
                setServiceForm(buildServiceForm());
                loadClientDetail(editingId);
              }}
            >
              Vencimientos
            </button>
          </div>

          {activeTab === "datos" && (
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Razón social"
                value={form.razon_social}
                onChange={(event) => setForm((prev) => ({ ...prev, razon_social: event.target.value }))}
                required
              />
              <input
                placeholder="CUIT/DNI"
                value={form.cuit}
                onChange={(event) => setForm((prev) => ({ ...prev, cuit: event.target.value }))}
                required
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
              />
              <input
                placeholder="Dirección"
                value={form.direccion}
                onChange={(event) => setForm((prev) => ({ ...prev, direccion: event.target.value }))}
              />
              <textarea
                placeholder="Observaciones"
                value={form.observaciones}
                onChange={(event) => setForm((prev) => ({ ...prev, observaciones: event.target.value }))}
              />
              <select
                value={form.estado}
                onChange={(event) => setForm((prev) => ({ ...prev, estado: event.target.value }))}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
              <div className="card-row">
                <button type="submit">Guardar</button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setIsModalOpen(false);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {activeTab === "vencimientos" && (
            <div className="modal-section">
              {!editingId && (
                <div className="panel">
                  Guardá el cliente para habilitar la carga de vencimientos.
                </div>
              )}
              <form onSubmit={handleServiceSubmit}>
                <select
                  value={serviceForm.servicio_id}
                  onChange={(event) => setServiceForm((prev) => ({ ...prev, servicio_id: event.target.value }))}
                  required
                >
                  <option value="">Servicio</option>
                  {catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.descripcion}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={serviceForm.proximo_vencimiento}
                  onChange={(event) => setServiceForm((prev) => ({ ...prev, proximo_vencimiento: event.target.value }))}
                  required
                />
                <div className="card-row">
                  <button type="submit" disabled={!editingId}>
                    {serviceEditingId ? "Actualizar" : "Agregar"}
                  </button>
                  {serviceEditingId && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        setServiceEditingId(null);
                        setServiceForm(buildServiceForm());
                      }}
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </form>

              <table className="table" style={{ marginTop: 12 }}>
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Próximo vencimiento</th>
                    <th>Importe</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((row) => (
                    <tr key={row.id}>
                      <td data-label="Servicio">{row.servicio_descripcion}</td>
                      <td data-label="Fecha">{formatDate(row.fecha_servicio)}</td>
                      <td data-label="Próximo vencimiento">{formatDate(row.proximo_vencimiento)}</td>
                      <td data-label="Importe">{row.importe}</td>
                      <td data-label="Acciones">
                        <button className="secondary" onClick={() => startEditService(row)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Clientes;
