// src/components/CamareroDashboard.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CamareroReserva: React.FC = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [reservaId, setReservaId] = useState('');
  const [newCantidad, setNewCantidad] = useState(1);
  const [newFechaReserva, setNewFechaReserva] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener todas las reservas al cargar el componente
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/reservas/reservas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservas(res.data.reservas);
      } catch (err) {
        setError('Error al obtener las reservas');
      }
    };
    fetchReservas();
  }, []);

  // Modificar una reserva
  const handleModificarReserva = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3001/reservas/gestionar',
        {
          reservaId,
          newCantidad,
          newFechaReserva,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage('Reserva modificada exitosamente');
      setIsLoading(false);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al modificar la reserva');
      setIsLoading(false);
    }
  };

  // Cancelar una reserva
  const handleCancelarReserva = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/reservas/cancelar', {
        data: { reservaId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Reserva cancelada exitosamente');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar la reserva');
      setSuccessMessage('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Camarero</h1>

      {/* Modificar Reserva */}
      <div className="mb-6">
        <h2 className="text-xl">Modificar Reserva</h2>
        <input
          type="text"
          placeholder="ID de la reserva"
          value={reservaId}
          onChange={(e) => setReservaId(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <input
          type="number"
          placeholder="Nueva cantidad de platos"
          value={newCantidad}
          onChange={(e) => setNewCantidad(Number(e.target.value))}
          className="border p-2 rounded mb-2"
        />
        <input
          type="datetime-local"
          value={newFechaReserva}
          onChange={(e) => setNewFechaReserva(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <button
          onClick={handleModificarReserva}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Modificando reserva...' : 'Modificar Reserva'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>

      {/* Cancelar reserva */}
      <div className="mb-6">
        <h2 className="text-xl">Cancelar Reserva</h2>
        <input
          type="text"
          placeholder="ID de la reserva"
          value={reservaId}
          onChange={(e) => setReservaId(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <button
          onClick={handleCancelarReserva}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancelar
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>

      {/* Ver todas las reservas */}
      <div>
        <h2 className="text-xl mb-2">Todas las Reservas</h2>
        {reservas.length === 0 ? (
          <p>No hay reservas registradas.</p>
        ) : (
          <ul>
            {reservas.map((reserva) => (
              <li key={reserva.id_reserva} className="mb-2">
                <span>{reserva.Plato.nombre}</span> - {reserva.fecha_reserva}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CamareroReserva;
