import React, { useState } from "react";
import Portada from "./components/Portada";
import CuentaRegresiva from "./components/CuentaRegresiva";
import CarruselHistoria from "./components/CarruselHistoria";
import DetallesBoda from "./components/DetallesBoda";
import Wishlist from "./components/Wishlist";
import MouseTrail from "./components/MouseTrail";

import CodigoModal from "./components/CodigoModal";

function App() {
  
  const [invitado, setInvitado] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const handleInvitadoConfirmado = (invitadoData) => {
    setInvitado(invitadoData);
    setShowModal(false);
  };
  
  return (
    <div className="bg-white text-gray-800">
      <MouseTrail />
      <CodigoModal
        isOpen={showModal && !invitado}
        onConfirm={handleInvitadoConfirmado}
      />
      <div className="relative">
        <Portada />
        <CuentaRegresiva />
      </div>
      <CarruselHistoria />
      <DetallesBoda invitado={invitado} />
      <Wishlist invitado={invitado} />
    </div>
  );
}

export default App;
