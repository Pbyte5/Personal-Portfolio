import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface StageInfo {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  whatItDoes: string;
  businessBenefit: string;
  teamBenefit: string;
  tools: string[];
}

export const ArchitecturePipeline: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const stages: StageInfo[] = [
    {
      id: 'recoleccion',
      num: '01',
      title: 'Recolección Continua',
      subtitle: 'Captura de fuentes sin pérdida de registros',
      whatItDoes: 'Conecto sistemas web, transacciones y registros de clientes para centralizar la información de la empresa de manera automática y sin interrupciones.',
      businessBenefit: 'La compañía nunca pierde el rastro de una venta, pago o movimiento operativo, sin importar el volumen simultáneo.',
      teamBenefit: 'Elimina las hojas de cálculo aisladas que provocan que cada departamento trabaje con números diferentes.',
      tools: ['Apache Kafka', 'Event Streams', 'Bases de Datos SQL', 'AWS / GCP']
    },
    {
      id: 'limpieza',
      num: '02',
      title: 'Limpieza y Filtrado',
      subtitle: 'Reglas automáticas de calidad y validación',
      whatItDoes: 'Diseño filtros que detectan duplicados, corrigen formatos erróneos y protegen la privacidad de datos sensibles antes de almacenar.',
      businessBenefit: 'Previene pérdidas económicas causadas por reportes con datos falsos o decisiones basadas en métricas incorrectas.',
      teamBenefit: 'Ahorra hasta 40 horas al mes a los analistas de negocio, quienes ya no tienen que depurar datos manualmente.',
      tools: ['Apache Spark', 'Python', 'dbt Modeling', 'Data Contracts']
    },
    {
      id: 'entrega',
      num: '03',
      title: 'Estructura para Decisión',
      subtitle: 'Tablas limpias y consultas en submilisegundos',
      whatItDoes: 'Organizo los datos en almacenes modernos (Data Lakehouse) diseñados para que cualquier reporte abra al instante.',
      businessBenefit: 'La dirección y gerencias consultan tableros en Power BI o Tableau con información actualizada al minuto.',
      teamBenefit: 'Acceso seguro, transparente y gobernado para toda la organización.',
      tools: ['Snowflake', 'Apache Iceberg', 'ClickHouse', 'Power BI / Tableau']
    }
  ];

  const current = stages[selectedIdx];

  return (
    <section id="proceso" className="mono-section">
      <div className="section-container">
        {/* Section Heading */}
        <div className="mono-section-head">
          <span className="mono-label">METODOLOGÍA DE TRABAJO</span>
          <h2 className="mono-section-title">
            El recorrido del dato: de la captura a la decisión.
          </h2>
          <p className="mono-section-sub">
            Una estructura clara en tres pasos para garantizar que la información sea exacta, segura y oportuna.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mono-steps-grid">
          {stages.map((st, i) => (
            <div
              key={st.id}
              onClick={() => setSelectedIdx(i)}
              className={`mono-step-card ${selectedIdx === i ? 'active' : ''}`}
            >
              <div className="mono-step-top">
                <span className="mono-step-index">{st.num}</span>
                <span className="mono-step-tag">Fase {i + 1}</span>
              </div>
              <h3 className="mono-step-card-title">{st.title}</h3>
              <p className="mono-step-card-sub">{st.subtitle}</p>

              <div className="mono-step-footer">
                <span>Ver detalles</span>
                <ArrowRight size={13} />
              </div>
            </div>
          ))}
        </div>

        {/* Inspector Panel */}
        <div className="mono-detail-panel">
          <div className="mono-detail-grid">
            <div className="mono-detail-left">
              <span className="mono-detail-kicker">Fase {current.num} // {current.title}</span>
              <h3 className="mono-detail-heading">{current.whatItDoes}</h3>

              <div className="mono-benefits-list">
                <div className="mono-benefit-item">
                  <Check size={16} className="mono-icon-check" />
                  <div>
                    <strong className="mono-benefit-title">Impacto en el negocio: </strong>
                    <span className="mono-benefit-text">{current.businessBenefit}</span>
                  </div>
                </div>

                <div className="mono-benefit-item">
                  <Check size={16} className="mono-icon-check" />
                  <div>
                    <strong className="mono-benefit-title">Impacto en los equipos: </strong>
                    <span className="mono-benefit-text">{current.teamBenefit}</span>
                  </div>
                </div>
              </div>

              <div className="mono-chips-row">
                <span className="mono-chips-label">Tecnologías clave:</span>
                {current.tools.map(t => (
                  <span key={t} className="mono-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mono-detail-right">
              <div className="mono-quote-box">
                <span className="mono-quote-label">GARANTÍA DE ARQUITECTURA</span>
                <p className="mono-quote-text">
                  "Todo flujo se diseña con tolerancia a fallos y validación automática. Si una fuente externa cambia de formato, el sistema aísla el error y notifica sin detener la operación."
                </p>
                <div className="mono-quote-footer">
                  <span>Arquitectura Idempotente</span>
                  <span>Disponibilidad 99.98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ArchitecturePipeline;
