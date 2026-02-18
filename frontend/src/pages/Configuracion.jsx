import React, { useEffect, useState } from "react";
import api from "../api.js";
import Modal from "../components/Modal.jsx";

const Configuracion = () => {
  const formatDate = (value) => (value ? value.split("T")[0] : "-");
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadLogs = async () => {
    const { data } = await api.get("/jobs/logs");
    setLogs(data);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const runJob = async () => {
    setStatus(null);
    try {
      const { data } = await api.post("/jobs/expiry-notify");
      setStatus(data.message);
      loadLogs();
    } catch (error) {
      setStatus("Error al ejecutar job");
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Configuración</h2>
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="filters">
            <span className="table-total">Total logs: {logs.length}</span>
          </div>
          <button onClick={() => setIsModalOpen(true)}>Ejecutar job ahora</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((row) => (
              <tr key={row.id}>
                <td data-label="Fecha">{formatDate(row.run_at)}</td>
                <td data-label="Cantidad">{row.expiries_count}</td>
                <td data-label="Estado">{row.status}</td>
                <td data-label="Error">{row.error || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal title="Ejecutar job de vencimientos" onClose={() => setIsModalOpen(false)}>
          <p>Se ejecutará el envío de notificaciones y se registrará en los logs.</p>
          {status && <div className="panel">{status}</div>}
          <div className="card-row">
            <button onClick={runJob} type="button">
              Ejecutar ahora
            </button>
            <button onClick={() => setIsModalOpen(false)} className="secondary" type="button">
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Configuracion;
