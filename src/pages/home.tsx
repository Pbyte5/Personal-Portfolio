import { useState } from 'react';
import Header from '../components/Header';
import DataPipelineCanvas from '../components/DataPipelineCanvas';
import ArchitecturePipeline from '../components/ArchitecturePipeline';
import ProjectsSection from '../components/ProjectsSection';
import TechStackGrid from '../components/TechStackGrid';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { ArrowRight, FileText } from 'lucide-react';
import './home.css';

export default function Home() {
  const [photoUrl, setPhotoUrl] = useState<string>('/profile.jpg');

  return (
    <div className="portfolio-app-root">
      {/* 1. Header Minimalista */}
      <Header />

      {/* 2. Hero Section: Animación Binaria Pura de Fondo con Texto Lateral */}
      <section id="hero" className="hero-fullscreen-section">
        {/* Fondo interactivo con animación binaria pura (sin botones ni recuadros) */}
        <DataPipelineCanvas />

        <div className="section-container hero-content-container">
          <div className="hero-split-layout">
            
            {/* Lateral Izquierdo: Mensaje, Perfil y Acciones */}
            <div className="hero-lateral-text">
              {/* Perfil Compacto en Una Sola Línea con Círculo Tipo Red Social (Sin Recuadro Gris) */}
              <div className="hero-inline-profile">
                <div className="hero-avatar-circle" title="Click para cambiar foto">
                  <img
                    src={photoUrl}
                    alt="Foto de perfil - Dylan Paternina"
                    className="hero-avatar-circle-img"
                    onError={() => setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')}
                  />
                  <label className="hero-avatar-upload-overlay" htmlFor="hero-photo-input" title="Cambiar foto">
                    <span>+</span>
                    <input
                      id="hero-photo-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPhotoUrl(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="hero-inline-meta">
                  <span className="hero-inline-name">Dylan Paternina</span>
                  <span className="hero-inline-divider">/</span>
                  <span className="hero-inline-role">Estudiante de Ingeniería · Datos & Cloud</span>
                </div>
              </div>
              
              <h1 className="hero-lateral-title">
                Transformo el desorden de datos en estructura limpia.
              </h1>

              <p className="hero-lateral-subtitle">
                Estudiante apasionado por la ingeniería de datos, el modelado y la automatización en la nube. 
                Construyendo proyectos prácticos para convertir datos caóticos en información clara, estructurada y confiable.
              </p>

              {/* Botones de acción ubicados bien abajo */}
              <div className="hero-lateral-actions hero-actions-lower">
                <a href="#contacto" className="btn-mono-primary-lg">
                  <FileText size={16} />
                  <span>Solicitar Entrevista / CV</span>
                </a>
                <a href="#proyectos" className="btn-mono-secondary-lg">
                  <span>Ver Proyectos</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Lateral Derecho: Área despejada para dar total visibilidad a las figuras de binarios */}
            <div className="hero-stage-spacer" aria-hidden="true" />

          </div>
        </div>
      </section>

      {/* 3. El Proceso Explicado en 3 Fases Minimalistas */}
      <ArchitecturePipeline />

      {/* 4. Casos Reales de Negocio */}
      <ProjectsSection />

      {/* 5. Habilidades y Tecnologías */}
      <TechStackGrid />

      {/* 6. Contacto y CV */}
      <ContactSection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
