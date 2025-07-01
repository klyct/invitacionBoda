import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { doc, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import ModalConfirmacion from "./ModalConfirmacion";

export default function DetallesBoda({ invitado }) {
  const [confirmando, setConfirmando] = useState(false);
  const [confirmacionLocal, setConfirmacionLocal] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    tipo: "success",
    titulo: "",
    mensaje: ""
  });

  useEffect(() => {
    if (invitado) {
      setConfirmacionLocal(invitado.confirmacionValor);
    }
  }, [invitado]);

  const handleConfirmarAsistencia = async (confirmacion) => {
    if (!invitado || confirmando) return;

    setConfirmando(true);

    try {
      setConfirmacionLocal(confirmacion);

      // Actualizar el documento del invitado en Firestore usando el ID numérico
      const q = query(collection(db, "invitados"), where("id", "==", invitado.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = doc(db, "invitados", querySnapshot.docs[0].id);
        await updateDoc(docRef, {
          confirmado: confirmacion,
          confirmacionValor: confirmacion
        });

        setModal({
          isOpen: true,
          tipo: "success",
          titulo: confirmacion ? "¡Confirmado!" : "Entendido",
          mensaje: confirmacion
            ? `Has confirmado asistencia para ${invitado.cantidad} personas. ¡Nos vemos en la boda!`
            : "Lamentamos que no puedas asistir. ¡Gracias por avisarnos!"
        });
      }
    } catch (err) {
      setConfirmacionLocal(invitado.confirmacionValor);
      setModal({
        isOpen: true,
        tipo: "error",
        titulo: "Error",
        mensaje: `Ocurrió un error al ${confirmacion ? "confirmar" : "cancelar"} tu asistencia`
      });
    } finally {
      setConfirmando(false);
    }
  };


  return (
    <>
        <ModalConfirmacion
          isOpen={modal.isOpen}
          onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
          tipo={modal.tipo}
          titulo={modal.titulo}
          mensaje={modal.mensaje}
        />

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
          <p className="font-alexbrush font-semibold text-[#4c044d] text-3xl">Civil</p>
          <p className="mt-1">Sábado, 19 de Julio de 2025</p>
        </div>

        {invitado && (
            <div className="bg-white shadow-xl rounded-2xl p-6">
            <p className="font-alexbrush font-semibold text-[#4c044d] text-3xl">Tu Invitación</p>
            <p>{invitado.nombre}</p>
            <p>Invitados: {invitado.cantidad}</p>
              
              {confirmacionLocal === true ? (
                <button
                  onClick={() => handleConfirmarAsistencia(false)}
                  disabled={confirmando}
                  className={`bg-[#4c044d] mt-2 text-white px-4 py-2 rounded hover:bg-[#c798c8] ${confirmando ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {confirmando ? "Procesando..." : "Cambiar decisión (No asistiré)"}
                </button>
              ) : confirmacionLocal === false ? (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => handleConfirmarAsistencia(true)}
                    disabled={confirmando}
                      className={`bg-[#4c044d] mt-2 text-white px-4 py-2 rounded hover:bg-[#c798c8] ${confirmando ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {confirmando ? "Procesando..." : "Cambiar decisión (Sí asistiré)"}
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => handleConfirmarAsistencia(true)}
                    disabled={confirmando}
                        className={`bg-[#4c044d] text-white px-4 py-2 rounded hover:bg-[#c798c8] ${confirmando ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {confirmando ? "Confirmando..." : "Confirmar Asistencia"}
                  </button>

                  <button
                    onClick={() => handleConfirmarAsistencia(false)}
                    disabled={confirmando}
                        className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-300 ${confirmando ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {confirmando ? "Procesando..." : "No podré asistir"}
                  </button>
                </div>
              )}
            
          
          </div>
        )}

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <p className="font-alexbrush font-semibold text-[#4c044d] text-3xl">Recepción</p>
          <p className="mt-1">Hora: 1:00 PM</p>
          <p>Dirección: Guillermo Prieto 201-Local 1, Alameda, 38050 Celaya, Gto.</p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6">
          <p className="font-alexbrush font-semibold text-[#4c044d] text-3xl">Código de vestimenta</p>
          <p className="mt-1">Semi-formal</p>
        </div>
      </div>
      </section>
    </>
  );
}