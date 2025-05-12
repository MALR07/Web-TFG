import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Landing Page Components
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


// Importamos el contexto de autenticación
import Login from './components/routes/login'; // Asegúrate de que las rutas sean correctas
import Register from './components/routes/register';
import ForgotPassword from './components/routes/changecontra';

// Componente de rutas protegidas
import PrivateRoute from './components/componetns/PrivateRoute.jsx';

// Componente de gestión (solo para camarero)
import ManageReservations from './components/componetns/CamareroReserva.tsx';  
import ManageDishes from './components/componetns/PlatosManagement.tsx';  

// Componente de cliente
import ReservationPage from './components/componetns/ClientReserva.tsx'; // Asegúrate de que las rutas sean correctas

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      <Header />

      <Routes>
        {/* Landing Page */}
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

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/reservations" element={<ReservationPage />} />
        </Route>

        {/* Rutas protegidas solo para camareros */}
        <Route element={<PrivateRoute requiredRole="camarero" />}>
          <Route path="/manage-reservations" element={<ManageReservations />} />
          <Route path="/manage-dishes" element={<ManageDishes />} />
        </Route>

        {/* Rutas públicas */}
        {/* Rutas de Autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>

      <Footer />
    </div>
  );
};

export default App;
