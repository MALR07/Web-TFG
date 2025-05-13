// components/AccessDenied.tsx

import React from 'react';

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="text-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-red-500">Acceso Denegado</h2>
        <p className="mt-4 text-xl text-gray-700">No tienes permisos para acceder a esta sección.</p>
        <p className="mt-4 text-lg text-gray-500">Si crees que esto es un error, contacta con el administrador.</p>
      </div>
    </div>
  );
};

export default AccessDenied;
