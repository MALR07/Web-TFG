import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/auth/reset-password', {
        token,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al restablecer la contraseña');
    }
  };

  return (
    <section
      id="reset-password"
      className="min-h-screen flex justify-center items-center bg-gray-100 py-16 px-4 relative"
    >
      {/* Fondo con imagen y desenfoque */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 backdrop-blur-md"
        style={{
          backgroundImage: "url('/fondoreserva.jpeg')", // Reemplaza esta URL con tu imagen
        }}
      ></div>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg relative z-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Nueva Contraseña</h2>

        <form onSubmit={handleReset}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-left text-gray-700">Nueva Contraseña</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu nueva contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Restablecer Contraseña
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </section>
  );
};

export default ResetPassword;
