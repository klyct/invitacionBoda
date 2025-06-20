import React from "react";

export default function DetallesBoda() {
  return (
    <section className="bg-[#c798c8] font-roboto py-16 px-4 text-center">
      <h2 className="text-5xl font-alexbrush font-bold text-[#4c044d]">Detalles del Gran Día</h2>

      <div className="max-w-3xl mx-auto space-y-6 text-lg text-white m-6">
        <p>
          Nos llena de emoción invitarte a compartir este momento único en nuestras vidas.
          ¡Será un día inolvidable!
        </p>
    </div>

    <div className="max-w-3xl mx-auto space-y-6 text-lg text-[#c798c8]">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <p className="font-alexbrush font-semibold  text-[#4c044d] text-3xl">Civil</p>
          <p className="mt-1">Viernes, 18 de Julio de 2025</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <p className="font-alexbrush font-semibold  text-[#4c044d] text-3xl">Recepción</p>
          <p className="mt-1">Hora: Por confirmar</p>
          <p>Dirección: Por confirmar</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <p className="font-alexbrush font-semibold text-[#4c044d] text-3xl">Código de vestimenta</p>
          <p className="mt-1 ">Semi-formal</p>
        </div>
      </div>
    </section>
  );
}
