import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    opportunityType: 'Prácticas Profesionales / Pasantía',
    message: ''
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="mono-section">
      <div className="section-container">
        {/* Section Heading */}
        <div className="mono-section-head">
          <span className="mono-label">CONTACTO & OPORTUNIDADES</span>
          <h2 className="mono-section-title">
            Iniciemos una conversación.
          </h2>
          <p className="mono-section-sub">
            Estudiante de Ingeniería disponible para pasantías, prácticas profesionales o vacantes de inicio en ingeniería de datos y desarrollo cloud.
          </p>
        </div>

        {/* 2-Column Minimalist Grid */}
        <div className="mono-contact-grid">
          {/* Left Column: Direct Info & CV */}
          <div className="mono-contact-card">
            <span className="mono-contact-kicker">INFORMACIÓN DE CONTACTO</span>
            <h3 className="mono-contact-heading">Canales Directos</h3>

            <div className="mono-contact-list">
              <div className="mono-contact-row">
                <span className="mono-contact-lbl">Correo Electrónico</span>
                <a href="mailto:dylan.paternina@ejemplo.com" className="mono-contact-val-link">
                  dylan.paternina@ejemplo.com
                </a>
              </div>

              <div className="mono-contact-row">
                <span className="mono-contact-lbl">LinkedIn</span>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="mono-contact-val-link">
                  linkedin.com/in/dylan-paternina
                </a>
              </div>

              <div className="mono-contact-row">
                <span className="mono-contact-lbl">Modalidad</span>
                <span className="mono-contact-val">Remoto / Híbrido / Presencial</span>
              </div>

              <div className="mono-contact-row">
                <span className="mono-contact-lbl">Disponibilidad</span>
                <span className="mono-contact-val">Pasantías / Medio tiempo / Tiempo completo</span>
              </div>
            </div>

            {/* CV Download Minimalist Box */}
            <div className="mono-cv-card">
              <span className="mono-cv-label">CURRICULUM VITAE</span>
              <h4 className="mono-cv-title">Hoja de Vida & Proyectos (PDF)</h4>
              <p className="mono-cv-sub">
                Detalle académico, proyectos prácticos de ingeniería de datos y tecnologías dominadas.
              </p>
              <button
                onClick={() => alert('Descarga de CV iniciada')}
                className="btn-mono-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Descargar CV en PDF
              </button>
            </div>
          </div>

          {/* Right Column: Dispatch Form */}
          <div className="mono-form-card">
            <span className="mono-contact-kicker">MENSAJE DIRECTO</span>
            <h3 className="mono-contact-heading">Solicitar Entrevista o Detalles</h3>

            {submitted ? (
              <div className="mono-success-box">
                <div className="mono-success-icon">
                  <Check size={24} />
                </div>
                <h4 className="mono-success-title">Mensaje Enviado</h4>
                <p className="mono-success-sub">
                  Gracias por tu interés. Responderé a tu correo en menos de 24 horas hábiles.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-mono-secondary"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mono-form">
                <div className="mono-form-row">
                  <div className="mono-input-group">
                    <label className="mono-input-label">NOMBRE / RECLUTADOR</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Ana Morales"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mono-text-input"
                    />
                  </div>

                  <div className="mono-input-group">
                    <label className="mono-input-label">CORREO ELECTRÓNICO</label>
                    <input
                      type="email"
                      required
                      placeholder="ana@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mono-text-input"
                    />
                  </div>
                </div>

                <div className="mono-input-group">
                  <label className="mono-input-label">EMPRESA O PROYECTO</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. FinTech Global / Retail Corp"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mono-text-input"
                  />
                </div>

                <div className="mono-input-group">
                  <label className="mono-input-label">TIPO DE OPORTUNIDAD</label>
                  <select
                    value={formData.opportunityType}
                    onChange={(e) => setFormData({ ...formData, opportunityType: e.target.value })}
                    className="mono-select-input"
                  >
                    <option value="Prácticas Profesionales / Pasantía">Prácticas Profesionales / Pasantía</option>
                    <option value="Vacante Junior / Trainee">Vacante Junior / Trainee</option>
                    <option value="Proyecto Práctico / Freelance">Proyecto Práctico / Freelance</option>
                    <option value="Llamada de Exploración / Networking">Llamada de Exploración / Networking</option>
                  </select>
                </div>

                <div className="mono-input-group">
                  <label className="mono-input-label">DETALLES DE LA VACANTE O MENSAJE</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Cuéntame sobre las metas del equipo de datos o los requisitos de la posición..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mono-textarea-input"
                  />
                </div>

                <button type="submit" className="btn-mono-primary-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Enviar Mensaje</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
