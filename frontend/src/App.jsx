import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Clientes from "./pages/Clientes.jsx";
import ClienteDetalle from "./pages/ClienteDetalle.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Facturacion from "./pages/Facturacion.jsx";
import Configuracion from "./pages/Configuracion.jsx";
import UpcomingExpiries from "./pages/UpcomingExpiries.jsx";
import Reportes from "./pages/Reportes.jsx";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/:id" element={<ClienteDetalle />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="proximos-vencimientos" element={<UpcomingExpiries />} />
        <Route path="facturacion" element={<Facturacion />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  );
};

export default App;
