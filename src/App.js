import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import MatrizPage from './pages/MatrizPage';
import GraficasPage from './pages/GraficasPage';
import ParametrosPage from './pages/ParametrosPage';
import UsuariosPage from './pages/UsuariosPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <div style={{ marginLeft: 220, padding: 24 }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/matriz" element={<MatrizPage />} />
          <Route path="/graficas" element={<GraficasPage />} />
          <Route path="/parametros" element={<ParametrosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}