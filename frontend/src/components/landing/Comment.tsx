import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Interfaces para los datos
interface User {
  nombre: string;
}

interface Comment {
  comentario: string;
  User?: User;
  puntuacion: number;
}

const Comment: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]); // Estado para almacenar los comentarios
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores

  // Función para obtener los comentarios desde la API
  const fetchComments = () => {
    axios
      .get<Comment[]>('http://localhost:3001/comentarios') // Tipamos la respuesta como un array de Comment
      .then((response) => {
        // Mezcla de los comentarios utilizando el algoritmo de Fisher-Yates
        const shuffled = [...response.data]; // Copia del array original para evitar modificar el original
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Intercambia elementos
        }
        setComments(shuffled); // Actualizamos el estado con los comentarios aleatorios
      })
      .catch((error) => {
        console.error('Error al obtener los comentarios:', error);
        setError('Error al obtener los comentarios');
      });
  };

  useEffect(() => {
    fetchComments(); // Cargar los comentarios cuando el componente se monta
  }, []); // Este efecto solo se ejecuta una vez cuando el componente se monta

  return (
    <div className="mt-8 py-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h4 className="text-3xl font-semibold text-center text-gray-800 mb-6">Comentarios:</h4>
      {/* Si hay un error al cargar los comentarios, lo mostramos */}
      {error && <p className="text-center text-red-500 text-lg mb-6">{error}</p>}

      <ul className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No hay comentarios aún.</p> // Mensaje si no hay comentarios
        ) : (
          comments.map((comment, idx) => (
            <li key={idx} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
              <p className="text-xl text-gray-700 italic mb-4">"{comment.comentario}"</p>
              <p className="mt-2 text-gray-600">
                - <span className="font-semibold">{comment.User?.nombre || 'Anónimo'}</span>
              </p>
              <div className="mt-2 text-yellow-400">
                {typeof comment.puntuacion === 'number' && comment.puntuacion > 0
                  ? '⭐'.repeat(comment.puntuacion) // Solo muestra estrellas si la puntuación es un número positivo
                  : 'Sin puntuación'}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Comment;
