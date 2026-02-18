import React, { useEffect, useState } from "react";
import api from "../api.js";

const Dashboard = () => {
  const [summary, setSummary] = useState({ clientes: 0, vencimientos: 0, facturas: 0 });

  useEffect(() => {
    const load = async () => {
      const [clientes, vencimientos, facturas] = await Promise.all([
        api.get("/clientes"),
        api.get("/servicios"),
        api.get("/facturas")
      ]);
      setSummary({
        clientes: clientes.data.length,
        vencimientos: vencimientos.data.length,
        facturas: facturas.data.length
      });
    };
    load();
  }, []);

  return (
    <div>
      <div className="header">
        <h2>Resumen operativo</h2>
      </div>
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="grid-2">
          <div>
            <h3>Centro de control</h3>
            <p>
              Monitoreo diario de clientes, vencimientos y facturación para tomar decisiones con
              anticipación.
            </p>
          </div>
          <div className="card-row" style={{ justifyContent: "flex-end" }}>
            <div className="card">
              <strong>{summary.clientes}</strong>
              <p>Clientes activos</p>
            </div>
            <div className="card">
              <strong>{summary.vencimientos}</strong>
              <p>Servicios registrados</p>
            </div>
            <div className="card">
              <strong>{summary.facturas}</strong>
              <p>Facturas totales</p>
            </div>
          </div>
        </div>
      </div>
      <div className="panel">
        <h3>Acciones sugeridas</h3>
        <ul>
          <li>Revisá vencimientos próximos y confirmá renovaciones críticas.</li>
          <li>Emití facturas pendientes antes del cierre de semana.</li>
          <li>Validá los destinatarios de email de notificación.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
