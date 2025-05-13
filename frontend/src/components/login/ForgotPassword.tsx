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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Recuperar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu correo electrónico"
          className="w-full p-3 border mb-3 rounded"
          required
        />
        <button className="bg-blue-500 text-white w-full p-3 rounded hover:bg-blue-600">
          Enviar enlace de recuperación
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
