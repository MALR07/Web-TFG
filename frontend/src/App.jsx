import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// Importamos el AuthProvider
import { AuthProvider } from './components/componetns/AuthContext';

// Landing Page Components
import Header from './components/landing/Header.tsx';
import WhoWeAre from './components/landing/WhoWeAre';
import History from './components/landing/History.jsx';
import Events from './components/landing/Events';
import Gallery from './components/landing/Gallery.jsx';
import Video from './components/landing/Video';
import Dishes from './components/landing/Dishes';
import Menu from './components/landing/Menu';
import Comment from './components/landing/Comment';
import Footer from './components/landing/Footer';

// Rutas de Autenticación
import Login from './components/routes/login'; 
import Register from './components/routes/register';
import ForgotPassword from './components/routes/changecontra';

// Rutas protegidas
import PrivateRoute from './components/componetns/PrivateRoute';

// Componentes para camarero
import ManageReservations from './components/componetns/CamareroReserva';  
import ManageDishes from './components/componetns/PlatosManagement';  

// Componente de cliente
import ReservationPage from './components/componetns/ClientReserva';  // Reserva
import PlatosViewCliente from './components/componetns/PlatosViewCliente';  // Historial reservas

// Página de acceso denegado
import AccessDenied from './components/routes/accesdenied';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollOrNavigate = (sectionId) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <AuthProvider>
      <div className="font-sans bg-gray-50 text-gray-900">
        <Header scrollOrNavigate={scrollOrNavigate} />

        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <WhoWeAre />
                <div id="history"><History /></div>
                <div id="events"><Events /></div>
                <div id="gallery"><Gallery /></div>
                <div id="video"><Video /></div>
                <div id="menu"><Menu /></div>
                <div id="dishes"><Dishes /></div>
                <div id="comments"><Comment /></div>
              </>
            }
          />

          {/* Rutas protegidas para el cliente */}
          <Route element={<PrivateRoute requiredRole="cliente" />}>
            <Route path="/reservations" element={<ReservationPage />} />       {/* Para hacer reservas */}
            <Route path="/history-reservations" element={<PlatosViewCliente />} />  {/* Historial reservas */}
          </Route>

          {/* Rutas protegidas solo para camareros */}
          <Route element={<PrivateRoute requiredRole="camarero" />}>
            <Route path="/manage-reservations" element={<ManageReservations />} />
            <Route path="/manage-dishes" element={<ManageDishes />} />
          </Route>

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Ruta de acceso denegado */}
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>

        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
