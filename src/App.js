import React from "react";
import Portada from "./components/Portada";
import CuentaRegresiva from "./components/CuentaRegresiva";
import CarruselHistoria from "./components/CarruselHistoria";
import DetallesBoda from "./components/DetallesBoda";
import Wishlist from "./components/wishlist";
import MouseTrail from "./components/MouseTrail";

function App() {
  return (
    <div className="bg-white text-gray-800">
       <MouseTrail />
      <div className="relative">
        <Portada />
        <CuentaRegresiva />
      </div>
      <CarruselHistoria />
      <DetallesBoda />
      <Wishlist />
    </div>
  );
}

export default App;
