import React, { useState } from "react";

const regalosIniciales = [
  { id: 1, nombre: "Juego de sábanas matrimonial", seleccionado: false },
  { id: 2, nombre: "Edredón o cobertor", seleccionado: false },
  { id: 3, nombre: "Juego de toallas de baño", seleccionado: false },
  { id: 4, nombre: "Juego de cubiertos", seleccionado: false },
  { id: 5, nombre: "Jarra de agua", seleccionado: false },
  { id: 6, nombre: "Set de organizadores", seleccionado: false },
  { id: 7, nombre: "Utensilios de cocina", seleccionado: false },
  { id: 8, nombre: "Almohadas", seleccionado: false },
];

export default function WishlistRegalos() {
  const [regalos, setRegalos] = useState(regalosIniciales);

  const toggleSeleccion = (id) => {
    setRegalos((prev) =>
      prev.map((regalo) =>
        regalo.id === id
          ? { ...regalo, seleccionado: !regalo.seleccionado }
          : regalo
      )
    );
  };

  return (
    <section className="bg-white py-16 px-4 text-center text-gray-800">
      <h2 className="text-4xl font-bold mb-6 text-[#c798c8]">Wishlist</h2>

      <p className="mb-8 text-lg text-[#4c044d]">
        Estar presente en nuestra boda ya lo significa todo. Pero si deseas ayudarnos a construir nuestro nuevo hogar, aquí tienes algunas ideas.
      </p>

      <div className="max-w-xl mx-auto text-left space-y-4">
        {regalos.map((regalo) => (
          <label
            key={regalo.id}
            className="flex items-center space-x-3 bg-[#c798c8]/30 p-4 rounded-xl shadow text-[#4c044d]"
          >
            <input
              type="checkbox"
              checked={regalo.seleccionado}
              onChange={() => toggleSeleccion(regalo.id)}
              className="form-checkbox h-5 w-5 text-[#4c044d]"
            />
            <span className="text-lg">{regalo.nombre}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
