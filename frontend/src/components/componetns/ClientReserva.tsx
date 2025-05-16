import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/componetns/AuthContext.tsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClienteDashboard: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [platos, setPlatos] = useState<any[]>([]);
  const [idPlato, setIdPlato] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [fechaReserva, setFechaReserva] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [platoSeleccionado, setPlatoSeleccionado] = useState<any>(null);
  const [expandedReserva, setExpandedReserva] = useState<number | null>(null); // Para controlar las reservas expandidas

  useEffect(() => {
    if (isAuthenticated) {
      fetchReservas();
      fetchPlatos();
    }
  }, [isAuthenticated, token]);

  const fetchReservas = async () => {
    try {
      const res = await axios.get('http://localhost:3001/reservas/reservas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filtramos solo las reservas con estado 'confirmada'
      const reservasConfirmadas = res.data.reservas.filter((r: any) => r.estado === 'confirmada');
      setReservas(reservasConfirmadas);
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
      toast.success('Reserva creada exitosamente');
      setPlatos((prevPlatos) =>
        prevPlatos.map((plato) =>
          plato.id_plato === idPlato
            ? { ...plato, cantidad_disponible: plato.cantidad_disponible - cantidad }
            : plato
        )
      );
      fetchReservas();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
      toast.error('Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelarReserva = async (reservaId: number, idPlato: number, cantidad: number) => {
    if (!isAuthenticated) {
      setError('No estás autenticado');
      return;
    }

    try {
      await axios.delete('http://localhost:3001/reservas/cancelar', {
        headers: { Authorization: `Bearer ${token}` },
        data: { reservaId },
      });
      toast.success('Reserva cancelada exitosamente');
      setPlatos((prevPlatos) =>
        prevPlatos.map((plato) =>
          plato.id_plato === idPlato
            ? { ...plato, cantidad_disponible: plato.cantidad_disponible + cantidad }
            : plato
        )
      );
      setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== reservaId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar la reserva');
      toast.error('Error al cancelar la reserva');
    }
  };

  const handlePlatoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platoId = Number(e.target.value);
    setIdPlato(platoId);
    const platoSeleccionado = platos.find((plato) => plato.id_plato === platoId);
    setPlatoSeleccionado(platoSeleccionado);
    setCantidad(1);
  };

  const toggleReservaDetails = (id: number) => {
    setExpandedReserva(expandedReserva === id ? null : id);
  };

  const isValidDate = (date: string) => {
    const selectedDate = new Date(date);
    const day = selectedDate.getDay();
    return day === 5 || day === 6 || day === 0;  // Viernes, sábado y domingo
  };

  const isValidTime = (time: string) => {
    const selectedTime = new Date(`1970-01-01T${time}:00`);
    const startTime = new Date('1970-01-01T14:00:00');  // 14:00 (2:00 PM)
    const endTime = new Date('1970-01-01T17:00:00');  // 17:00 (5:00 PM)
    return selectedTime >= startTime && selectedTime <= endTime;
  };

  const handleFechaReservaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    if (isValidDate(selectedDate) && isValidTime(selectedDate.slice(11, 16))) {
      // Convertir la fecha a la zona horaria +02:00 (sumar 2 horas)
      const dateWithOffset = new Date(new Date(selectedDate).getTime() + 2 * 60 * 60 * 1000); // +2 horas
      setFechaReserva(dateWithOffset.toISOString().slice(0, 19)); // Guardar en formato 'YYYY-MM-DDTHH:MM:SS'
    } else {
      toast.error('Solo puedes seleccionar viernes, sábado o domingo entre 2:00 PM y 5:00 PM.');
    }
  };

  const formatFechaConDescuento = (fecha: string) => {
    const reservaDate = new Date(fecha);
    reservaDate.setHours(reservaDate.getHours() - 2); // Restamos 2 horas
    return reservaDate.toLocaleString(); // Devolvemos la fecha en formato legible
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
    >
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 relative z-10">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">Realizar una reserva</h1>

        <p className="text-sm text-gray-600 mb-8 text-center">
          Si llegas más de 10 minutos tarde a tu reserva, esta será cancelada automáticamente. Por favor, sé puntual para asegurar tu lugar.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Realizar una nueva reserva</h2>
          <div className="mb-4">
            <label className="block text-gray-600">Selecciona el plato</label>
            <select
              value={idPlato}
              onChange={handlePlatoChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value={0}>Selecciona un plato</option>
              {platos.map((plato) => (
                <option key={plato.id_plato} value={plato.id_plato}>
                  {plato.nombre} - {plato.cantidad_disponible} disponible(s)
                </option>
              ))}
            </select>
          </div>
          {platoSeleccionado && (
            <div className="mb-4 text-center border p-4 shadow-sm rounded-lg">
              <img
                src={platoSeleccionado.imagen || 'default-image.jpg'}
                alt={platoSeleccionado.nombre}
                className="w-32 h-32 object-cover mx-auto mb-4"
              />
              <p className="font-semibold text-lg">{platoSeleccionado.nombre}</p>
              <p>{platoSeleccionado.descripcion}</p>
              <p className="mt-2 text-gray-600">Cantidad disponible: {platoSeleccionado.cantidad_disponible}</p>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-600">Cantidad</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              placeholder="Cantidad de platos"
              min="1"
              max={platoSeleccionado?.cantidad_disponible || 1}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Fecha y hora de la reserva</label>
            <input
              type="datetime-local"
              value={fechaReserva}
              onChange={handleFechaReservaChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />
            <p className="text-sm text-gray-600 mt-2">
              Solo se pueden seleccionar horarios de viernes, sábado o domingo entre 2:00 PM y 5:00 PM.
            </p>
          </div>
          <button
            onClick={handleCrearReserva}
            className={`w-full py-3 mt-4 bg-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creando reserva...' : 'Crear Reserva'}
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mis reservas confirmadas</h2>
          {reservas.length === 0 ? (
            <p>No tienes reservas confirmadas.</p>
          ) : (
            <ul className="space-y-4">
              {reservas.map((reserva) => {
                const platoReserva = platos.find(plato => plato.id_plato === reserva.id_plato);
                return (
                  <li key={reserva.id_reserva} className="p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-semibold">{platoReserva ? platoReserva.nombre : 'Plato no disponible'}</span>
                        <span className="text-sm text-gray-600">{formatFechaConDescuento(reserva.fecha_reserva)}</span>
                        <span className="text-sm text-gray-600">
                          Estado: <strong>{reserva.estado}</strong>
                        </span>
                      </div>
                      <button
                        className="text-blue-600 font-semibold"
                        onClick={() => toggleReservaDetails(reserva.id_reserva)}
                      >
                        {expandedReserva === reserva.id_reserva ? 'Ver menos' : 'Ver más'}
                      </button>
                    </div>
                    {expandedReserva === reserva.id_reserva && platoReserva && (
                      <div className="mt-4 transition-all ease-in-out duration-300">
                        <img
                          src={platoReserva.imagen || 'default-image.jpg'}
                          alt={platoReserva.nombre}
                          className="w-32 h-32 object-cover mb-4"
                        />
                        <p className="mt-2">{platoReserva.descripcion}</p>
                        <p className="mt-2">Cantidad reservada: {reserva.cantidad}</p>
                        <p className="mt-2 text-gray-600">Fecha de la reserva: {formatFechaConDescuento(reserva.fecha_reserva)}</p>
                      </div>
                    )}
                    <button
                      className="text-red-600 font-semibold mt-2 transform hover:scale-105 transition"
                      onClick={() => handleCancelarReserva(reserva.id_reserva, reserva.id_plato, reserva.cantidad)}
                    >
                      Cancelar Reserva
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ClienteDashboard;
