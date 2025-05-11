import React from 'react';
import { Routes, Route } from 'react-router';
import '../app.css';

// Landing Page Components
import Header from '../landing/Header';
import WhoWeAre from '../landing/WhoWeAre';
import History from '../landing/History';
import Events from '../landing/Events';
import Gallery from '../landing/Gallery';
import Video from '../landing/Video';
import Dishes from '../landing/Dishes';
import Menu from '../landing/Menu';
import Comment from '../landing/Comment';
import Footer from '../landing/Footer';

// Auth Components
import Login from '../routes/login';
import Register from '../routes/register';
import ForgotPassword from '../routes/changecontra';
// Reservas y Gestión de Platos (Para el camarero)
import ManageReservations from '../componetns/CamareroReserva';  // Este será el componente para gestionar reservas
import ManageDishes from '../componetns/PlatosManagement';  // Este será el componente para gestionar los platos

// Componentes de cliente
import ReservationPage from '../componetns/ClientReserva'; // Página de reservas del cliente

const Landing = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header se mostrará en todas las páginas */}
      <Header />

      <Routes>
        {/* Ruta principal (landing) */}
        <Route path="/" element={
          <>
            <WhoWeAre />
            <History />
            <Events />
            <Gallery />
            <Video />
            <Menu />
            <Dishes />
            <Comment />
          </>
        } />

        {/* Rutas para Login y Register */}
        <Route path="/login." element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        

        {/* Rutas para reservas (Cliente) */}
        <Route path="/reservations" element={<ReservationPage />} />

        {/* Rutas para gestión de reservas y platos (Camarero) */}
        <Route path="/manage-reservations" element={<ManageReservations />} />
        <Route path="/manage-dishes" element={<ManageDishes />} />
      </Routes>

      {/* Footer se mostrará en todas las páginas */}
      <Footer />
    </div>
  );
};

export default Landing;
