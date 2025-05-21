import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../components/componetns/AuthContext.tsx';

const CamareroComentarios = () => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [busquedaPlato, setBusquedaPlato] = useState('');
  const [busquedaIdUsuario, setBusquedaIdUsuario] = useState('');
  const [busquedaIdComentario, setBusquedaIdComentario] = useState('');
  const [busquedaPuntuacion, setBusquedaPuntuacion] = useState('');
  const [busquedaFecha, setBusquedaFecha] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('desc');
  const [ordenPuntuacion, setOrdenPuntuacion] = useState('desc');

  const [paginaActual, setPaginaActual] = useState(1);
  const comentariosPorPagina = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        const res = await axios.get('http://localhost:3001/comentarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComentarios(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error al cargar los comentarios", error);
        toast.error("Error al cargar comentarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchComentarios();
  }, [token]);

  const eliminarComentario = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) return;

    try {
      await axios.delete(`http://localhost:3001/comentarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComentarios(comentarios.filter(c => c.id_comentario !== id));
      toast.success("Comentario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      toast.error("No tienes permiso para eliminar este comentario.");
    }
  };

  const comentariosFiltrados = comentarios
    .filter(com => {
      const usuarioNombre = com.User?.nombre?.toLowerCase() || '';
      const platoNombre = com.Plato?.nombre?.toLowerCase() || '';
      const fechaComentario = new Date(com.fecha_comentario).toISOString().split('T')[0];

      return (
        usuarioNombre.includes(busquedaUsuario.toLowerCase()) &&
        platoNombre.includes(busquedaPlato.toLowerCase()) &&
        (busquedaIdUsuario === '' || com.User?.id_user == busquedaIdUsuario) &&
        (busquedaIdComentario === '' || com.id_comentario == busquedaIdComentario) &&
        (busquedaPuntuacion === '' || com.puntuacion == busquedaPuntuacion) &&
        (busquedaFecha === '' || fechaComentario === busquedaFecha)
      );
    })
    .sort((a, b) => {
      const fechaA = new Date(a.fecha_comentario);
      const fechaB = new Date(b.fecha_comentario);

      if (ordenFecha === 'asc') {
        return fechaA - fechaB;
      } else if (ordenFecha === 'desc') {
        return fechaB - fechaA;
      }

      if (ordenPuntuacion === 'asc') {
        return a.puntuacion - b.puntuacion;
      } else if (ordenPuntuacion === 'desc') {
        return b.puntuacion - a.puntuacion;
      }

      return 0;
    });

  const totalPaginas = Math.ceil(comentariosFiltrados.length / comentariosPorPagina);
  const inicio = (paginaActual - 1) * comentariosPorPagina;
  const comentariosPaginados = comentariosFiltrados.slice(inicio, inicio + comentariosPorPagina);

  if (!user || user.rol !== 'camarero') {
    return (
      <section className="py-16 text-center">
        <p className="text-xl text-red-600">No tienes acceso a esta página.</p>
      </section>
    );
  }

  return (
    <section
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
      <div className="w-full max-w-4xl lg:max-w-5xl bg-white shadow-xl rounded-lg p-6 sm:p-8 relative z-10">
        <ToastContainer position="bottom-right" autoClose={3000} />
        <h2 className="text-3xl font-semibold text-yellow-500 text-center mb-8">Gestión de Comentarios</h2>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre de usuario"
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-yellow-500 transition"
            value={busquedaUsuario}
            onChange={(e) => { setBusquedaUsuario(e.target.value); setPaginaActual(1); }}
          />
          <input
            type="text"
            placeholder="Buscar por nombre de plato"
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-yellow-500 transition"
            value={busquedaPlato}
            onChange={(e) => { setBusquedaPlato(e.target.value); setPaginaActual(1); }}
          />
          <input
            type="text"
            placeholder="ID de usuario"
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-yellow-500 transition"
            value={busquedaIdUsuario}
            onChange={(e) => { setBusquedaIdUsuario(e.target.value); setPaginaActual(1); }}
          />
          <select
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-yellow-500 transition"
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value)}
          >
            <option value="desc">Ordenar por fecha: Más recientes</option>
            <option value="asc">Ordenar por fecha: Más antiguas</option>
          </select>
          <select
            className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-yellow-500 transition"
            value={ordenPuntuacion}
            onChange={(e) => setOrdenPuntuacion(e.target.value)}
          >
            <option value="desc">Ordenar por puntuación: Más altas</option>
            <option value="asc">Ordenar por puntuación: Más bajas</option>
          </select>
        </div>

        {/* Comentarios */}
        {loading ? (
          <p className="text-gray-600 text-center">Cargando comentarios...</p>
        ) : comentariosPaginados.length === 0 ? (
          <p className="text-gray-600 text-center">No hay comentarios coincidentes.</p>
        ) : (
          <div className="space-y-6">
            {comentariosPaginados.map(com => (
              <div key={com.id_comentario} className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-xl">{com.User?.nombre} (ID: {com.User?.id_user})</p>
                    <p className="text-sm text-gray-600">Sobre el plato: {com.Plato?.nombre} (ID: {com.Plato?.id_plato})</p>
                    <p className="italic text-gray-700">"{com.comentario}"</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Puntuación: <span className="font-semibold">{com.puntuacion}</span> | Fecha: {new Date(com.fecha_comentario).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => eliminarComentario(com.id_comentario)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="mt-10 flex justify-center gap-6">
            <button
              onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Anterior
            </button>
            <span className="text-gray-700">Página {paginaActual} de {totalPaginas}</span>
            <button
              onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CamareroComentarios;
