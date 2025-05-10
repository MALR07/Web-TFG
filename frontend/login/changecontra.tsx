import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
    } else {
      setError("");
      // Lógica para enviar el email de recuperación
      setMessage("Si ese correo está registrado, recibirás instrucciones para restablecer tu contraseña.");
    }
  };

  return (
    <section id="forgot-password" className="py-16 px-4 bg-gray-100 text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Recuperar Contraseña</h2>

      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <div className="mb-4">
            <label htmlFor="email" className="block text-left text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe tu correo"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Enviar Instrucciones
          </button>
        </form>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            ¿Recuerdas tu contraseña? <a href="/login" className="text-blue-500 hover:underline">Inicia sesión aquí</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
