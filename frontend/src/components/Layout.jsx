import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>
          Seguridad Prevenmas
          <span>Gestión operativa</span>
        </h1>
        <nav>
          <NavLink to="/" end>
            Resumen
          </NavLink>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/proximos-vencimientos">Próximos vencimientos</NavLink>
          <NavLink to="/facturacion">Facturación</NavLink>
          <NavLink to="/reportes">Reportes</NavLink>
          <NavLink to="/configuracion">Config</NavLink>
        </nav>
        <button
          className="secondary"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Cerrar sesión
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
