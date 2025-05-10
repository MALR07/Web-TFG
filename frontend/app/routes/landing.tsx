import React from 'react';
import '../app.css';  

// Importar los componentes que ya tienes creados
import Header from '../landing/Header';
import WhoWeAre from '../landing/WhoWeAre';
import History from '../landing/History';
import Events from '../landing/Events';
import Gallery from '../landing/Gallery';
import Video from '../landing/Video';
import Dishes from '../landing/Dishes';
import Menu from '../landing/Menu';
import Comment from '../landing/Comment';
import Footer from '../landing/Footer';

const App = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-900">
      {/* Header del sitio */}
      <Header />

    {/* Quiénes Somos */}
       <WhoWeAre />

      {/* Historia */}
       <History />

      {/* Eventos */}
        <Events />

      {/* Galería */}
      <Gallery />

      {/* Videos */}
       <Video />
    
     {/* Menú */}
        <Menu />

      {/* Platos del Menú */}
       <Dishes />

      {/* Comentarios */}
      <Comment />

      {/* Pie de página */}
     <Footer /> 
    </div>
  );
}

export default App;
