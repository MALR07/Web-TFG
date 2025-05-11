import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';  // Ruta relativa para App.css

// Landing Page Components (ahora en "components/landing")
import Header from './components/landing/Header';
import WhoWeAre from './components/landing/WhoWeAre';
import History from './components/landing/History';
import Events from './components/landing/Events';
import Gallery from './components/landing/Gallery';
import Video from './components/landing/Video';
import Dishes from './components/landing/Dishes';
import Menu from './components/landing/Menu';
import Comment from './components/landing/Comment';
import Footer from './components/landing/Footer';

// Auth Components
//import Login from './components/routes/login';
//import Register from './components/routes/register';
//import ForgotPassword from './components/routes/changecontra';

// Reservas y Gestión de Platos (Para el camarero)
import ManageReservations from './components/componetns/CamareroReserva';  
import ManageDishes from './components/componetns/PlatosManagement';  

// Componentes de cliente
import ReservationPage from './components/componetns//ClientReserva'; 

const Landing = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header se mostrará en todas las páginas */}
      <Header />

      <Routes>
        {/* Ruta principal (landing) */}
        <Route 
          path="/" 
          element={
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
          }
        />

        {/* Rutas para Login y Register */}
        <Route path="/login" element={<Login />} />
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
