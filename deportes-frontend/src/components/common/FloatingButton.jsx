import React, { useEffect, useState } from "react";
import "./FloatingButton.css";

const FloatingButton = () => {
  const [hidden, setHidden] = useState(false);

  // Se oculta automáticamente después de 7s
  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Toggle manual
  const toggle = () => {
    setHidden(prev => !prev);
  };

  return (
    <div className={`floating-wrapper ${hidden ? "hidden" : ""}`}>
      {/* Botón real al formulario */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdpVsYf0AtJBk02Sp431fhF77vbkzsvJ9WKXNYc7eKiDq9_fQ/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
      >
        Ayúdanos <br />
        a mejorar <br />
        esta aplicación
      </a>

      {/* Pestaña */}
      <button
        className="floating-tab"
        onClick={toggle}
        aria-label="Mostrar u ocultar"
      >
        💬
      </button>
    </div>
  );
};

export default FloatingButton;
