import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Interfaces para los datos
interface User {
  nombre: string;
}

interface Plato {
  nombre: string;
}

interface Comment {
  comentario: string;
  User?: User;
  puntuacion: number;
  Plato: Plato;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]); // Estado para almacenar los comentarios
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [page, setPage] = useState(1); // Estado para manejar la página actual
  const [commentsPerPage] = useState(2); // Número de comentarios por página
  const [maxPages, setMaxPages] = useState(1); // Máximo número de páginas

  // Función para obtener los comentarios desde la API
  const fetchComments = () => {
    axios
      .get<Comment[]>(`http://localhost:3001/comentarios`) // Obtener los comentarios de la API
      .then((response) => {
        setComments(response.data);
        setMaxPages(Math.ceil(response.data.length / commentsPerPage)); // Establecer el número máximo de páginas
      })
      .catch((error) => {
        console.error('Error al obtener los comentarios:', error);
        setError('Error al obtener los comentarios');
      });
  };

  useEffect(() => {
    fetchComments(); // Cargar los comentarios cuando el componente se monta
  }, []);

  // Obtener los comentarios de la página actual
  const currentComments = comments.slice(
    (page - 1) * commentsPerPage,
    page * commentsPerPage
  );

  // Manejo de la paginación
  const handleNextPage = () => {
    if (page < maxPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="mt-8 py-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h4 className="text-3xl font-semibold text-center text-gray-800 mb-6">Comentarios:</h4>
      
      {/* Si hay un error al cargar los comentarios, lo mostramos */}
      {error && <p className="text-center text-red-500 text-lg mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentComments.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No hay comentarios aún.</p>
        ) : (
          currentComments.map((comment, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md text-center transition-all transform hover:scale-105"
            >
              <p className="text-xl text-gray-700 italic mb-4">"{comment.comentario}"</p>
              <p className="mt-2 text-gray-600">
                - <span className="font-semibold">{comment.User?.nombre || 'Anónimo'}</span>
              </p>
              <div className="mt-2 text-yellow-400">
                {typeof comment.puntuacion === 'number' && comment.puntuacion > 0
                  ? '⭐'.repeat(comment.puntuacion) // Mostrar estrellas
                  : 'Sin puntuación'}
              </div>
              <p className="mt-2 text-sm text-gray-500">Plato: {comment.Plato.nombre}</p> {/* Mostrar el nombre del plato */}
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Anterior
        </button>
        <span className="text-lg text-gray-700">
          Página {page} de {maxPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === maxPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Comment;
