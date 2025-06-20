import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './../index.css'

const imagenes = {
  normal: "/assets/ambos_1.JPG",
  izquierda: "/assets/alex_1.jpg",
  derecha: "/assets/kim_1.jpg",
};

const variantesImagen = {
  entrada: {
    opacity: 0.5,
    scale: 0.95,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: .5, ease: "easeInOut" },
  },
  salida: {
    opacity: 0.5,
    scale: 1.05,
    filter: "blur(6px)",
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

export default function Portada() {
  const [lado, setLado] = useState("normal");
  const [isMobile, setIsMobile] = useState(false);

  // Efecto para detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint típico para móviles
    };

    // Verificar al montar y al cambiar tamaño
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleMouseMove = (e) => {
    const ancho = window.innerWidth;
    const margen = ancho * 0.3;
    let nuevoLado;

    if (e.clientX < margen) nuevoLado = "izquierda";
    else if (e.clientX > ancho - margen) nuevoLado = "derecha";
    else nuevoLado = "normal";

    if (nuevoLado !== lado) setLado(nuevoLado);
  };

  const handleMouseLeave = () => {
    setLado("normal");
  };

  return (
    <div
      className="relative h-screen flex flex-col justify-center items-center overflow-hidden text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fondo base */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/ambos_26.JPG"
          alt="Fondo"
          className={`w-full h-full object-cover object-center transition-transform duration-300 ${isMobile ? 'rotate-90 scale-125' : ''
            }`}
          style={{
            ...(isMobile && {
              width: '100vh',
              height: '100vw',
              maxWidth: 'unset',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transformOrigin: 'center center',
              translate: '-50% -50%'
            })
          }}
        />
      </div>

      {/* Brillo suave */}
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#c798c8] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="m-4 text-center text-[#fff]">
          <p className="text-xl font-roboto italic">18 Julio 2025</p>
        </div>

        
        {/* Círculo decorativo */}
        <div className="relative w-48 h-48 rounded-full border-[6px] border-[#c798c8] shadow-xl flex items-center justify-center bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={lado}
              src={imagenes[lado]}
              alt="Foto actual"
              className="w-full h-full object-cover rounded-full"
              variants={variantesImagen}
              initial="entrada"
              animate="visible"
              exit="salida"
            />
          </AnimatePresence>
        </div>

        {/* Texto curvo (simulado) */}
        <div className="m-4 text-center text-[#fff]">
          <h1 className="text-4xl font-alexbrush font-bold mt-1">Alex & Kimy</h1>
        </div>
      </div>

    </div>
  );
}
