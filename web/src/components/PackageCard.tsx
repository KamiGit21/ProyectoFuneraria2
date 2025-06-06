
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PackageCard.css';

interface Servicio {
  nombre: string;
  descripcion: string;
  precio_base: string;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  categoria_id: number;
}

interface PackageCardProps {
  servicio: Servicio;
  imagen?: string;
  onVerPaquete?: (servicio: Servicio) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  servicio,
  imagen,
  onVerPaquete
}) => {
  const navigate = useNavigate();

  const handleVerPaquete = () => {
    // First, if onVerPaquete exists, call it with the service
    if (onVerPaquete) {
      onVerPaquete(servicio);
    }
    
    // Navigate to the services catalog filtered by this service's category
    navigate(`/servicios/cat/${servicio.categoria_id}`);
  };

  return (
    <div className="package-card">
      <h2 className="package-title">{servicio.nombre}</h2>
      <div className="package-image">
        {imagen ? <img src={imagen} alt={servicio.nombre} /> : 'Imagen'}
      </div>
      <div className="services-and-description">
        <p className="package-description">{servicio.descripcion}</p>
      </div>
      <div className="package-footer">
        <span className="package-price">Precio: ${servicio.precio_base}</span>
        <button className="view-package-btn" onClick={handleVerPaquete}>Ver servicios</button>
      </div>
    </div>
  );
};

export default PackageCard;