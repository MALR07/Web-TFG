import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:3001/auth/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar el correo');
    }
  };

  return (
    <section
      id="forgot-password"
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
        <h2 className="text-4xl font-semibold text-gray-800 mb-6 text-center">Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu correo electrónico"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Enviar enlace de recuperación
          </button>
        </form>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </section>
  );
};

export default ForgotPassword;
