import React from 'react';

const Videos = () => {
  return (
    <section id="videos" className="py-16 px-4 bg-white text-center">
      <h2 className="text-4xl font-semibold text-gray-800 mb-6">Videos</h2>
      <div className="flex justify-center space-x-6">
        {/* Video de Verbena 2024 */}
        <div className="w-1/3 group relative">
          <div className="bg-gray-300 rounded-lg overflow-hidden hover:scale-110 transition-transform duration-300">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/videoID2024" // Reemplaza con el ID del video de YouTube
              title="Verbena 2024"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-2 text-lg text-gray-800">Verbena 2024</p>
          {/* Botón de ampliar */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href="https://www.youtube.com/watch?v=videoID2024" // Enlace directo a YouTube para ver el video completo
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en YouTube
            </a>
          </div>
        </div>

        {/* Video de Verbena 2023 */}
        <div className="w-1/3 group relative">
          <div className="bg-gray-300 rounded-lg overflow-hidden hover:scale-110 transition-transform duration-300">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/videoID2023" // Reemplaza con el ID del video de YouTube
              title="Verbena 2023"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-2 text-lg text-gray-800">Verbena 2023</p>
          {/* Botón de ampliar */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
            <a
              href="https://www.youtube.com/watch?v=videoID2023" // Enlace directo a YouTube para ver el video completo
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Videos;
