import React, { useState } from 'react';
import './ObituarioCard.css';

type ObituarioProps = {
  titulo: string;
  mensaje?: string;
  imagen_url?: string;
};

const ObituarioCard: React.FC<ObituarioProps> = ({ titulo, mensaje, imagen_url }) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="obituario-card">
      <div className="photo-container">
        {imagen_url ? (
          <img src={imagen_url} alt={titulo} className="photo" />
        ) : (
          'Foto'
        )}
      </div>

      <div className="content-container">
        <h1 className="name">{titulo}</h1>

        <p className="description">
          {mensaje || 'Sin mensaje de obituario disponible.'}
        </p>

        <div className="buttons-container">
          <button
            className={`button ${hoveredButton === 'compartir' ? 'hover' : ''}`}
            onMouseEnter={() => setHoveredButton('compartir')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Compartir
          </button>
          <button
            className={`button ${hoveredButton === 'condolencias' ? 'hover' : ''}`}
            onMouseEnter={() => setHoveredButton('condolencias')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Condolencias
          </button>
        </div>
      </div>
    </div>
  );
};

export default ObituarioCard;

