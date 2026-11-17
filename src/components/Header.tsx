import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mono-header">
      <div className="mono-header-container">
        {/* Minimal Brand Identity */}
        <a href="#hero" className="mono-brand">
          <span className="mono-brand-title">DYLAN PATERNINA</span>
          <span className="mono-brand-sub">ESTUDIANTE DE INGENIERÍA · DATOS & CLOUD</span>
        </a>

        {/* Minimal Navigation */}
        <nav className="mono-nav">
          <a href="#proceso" className="mono-nav-link">Proceso</a>
          <a href="#proyectos" className="mono-nav-link">Casos Reales</a>
          <a href="#habilidades" className="mono-nav-link">Habilidades</a>
          <a href="#contacto" className="mono-nav-link">Contacto</a>
        </nav>

        {/* Action Button: Clean, borderless solid white button */}
        <div className="mono-header-cta">
          <a href="#contacto" className="btn-mono-primary">
            Contactar
          </a>
        </div>
      </div>
    </header>
  );
};
export default Header;
