import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/style.css";
import "./charts/ChartjsConfig";

// Context
import { AuthProvider } from "./contexts/AuthContext";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DataPoktan from "./pages/DataPoktan";
import DataKecamatan from "./pages/DataKecamatan";
import DataAlsintan from "./pages/DataAlsintan";
import PengaturanSmart from "./pages/PengaturanSmart";
import PengaturanUser from "./pages/PengaturanUser";
import PengajuanAlsintan from "./pages/PengajuanAlsintan";
import RekomendasiSmart from "./pages/RekomendasiSmart";
import StatusDistribusi from "./pages/StatusDistribusi";

function App() {
  const location = useLocation();

  useEffect(() => {
    const html = document.querySelector("html");
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0 });
    html.style.scrollBehavior = "";
  }, [location.pathname]);

  const publicRoutes = [{ path: "/login", element: <Login /> }];

  const protectedRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/data-poktan", element: <DataPoktan /> },
    { path: "/data-kecamatan", element: <DataKecamatan /> },
    { path: "/data-alsintan", element: <DataAlsintan /> },
    { path: "/smart-settings", element: <PengaturanSmart /> },
    { path: "/user-settings", element: <PengaturanUser /> },
    { path: "/pengajuan", element: <PengajuanAlsintan /> },
    { path: "/rekomendasi-smart", element: <RekomendasiSmart /> },
    { path: "/status-distribusi", element: <StatusDistribusi /> },
    { path: "*", element: <NotFound /> },
  ];

  return (
    <AuthProvider>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<PublicRoute>{element}</PublicRoute>}
          />
        ))}

        {protectedRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}
      </Routes>
    </AuthProvider>
  );
}

export default App;
