import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mono-footer">
      <div className="section-container">
        <div className="mono-footer-top">
          <div>
            <span className="mono-footer-brand">DYLAN PATERNINA</span>
            <p className="mono-footer-tagline">
              Estudiante de Ingeniería apasionado por la ingeniería de datos, cloud lakehouses y automatización.
            </p>
          </div>

          <div className="mono-footer-links">
            <a href="#proceso" className="mono-footer-link">Proceso</a>
            <a href="#proyectos" className="mono-footer-link">Proyectos</a>
            <a href="#habilidades" className="mono-footer-link">Habilidades</a>
            <a href="#contacto" className="mono-footer-link">Contacto</a>
          </div>
        </div>

        <div className="mono-footer-bottom">
          <span>© {new Date().getFullYear()} Dylan Paternina · Portafolio de Estudiante de Ingeniería de Datos.</span>
          <span>Diseño minimalista y animación matemática en Canvas.</span>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
