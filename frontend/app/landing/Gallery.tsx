const Gallery = () => {
    return (
      <section id="galeria" className="py-16 px-4 bg-gray-100 text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Galería</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Aquí van las imágenes de tu galería */}
          <div className="h-48 bg-gray-300"></div>
          <div className="h-48 bg-gray-300"></div>
          <div className="h-48 bg-gray-300"></div>
        </div>
      </section>
    );
  };
  
  export default Gallery;
  