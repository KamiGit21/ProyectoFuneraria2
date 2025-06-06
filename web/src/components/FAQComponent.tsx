// FAQComponent.tsx

import React, { useEffect, useState } from 'react';
import './FAQComponent.css';
import { fetchFaqs, Faq } from '../api/faq';

const FAQComponent = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await fetchFaqs();
        setFaqs(data);
      } catch (err) {
        setError('Error al cargar las preguntas frecuentes.');
      } finally {
        setLoading(false);
      }
    };

    loadFaqs();
  }, []);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const isExpanded = (id: number) => expandedItems.has(id);

  return (
    <div className="faq-container">
      <h2 className="faq-title">Preguntas Frecuentes</h2>

      {loading && <p>Cargando preguntas...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && faqs.map((faq, index) => (
        <div key={faq.id} className="faq-card">
          <div className="faq-number">Pregunta {index + 1}</div>

          <div className="faq-header" onClick={() => toggleExpanded(faq.id)}>
            <h3 className="question">{faq.pregunta}</h3>
            <div className={`expand-icon ${isExpanded(faq.id) ? 'expanded' : ''}`}>+</div>
          </div>

          <div className={`answer-container ${isExpanded(faq.id) ? 'expanded' : 'collapsed'}`}>
            <p className="answer">{faq.respuesta}</p>
          </div>
        </div>
      ))}

      {!loading && !error && faqs.length === 0 && (
        <div className="faq-card">
          <p className="no-faqs">No hay preguntas frecuentes disponibles en este momento.</p>
        </div>
      )}
    </div>
  );
};

export default FAQComponent;
