import React from 'react';

interface SkillGroup {
  category: string;
  code: string;
  items: {
    skill: string;
    level: string;
    detail: string;
  }[];
}

export const TechStackGrid: React.FC = () => {
  const groups: SkillGroup[] = [
    {
      category: 'Lenguajes y Consultas',
      code: '01 / CORE',
      items: [
        { skill: 'SQL Avanzado', level: 'Sólido', detail: 'Consultas analíticas, optimización de planes de ejecución y particiones.' },
        { skill: 'Python / PySpark', level: 'Avanzado', detail: 'Scripts de automatización, APIs de ingesta y procesamiento distribuido.' },
        { skill: 'Bash & Entornos Linux', level: 'Competente', detail: 'Automatización de servidores, terminal y tareas programadas.' }
      ]
    },
    {
      category: 'Streaming y Tuberías',
      code: '02 / PIPELINES',
      items: [
        { skill: 'Apache Kafka', level: 'Proyectos Prácticos', detail: 'Arquitecturas orientadas a eventos, particionamiento y grupos de consumidores.' },
        { skill: 'Apache Spark', level: 'Avanzado', detail: 'Transformaciones de grandes volúmenes en memoria con tolerancia a fallos.' },
        { skill: 'Apache Airflow', level: 'Avanzado', detail: 'Orquestación de DAGs complejos y flujos de trabajo programados.' }
      ]
    },
    {
      category: 'Almacenes y Formatos Modernos',
      code: '03 / STORAGE',
      items: [
        { skill: 'Snowflake', level: 'Avanzado', detail: 'Almacenes analíticos en la nube con separación de cómputo y almacenamiento.' },
        { skill: 'Apache Iceberg / Delta Lake', level: 'Proyectos Prácticos', detail: 'Tablas ACID de alto rendimiento y particionamiento oculto.' },
        { skill: 'PostgreSQL / ClickHouse', level: 'Sólido', detail: 'Bases transaccionales relacionales y motores columnares ultraveloces.' }
      ]
    },
    {
      category: 'Nube, Modelado y Calidad',
      code: '04 / GOVERNANCE',
      items: [
        { skill: 'dbt (Data Build Tool)', level: 'Proyectos Prácticos', detail: 'Modelado modular, pruebas automatizadas y linaje de datos.' },
        { skill: 'AWS / Google Cloud', level: 'Avanzado', detail: 'S3, Glue, Athena, BigQuery, IAM y gobernanza de infraestructura.' },
        { skill: 'Docker & Git', level: 'Avanzado', detail: 'Contenedores estandarizados y control de versiones colaborativo.' }
      ]
    }
  ];

  return (
    <section id="habilidades" className="mono-section">
      <div className="section-container">
        {/* Section Heading */}
        <div className="mono-section-head">
          <span className="mono-label">COMPETENCIAS TÉCNICAS</span>
          <h2 className="mono-section-title">
            Ecosistema tecnológico y herramientas.
          </h2>
          <p className="mono-section-sub">
            Tecnologías dominadas a nivel de producción para diseñar plataformas fiables y escalables.
          </p>
        </div>

        {/* 2x2 Clean Grid */}
        <div className="mono-skills-grid">
          {groups.map((grp, idx) => (
            <div key={idx} className="mono-skill-box">
              <div className="mono-skill-box-header">
                <span className="mono-skill-box-code">{grp.code}</span>
                <h3 className="mono-skill-box-title">{grp.category}</h3>
              </div>

              <div className="mono-skill-items-list">
                {grp.items.map((it, i) => (
                  <div key={i} className="mono-skill-row">
                    <div className="mono-skill-row-top">
                      <span className="mono-skill-name">{it.skill}</span>
                      <span className="mono-skill-badge">{it.level}</span>
                    </div>
                    <span className="mono-skill-desc">{it.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TechStackGrid;
