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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Nueva Contraseña</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 border mb-3 rounded"
          required
        />
        <button className="bg-green-600 text-white w-full p-3 rounded hover:bg-green-700">
          Restablecer Contraseña
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ResetPassword;
