import "./style.css";

function navbar() {
  return (
    <div className="header-nav-container">
      <p className="service-item-text-style">Servicios</p>
      <p className="service-item-text-style">Obituarios</p>
      <p className="service-item-text-style">Contacto</p>
      <div className="login-container">
        <p className="golden-text">Log in</p>
      </div>
    </div>
  );
}

export default navbar;