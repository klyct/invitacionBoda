import React, { useState, useEffect } from "react";

export default function CuentaRegresiva() {
  const fechaObjetivo = new Date("2025-07-19T00:00:00");
  const [tiempoRestante, setTiempoRestante] = useState({});

  useEffect(() => {
    const actualizarTiempo = () => {
      const ahora = new Date();
      const diferencia = fechaObjetivo - ahora;

      if (diferencia <= 0) {
        setTiempoRestante({ terminado: true });
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
      const segundos = Math.floor((diferencia / 1000) % 60);

      setTiempoRestante({ dias, horas, minutos, segundos });
    };

    actualizarTiempo(); // Primer cálculo inmediato
    const timer = setInterval(actualizarTiempo, 1000);

    return () => clearInterval(timer);
  }, []);

  if (tiempoRestante.terminado) {
    return (
      <div className="text-center py-10 bg-[#c798c8]">
        <h2 className="text-4xl font-bold text-white">
          ¡Es hoy!, ¡Es hoy!
        </h2>
      </div>
    );
  }

  return (
    <div className="text-center font-roboto py-10 bg-[#c798c8]">
      {" "}
      <h2 className="text-3xl  font-semibold mb-4 text-white drop-shadow-lg">
        Faltan:
      </h2>
      <div className="flex justify-center space-x-6 text-white text-2xl font-bold">
        <div className="flex flex-col items-center">
          <span>{tiempoRestante.dias}</span>
          <span className="text-sm font-medium">Días</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{tiempoRestante.horas}</span>
          <span className="text-sm font-medium">Horas</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{tiempoRestante.minutos}</span>
          <span className="text-sm font-medium">Min</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{tiempoRestante.segundos}</span>
          <span className="text-sm font-medium">Seg</span>
        </div>
      </div>
    </div>
  );
}
