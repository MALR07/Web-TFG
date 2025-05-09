const Dishes = () => {
    return (
      <section id="platos" className="py-16 px-4 bg-white text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Nuestros Platos</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Aquí van las imágenes de tus platos */}
          <div className="h-48 bg-gray-300"></div>
          <div className="h-48 bg-gray-300"></div>
          <div className="h-48 bg-gray-300"></div>
        </div>
      </section>
    );
  };
  
  export default Dishes;
  