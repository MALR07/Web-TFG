import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/componetns/AuthContext.tsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [platos, setPlatos] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [filteredReservas, setFilteredReservas] = useState<any[]>([]);
  const [orderBy, setOrderBy] = useState<'closest' | 'farthest' | 'default'>('default');

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservas();
      fetchPlatos();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    let reservasFiltradas = reservas;

    if (searchQuery) {
      reservasFiltradas = reservasFiltradas.filter(
        (reserva) =>
          reserva.User?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reserva.User?.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (estadoFilter) {
      reservasFiltradas = reservasFiltradas.filter(
        (reserva) => reserva.estado.toLowerCase() === estadoFilter.toLowerCase()
      );
    }

    if (orderBy === 'closest') {
      reservasFiltradas = reservasFiltradas.sort((a, b) => {
        const diffA = Math.abs(new Date(a.fecha_reserva).getTime() - Date.now());
        const diffB = Math.abs(new Date(b.fecha_reserva).getTime() - Date.now());
        return diffA - diffB;
      });
    } else if (orderBy === 'farthest') {
      reservasFiltradas = reservasFiltradas.sort((a, b) => {
        const diffA = Math.abs(new Date(a.fecha_reserva).getTime() - Date.now());
        const diffB = Math.abs(new Date(b.fecha_reserva).getTime() - Date.now());
        return diffB - diffA;
      });
    }

    setFilteredReservas(reservasFiltradas);
  }, [reservas, searchQuery, estadoFilter, orderBy]);

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

  const fetchPlatos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/platos/available', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlatos(res.data);
    } catch (err) {
      setError('Error al obtener los platos');
    }
  };

  const handleGestionarReserva = async (reservaId: number, nuevoEstado: string) => {
    const confirmMessage =
      nuevoEstado === 'confirmada'
        ? '¿Estás seguro de que deseas confirmar esta reserva?'
        : '¿Estás seguro de que deseas marcar esta reserva como presentada?';

    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    try {
      setIsLoading(true);
      await axios.put(
        'http://localhost:3001/reservas/gestionar',
        { reservaId, nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Reserva ${nuevoEstado === 'confirmada' ? 'confirmada' : 'marcada como presentada'}`);
      fetchReservas();
    } catch {
      toast.error('Error al gestionar la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEliminarReserva = async (reservaId: number) => {
    const confirm = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    if (!confirm) return;

    try {
      setIsLoading(true);
      // Ahora se hace la solicitud DELETE en vez de POST
      const response = await axios.delete(
        'http://localhost:3001/reservas/cancelar', // Asegúrate de que esta URL esté correcta en el backend
        {
          data: { reservaId }, // Aquí pasamos el reservaId dentro de la propiedad `data`
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Mostrar la respuesta del servidor en la consola para verificar que es correcta
      console.log(response.data);

      // Mostrar un mensaje de éxito
      toast.success('Reserva cancelada');
      // Recargar las reservas después de la cancelación
      fetchReservas();
    } catch (err: any) {
      console.error('Error al cancelar la reserva:', err);
      if (err.response) {
        toast.error(`Error: ${err.response.data.message || 'Error al cancelar la reserva'}`);
      } else {
        toast.error('Error al conectar con el servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatFechaConDescuento = (fecha: string) => {
    const reservaDate = new Date(fecha);
    reservaDate.setHours(reservaDate.getHours() - 2);
    return reservaDate.toLocaleString();
  };

  return (
    <div
      style={{
        backgroundImage: "url('/fondoreserva.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="overflow-x-auto"
    >
      <div className="w-full max-w-4xl lg:max-w-5xl bg-white shadow-xl rounded-lg p-4 sm:p-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-yellow-500 mb-8">Gestión de Reservas</h1>

        {error && <div className="bg-red-500 text-white p-4 rounded-md mb-4">{error}</div>}

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            className="p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">Filtrar por estado</option>
            <option value="confirmada">Confirmada</option>
            <option value="presentado">Presentado</option>
          </select>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setOrderBy('closest')}
              className={`p-2 rounded border transition-all duration-200 ${orderBy === 'closest' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-200'}`}
            >
              Más Cercanas
            </button>
            <button
              onClick={() => setOrderBy('farthest')}
              className={`p-2 rounded border transition-all duration-200 ${orderBy === 'farthest' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-200'}`}
            >
              Más Lejanas
            </button>
            <button
              onClick={() => setOrderBy('default')}
              className={`p-2 rounded border transition-all duration-200 ${orderBy === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-blue-200'}`}
            >
              Ver Todas
            </button>
          </div>
        </div>

        {/* Lista de reservas */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4 text-center">Reservas de los clientes</h2>

          {filteredReservas.length === 0 ? (
            <p className="text-gray-600">No hay reservas.</p>
          ) : (
            <ul className="space-y-4">
              {filteredReservas.map((reserva) => {
                const platoReserva = reserva.Plato;
                const usuarioReserva = reserva.User;

                if (!platoReserva || !usuarioReserva) {
                  return (
                    <li key={reserva.id_reserva} className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-red-600">Datos incompletos para esta reserva.</p>
                    </li>
                  );
                }

                return (
                  <li
                    key={reserva.id_reserva}
                    className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{platoReserva.nombre}</p>
                        <p className="text-sm text-gray-600">
                          {formatFechaConDescuento(reserva.fecha_reserva)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Estado: <strong>{reserva.estado}</strong>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Reservado por:</strong> {usuarioReserva.nombre} ({usuarioReserva.email})
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Cantidad:</strong> {reserva.cantidad}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleGestionarReserva(reserva.id_reserva, 'confirmada')}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Confirmado
                        </button>
                        <button
                          onClick={() => handleGestionarReserva(reserva.id_reserva, 'presentado')}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Presentado
                        </button>
                        <button
                          onClick={() => handleEliminarReserva(reserva.id_reserva)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                          disabled={isLoading}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default AdminDashboard;
