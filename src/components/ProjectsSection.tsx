import React, { useState } from 'react';

interface ProjectStory {
  id: string;
  name: string;
  category: string;
  role: string;
  problem: string;
  action: string;
  metrics: { value: string; label: string }[];
  result: string;
  technologies: string[];
}

export const ProjectsSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('fraude');

  const projects: ProjectStory[] = [
    {
      id: 'fraude',
      name: 'Detección de Fraude en Tiempo Real',
      category: 'Fintech & Streaming',
      role: 'Proyecto Práctico / Creador del Pipeline',
      problem: 'Las transacciones sospechosas tardaban 15 minutos en evaluarse debido a procesos en lote diferidos, generando más de $1.2M anuales en contracargos.',
      action: 'Implementé una tubería de streaming continuo que procesa y califica cada intento de pago en menos de 70 milisegundos en el instante de la transacción.',
      metrics: [
        { value: '< 70 ms', label: 'Latencia de evaluación' },
        { value: '-38%', label: 'Reducción en fraudes' },
        { value: '1.8M/seg', label: 'Capacidad de eventos' }
      ],
      result: 'Se evitaron pérdidas por más de $450,000 en el primer trimestre sin generar fricción ni demoras para los compradores legítimos.',
      technologies: ['Apache Kafka', 'Apache Flink', 'Python', 'ClickHouse', 'Docker']
    },
    {
      id: 'lakehouse',
      name: 'Modernización del Almacén de Datos (Lakehouse)',
      category: 'E-commerce & Analytics',
      role: 'Proyecto Práctico / Modelado & Lakehouse',
      problem: 'Los reportes semanales tardaban 4 horas en generarse y la infraestructura en la nube crecía un 20% mensual en costo por consultas ineficientes.',
      action: 'Migré 400+ modelos a tablas modernas Apache Iceberg con particionamiento inteligente y ejecuciones incrementales organizadas con dbt.',
      metrics: [
        { value: '-48%', label: 'Ahorro en cómputo' },
        { value: '10x', label: 'Mayor velocidad en consultas' },
        { value: '99.98%', label: 'Disponibilidad de datos' }
      ],
      result: 'El tiempo de espera de reportes pasó de 4 horas a solo 12 minutos, optimizando drásticamente el consumo de recursos cloud.',
      technologies: ['Apache Iceberg', 'Snowflake', 'PySpark', 'dbt Core', 'AWS']
    },
    {
      id: 'calidad',
      name: 'Sistema Automatizado de Calidad de Datos',
      category: 'Gobernanza & Fiabilidad',
      role: 'Proyecto Práctico / Testing de Datos',
      problem: 'Frecuentes inconsistencias en bases de datos provocaban desconfianza en los reportes de ingresos que recibía el comité directivo.',
      action: 'Desarrollé compuertas automáticas de validación que verifican integridad, tipos de datos y reglas de negocio antes de consolidar la información.',
      metrics: [
        { value: '0 Errores', label: 'Discrepancias en pruebas' },
        { value: '3.2 seg', label: 'Tiempo de auditoría' },
        { value: '100%', label: 'Conformidad con contratos' }
      ],
      result: 'Se garantizó la consistencia íntegra de los datos oficiales y se automatizó la validación sin requerir intervención manual.',
      technologies: ['Great Expectations', 'DuckDB', 'Apache Airflow', 'Python', 'SQL']
    }
  ];

  const current = projects.find(p => p.id === activeId) || projects[0];

  return (
    <section id="proyectos" className="mono-section">
      <div className="section-container">
        {/* Section Heading */}
        <div className="mono-section-head">
          <span className="mono-label">CASOS DE ESTUDIO & PROYECTOS</span>
          <h2 className="mono-section-title">
            Soluciones prácticas a problemas reales de datos.
          </h2>
          <p className="mono-section-sub">
            Modelos de datos, canalizaciones en tiempo real y arquitecturas de lakehouse construidas con estándares de industria.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="mono-tab-group">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`mono-tab-item ${activeId === p.id ? 'active' : ''}`}
            >
              <span className="mono-tab-category">{p.category}</span>
              <span className="mono-tab-name">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Project Detail Card */}
        <div className="mono-project-card">
          <div className="mono-project-header">
            <div>
              <span className="mono-project-cat">{current.category}</span>
              <h3 className="mono-project-title">{current.name}</h3>
              <span className="mono-project-role">Rol: {current.role}</span>
            </div>

            {/* Metrics */}
            <div className="mono-metrics-group">
              {current.metrics.map((m, idx) => (
                <div key={idx} className="mono-metric-box">
                  <span className="mono-metric-num">{m.value}</span>
                  <span className="mono-metric-lbl-sm">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mono-project-body">
            <div className="mono-body-col">
              <span className="mono-body-label">01 // EL RETO INICIAL</span>
              <p className="mono-body-desc">{current.problem}</p>
            </div>

            <div className="mono-body-col">
              <span className="mono-body-label">02 // LA ARQUITECTURA IMPLEMENTADA</span>
              <p className="mono-body-desc">{current.action}</p>
            </div>

            <div className="mono-body-col">
              <span className="mono-body-label">03 // EL IMPACTO DE NEGOCIO</span>
              <p className="mono-body-desc highlight">{current.result}</p>
            </div>
          </div>

          <div className="mono-project-footer">
            <span className="mono-footer-label">Stack utilizado:</span>
            <div className="mono-chips-wrap">
              {current.technologies.map(t => (
                <span key={t} className="mono-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProjectsSection;
