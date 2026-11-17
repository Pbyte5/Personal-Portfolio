import React, { useState } from 'react';
import { Database, Sparkles } from 'lucide-react';

interface RecruiterQuery {
  id: string;
  buttonLabel: string;
  humanQuestion: string;
  sqlQuery: string;
  columns: string[];
  rows: (string | number)[][];
  recruiterNote: string;
}

export const SqlSandbox: React.FC = () => {
  const queries: RecruiterQuery[] = [
    {
      id: 'perfil',
      buttonLabel: '1. Perfil del Candidato',
      humanQuestion: '¿Cuáles son los datos clave de este Ingeniero de Datos?',
      sqlQuery: `SELECT 
    nombre_profesional, 
    especialidad, 
    experiencia_anos, 
    nivel_ingles, 
    modalidad_deseada 
FROM candidatos_destacados;`,
      columns: ['PROFESIÓN', 'ESPECIALIDAD', 'EXPERIENCIA', 'INGLÉS', 'MODALIDAD'],
      rows: [
        ['Ingeniero de Datos Senior', 'Pipelines en Tiempo Real y Lakehouse', '+5 Años', 'B2/C1 Profesional', 'Remoto / Híbrido']
      ],
      recruiterNote: 'Ideal para vacantes de Data Engineer, Analytics Engineer o Data Platform Engineer.'
    },
    {
      id: 'ahorros',
      buttonLabel: '2. Impacto Económico',
      humanQuestion: '¿Cuánto valor o ahorro generó en empresas anteriores?',
      sqlQuery: `SELECT 
    proyecto, 
    resultado_obtenido, 
    ahorro_estimado, 
    tiempo_recuperacion 
FROM historial_impacto_negocio;`,
      columns: ['PROYECTO', 'RESULTADO CLAVE', 'AHORRO / BENEFICIO', 'TIEMPO'],
      rows: [
        ['Modernización de Lakehouse', 'Reportes 10x más veloces', '$80,000 USD / Año en Nube', '3 Meses'],
        ['Detección de Fraude en Tiempo Real', '38% menos cargos no reconocidos', '$450,000 USD Recuperados', '1 Trimestre'],
        ['Limpieza y Calidad Automática', '0 errores en reportes directivos', '40 horas/mes ahorradas a analistas', 'Inmediato']
      ],
      recruiterNote: 'Enfoque orientado a retorno de inversión (ROI) y ahorro directo en infraestructura.'
    },
    {
      id: 'disponibilidad',
      buttonLabel: '3. Disponibilidad y Contratación',
      humanQuestion: '¿Cuándo puede comenzar y en qué horarios trabaja?',
      sqlQuery: `SELECT 
    disponibilidad, 
    zona_horaria, 
    tipo_contrato, 
    estado_actual 
FROM estado_contratacion;`,
      columns: ['DISPONIBILIDAD', 'ZONAS HORARIAS', 'TIPO DE CONTRATO', 'ESTADO'],
      rows: [
        ['Inmediata / 2 semanas', 'América Latina / USA / Europa', 'Tiempo Completo / Contrato / Nómina', 'LISTO PARA ENTREVISTA']
      ],
      recruiterNote: 'Abierto a entrevistas técnicas y conversaciones con líderes de talento.'
    }
  ];

  const [activeQuery, setActiveQuery] = useState<RecruiterQuery>(queries[0]);

  const handleSelect = (q: RecruiterQuery) => {
    setActiveQuery(q);
  };

  return (
    <section id="sandbox" className="sql-sandbox-section">
      <div className="section-container">
        {/* Encabezado */}
        <div className="section-head">
          <div className="section-badge">
            <Sparkles size={13} className="text-emerald" />
            <span>DEMOSTRACIÓN INTERACTIVA // CONSULTA CON 1 CLIC</span>
          </div>
          <h2 className="section-title">
            Prueba cómo respondo consultas con <span className="highlight-gradient">datos reales</span>
          </h2>
          <p className="section-subtitle">
            Haz clic en cualquiera de las preguntas frecuentes de Recursos Humanos para ver la respuesta al instante.
          </p>
        </div>

        {/* Terminal Amigable */}
        <div className="sql-terminal-box">
          {/* Barra superior con pestañas amigables */}
          <div className="sql-terminal-top">
            <div className="terminal-db-badge">
              <Database size={14} className="text-cyan" />
              <span>CONSULTAS RÁPIDAS PARA RECLUTADORES:</span>
            </div>

            <div className="preset-buttons-row">
              {queries.map(q => (
                <button
                  key={q.id}
                  onClick={() => handleSelect(q)}
                  className={`preset-query-btn ${activeQuery.id === q.id ? 'preset-active' : ''}`}
                >
                  {q.buttonLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Pregunta en lenguaje humano */}
          <div style={{ padding: '16px 20px', background: 'rgba(8,10,15,0.7)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '600' }}>
              ❓ Pregunta: "{activeQuery.humanQuestion}"
            </span>
            <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '4px' }}>
              ✓ Consulta SQL ejecutada en 0.8ms
            </span>
          </div>

          {/* Tabla de resultados clara y legible */}
          <div className="query-results-area" style={{ padding: '24px' }}>
            <div className="table-scroll-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    {activeQuery.columns.map((col, idx) => (
                      <th key={idx}>
                        <div className="th-content">
                          <span>{col}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeQuery.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className={cIdx === 0 ? 'cell-primary' : ''}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nota de Recursos Humanos */}
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>
                💡 NOTA PARA RH:
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {activeQuery.recruiterNote}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SqlSandbox;
