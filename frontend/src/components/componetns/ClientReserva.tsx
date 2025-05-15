import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useAuth } from '../../components/componetns/AuthContext.tsx';

const ClienteDashboard: React.FC = () => {
  const { isAuthenticated, token, user } = useAuth(); 
  const [reservas, setReservas] = useState<any[]>([]);
  const [idPlato, setIdPlato] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [fechaReserva, setFechaReserva] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservas();
    }
  }, [isAuthenticated, token]);

  const fetchReservas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/reservas/reservas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservas(res.data.reservas);
    } catch (err) {
      setError('Error al obtener las reservas');
    }
  };

  const handleCrearReserva = async () => {
    if (!isAuthenticated) {
      setError('No estás autenticado');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(
        'http://localhost:3001/reservas/crear',
        { id_plato: idPlato, cantidad, fecha_reserva: fechaReserva },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Reserva creada exitosamente');
      fetchReservas(); // Refrescar las reservas
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelarReserva = async (reservaId: number) => {
    if (!isAuthenticated) {
      setError('No estás autenticado');
      return;
    }

    try {
      await axios.delete('http://localhost:3001/reservas/cancelar', {
        headers: { Authorization: `Bearer ${token}` },
        data: { reservaId },
      });
      setSuccessMessage('Reserva cancelada exitosamente');
      fetchReservas(); // Refrescar las reservas
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar la reserva');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">Dashboard del Cliente</h1>

        {/* Formulario para crear reserva */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Realizar una nueva reserva</h2>
          <div className="mb-4">
            <label className="block text-gray-600">Selecciona el plato</label>
            <input
              type="number"
              value={idPlato}
              onChange={(e) => setIdPlato(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              placeholder="ID del plato"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Cantidad de platos"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Fecha y hora de la reserva</label>
            <input
              type="datetime-local"
              value={fechaReserva}
              onChange={(e) => setFechaReserva(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
          <button
            onClick={handleCrearReserva}
            className={`w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creando reserva...' : 'Crear Reserva'}
          </button>
        </div>

        {/* Mostrar reservas existentes */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mis reservas</h2>
          {reservas.length === 0 ? (
            <p>No tienes reservas pendientes.</p>
          ) : (
            <ul className="space-y-4">
              {reservas.map((reserva) => (
                <li key={reserva.id_reserva} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                  <div className="flex flex-col">
                    <span className="font-semibold">{reserva.Plato.nombre}</span>
                    <span className="text-sm text-gray-600">{new Date(reserva.fecha_reserva).toLocaleString()}</span>
                  </div>
                  <button
                    className="text-red-600 font-semibold"
                    onClick={() => handleCancelarReserva(reserva.id_reserva)}
                  >
                    Cancelar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mensajes de error o éxito */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ClienteDashboard;
