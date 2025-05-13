import React from 'react';
import '../../App.css';  

import ForgotPassword from '../login/ForgotPassword';
const App = () => {
  return (
      <div className="font-sans bg-gray-50 text-gray-900">
        <main className="container mx-auto py-8">
          <div className="flex justify-center">
            <ForgotPassword/>
          </div>
        </main>
      </div>
  );
}

export default App;
