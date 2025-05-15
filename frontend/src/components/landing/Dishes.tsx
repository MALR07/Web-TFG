import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Definir la interfaz de los datos del plato
interface Dish {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

const DishList = () => {
  const [dishes, setDishes] = useState<Dish[]>([]); // Tipamos dishes como un array de Dish
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<Dish[]>('http://localhost:3001/platos/available') // Tipamos la respuesta de Axios
      .then(response => setDishes(response.data))
      .catch(error => {
        console.error("Error al obtener los platos:", error);
        setError('Error al obtener los platos');
      });
  }, []);

  return (
    <div className="py-16 px-8 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Platos Disponibles</h2>

      {error && <p className="text-red-500 text-center text-xl mb-6">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <img
               src={
                    dish.imagen && dish.imagen.startsWith('http') 
                   ? dish.imagen // Si es una URL externa, la usamos directamente
                     : `http://localhost:3001${dish.imagen || '/default-image.jpg'}` // Si es una imagen local, la buscamos en el backend
                }   
                  alt={dish.nombre}
              className="w-full h-48 object-cover rounded-xl mb-4"
                        />
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{dish.nombre}</h3>
            <p className="text-sm text-gray-500 text-center">{dish.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishList;