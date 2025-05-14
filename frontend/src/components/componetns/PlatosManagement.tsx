import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PlatosManagement: React.FC = () => {
  const [platos, setPlatos] = useState<any[]>([]);
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cantidadDisponible: 0,
    imagen: null as File | null,
    imagenUrl: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editPlatoId, setEditPlatoId] = useState<number | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [platoToDelete, setPlatoToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const baseURL = 'http://localhost:3001/platos';
  const navigate = useNavigate();

  // Verificar token y rol al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Aquí se asume que el rol está guardado en localStorage
    if (token && userRole) {
      setRole(userRole); // Si el token y el rol existen, asignar el rol
    } else {
      toast.error('No estás autenticado');
      navigate('/login'); // Si no hay token, redirigir al login
    }

    const fetchPlatos = async () => {
      try {
        const response = await axios.get(`${baseURL}/available`);
        setPlatos(response.data);
      } catch (error) {
        setErrorMessage('Error al obtener los platos');
        console.error('Error al obtener los platos', error);
      }
    };

    fetchPlatos();
  }, [navigate]);

  // Filtro por nombre
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombreFiltro(e.target.value);
  };

  // Manejo de eliminación de un plato
  const handleDelete = async () => {
    if (platoToDelete !== null) {
      try {
        await axios.delete(`${baseURL}/delete/${platoToDelete}`);
        setPlatos(platos.filter((plato) => plato.id !== platoToDelete));
        setShowConfirmDelete(false);
        setSuccessMessage('Plato eliminado exitosamente');
      } catch (error) {
        setErrorMessage('Error al eliminar el plato');
        console.error('Error al eliminar el plato', error);
      }
    }
  };

  // Manejo de la edición de un plato
  const handleEditClick = (plato: any) => {
    setFormData({
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      cantidadDisponible: plato.cantidad_disponible,
      imagen: null,
      imagenUrl: plato.imagen || '',
    });
    setEditPlatoId(plato.id);
    setEditMode(true);
  };

  // Cambio en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Cambio de la imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        imagen: files[0],
        imagenUrl: '',
      }));
    }
  };

  // Cambio en la URL de la imagen
  const handleImagenUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      imagenUrl: e.target.value,
      imagen: null,
    }));
  };

  // Enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nombre, descripcion, cantidadDisponible, imagen, imagenUrl } = formData;

    const form = new FormData();
    form.append('nombre', nombre);
    form.append('descripcion', descripcion);
    form.append('cantidad_disponible', cantidadDisponible.toString());

    if (imagenUrl) {
      form.append('imagen_url', imagenUrl);
    } else if (imagen) {
      form.append('imagen', imagen);
    }

    try {
      if (editMode && editPlatoId) {
        await axios.put(`${baseURL}/update/${editPlatoId}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccessMessage('Plato actualizado exitosamente');
      } else {
        await axios.post(`${baseURL}/add`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSuccessMessage('Plato añadido exitosamente');
      }

      // Refrescar la lista de platos
      const response = await axios.get(`${baseURL}/available`);
      setPlatos(response.data);

      setFormData({
        nombre: '',
        descripcion: '',
        cantidadDisponible: 0,
        imagen: null,
        imagenUrl: '',
      });
      setEditMode(false);
      setEditPlatoId(null);
    } catch (error) {
      setErrorMessage('Error al guardar el plato');
      console.error('Error al guardar el plato', error);
    }
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm z-[-1]"
        style={{ backgroundImage: 'url("https://via.placeholder.com/1500")' }}
      ></div>

      <div className="container mx-auto py-10 px-4 z-10 relative max-w-5xl">
        <h2 className="text-center text-white mb-6 text-3xl">Gestión de Platos</h2>

        <input
          type="text"
          placeholder="Filtrar por nombre"
          value={nombreFiltro}
          onChange={handleFilterChange}
          className="w-full p-3 mb-6 rounded-md border border-gray-300 focus:outline-none"
        />

        {errorMessage && (
          <div className="alert bg-red-500 text-white p-4 rounded-lg mt-4 text-center">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert bg-green-500 text-white p-4 rounded-lg mt-4 text-center">
            {successMessage}
          </div>
        )}

        {role === 'camarero' && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-sm md:text-base">
                  <th className="py-3 px-2 md:px-4">Nombre</th>
                  <th className="py-3 px-2 md:px-4">Descripción</th>
                  <th className="py-3 px-2 md:px-4">Cantidad Disponible</th>
                  <th className="py-3 px-2 md:px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {platos
                  .filter((plato) =>
                    plato.nombre.toLowerCase().includes(nombreFiltro.toLowerCase())
                  )
                  .map((plato) => (
                    <tr key={plato.id} className="text-sm md:text-base">
                      <td className="py-2 px-2 md:px-4 border-b">{plato.nombre}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{plato.descripcion}</td>
                      <td className="py-2 px-2 md:px-4 border-b">{plato.cantidad_disponible}</td>
                      <td className="py-2 px-2 md:px-4 border-b flex flex-col md:flex-row items-start md:items-center gap-2">
                        <button
                          className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600"
                          onClick={() => handleEditClick(plato)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                          onClick={() => {
                            setPlatoToDelete(plato.id);
                            setShowConfirmDelete(true);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {showConfirmDelete && (
          <div className="alert bg-yellow-500 text-white p-4 rounded-lg mt-4 text-center">
            <p className="mb-2">¿Seguro que quieres eliminar este plato?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
                onClick={handleDelete}
              >
                Confirmar
              </button>
              <button
                className="bg-gray-600 text-white py-2 px-4 rounded-lg"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {role === 'camarero' && (
          <h3 className="text-white text-xl mt-8">{editMode ? 'Editar Plato' : 'Añadir Plato'}</h3>
        )}

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          {/* Formulario */}
        </form>
      </div>
    </div>
  );
};

export default PlatosManagement;
