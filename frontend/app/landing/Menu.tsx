const Menu = () => {
    return (
      <section id="carta" className="py-16 px-4 bg-gray-100 text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Carta a un QR</h2>
        <p className="text-lg text-gray-600 mb-8">Escanea el código QR para ver nuestra carta completa en línea.</p>
        {/* Aquí va tu QR */}
        <div className="bg-gray-300 w-32 h-32 mx-auto mb-8"></div>
        <p className="text-lg text-gray-600">¡Haz tu pedido fácilmente desde tu móvil!</p>
      </section>
    );
  };
  
  export default Menu;
  