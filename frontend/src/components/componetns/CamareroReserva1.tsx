import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/componetns/AuthContext.tsx';

// Definimos las interfaces de los datos
interface Usuario {
  id_user: number;
  nombre: string;
  email: string;
}

interface Plato {
  id_plato: number;
  nombre: string;
  descripcion: string;
  imagen?: string;
}

interface Reserva {
  id_reserva: number;
  id_plato: number;
  cantidad: number;
  fecha_reserva: string;
  estado: string;
  usuario: Usuario | null;
  plato: Plato | null;
}

const CamareroReserva: React.FC = () => {
  const { token, isAuthenticated, role } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda

  useEffect(() => {
    if (!isAuthenticated) {
      setError('No estás autenticado');
    } else if (role !== 'camarero') {
      setError('No tienes permisos para acceder a esta página');
    } else {
      fetchReservas();
    }
  }, [isAuthenticated, role]);

  // Función para obtener todas las reservas con los datos de usuario y plato
  const fetchReservas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/reservas/reservas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Ya no necesitamos hacer solicitudes adicionales para obtener usuario y plato, ya que los devuelve el backend
      setReservas(res.data.reservas || []);
    } catch (err) {
      setError('Error al obtener las reservas');
    }
  };

  // Filtrar las reservas según el término de búsqueda
  const filteredReservas = reservas.filter((reserva) => {
    const usuario = reserva.usuario || { nombre: '', email: '' }; // Aseguramos que siempre haya un usuario con valores predeterminados
    const nombre = usuario.nombre.toLowerCase();
    const email = usuario.email.toLowerCase();
    const search = searchTerm.toLowerCase();

    return nombre.includes(search) || email.includes(search);
  });

  // Modificar una reserva (gestionar estado)
  const handleGestionarEstado = async (reservaId: number, nuevoEstado: string) => {
    if (isLoading) return; // Evitar múltiples clics mientras se está cargando

    try {
      setIsLoading(true);
      // Aquí usamos el nuevo endpoint para actualizar el estado de la reserva
      const res = await axios.put(
        'http://localhost:3001/reservas/gestionar',
        {
          reservaId,
          nuevoEstado, // 'confirmada', 'presentada', 'cancelada'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Estado de la reserva actualizado exitosamente');
      fetchReservas(); // Refrescamos las reservas para mostrar el cambio de estado
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el estado');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si hay errores o mensajes de éxito
  const renderMessages = () => {
    return (
      <>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard Camarero</h1>

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-md w-full"
        />
      </div>

      {/* Mostrar reservas filtradas */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Reservas Filtradas</h2>
        {filteredReservas.length === 0 ? (
          <p className="text-gray-500">No hay reservas que coincidan con la búsqueda.</p>
        ) : (
          <div className="space-y-4">
            {filteredReservas.map((reserva) => {
              return (
                <div key={reserva.id_reserva} className="p-4 border rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {reserva.usuario ? reserva.usuario.nombre : 'Usuario desconocido'}
                    </h3>
                    <p className="text-gray-600">
                      {reserva.usuario ? reserva.usuario.email : 'Correo desconocido'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(reserva.fecha_reserva).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-white ${
                        reserva.estado === 'confirmada'
                          ? 'bg-green-500'
                          : reserva.estado === 'presentada'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                    >
                      {reserva.estado}
                    </span>
                    {reserva.plato && (
                      <div className="mt-2 text-sm text-gray-500">
                        <strong>Plato:</strong> {reserva.plato.nombre}
                      </div>
                    )}
                  </div>
                  {/* Botones para gestionar el estado */}
                  <div>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                      onClick={() => handleGestionarEstado(reserva.id_reserva, 'confirmada')}
                      disabled={reserva.estado === 'confirmada' || isLoading}
                    >
                      Confirmar
                    </button>
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                      onClick={() => handleGestionarEstado(reserva.id_reserva, 'presentada')}
                      disabled={reserva.estado === 'presentada' || isLoading}
                    >
                      Presentada
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                      onClick={() => handleGestionarEstado(reserva.id_reserva, 'cancelada')}
                      disabled={reserva.estado === 'cancelada' || isLoading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mostrar mensajes de error o éxito */}
      {renderMessages()}
    </div>
  );
};

export default CamareroReserva;
