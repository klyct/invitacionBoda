import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import ModalConfirmacion from "./ModalConfirmacion";

export default function Wishlist({ invitado }) {
  const [regalos, setRegalos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegalos, setSelectedRegalos] = useState([]);
  const [modal, setModal] = useState({
    isOpen: false,
    tipo: "success",
    titulo: "",
    mensaje: ""
  });

  // Obtener regalos de Firestore
  useEffect(() => {
    const fetchRegalos = async () => {
      try {
        const q = query(collection(db, "wishlist"));
        const querySnapshot = await getDocs(q);
        const regalosData = querySnapshot.docs.map(doc => ({
          firestoreId: doc.id,
          ...doc.data()
        }));
        setRegalos(regalosData);

        // Pre-seleccionar regalos ya reservados por este invitado
        if (invitado) {
          const misRegalosIds = regalosData
            .filter(r => r.codigoInvitado === invitado.codigo)
            .map(r => r.id);
          setSelectedRegalos(misRegalosIds);
        }
      } catch (error) {
        console.error("Error al obtener regalos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegalos();
  }, [invitado]);

  const handleCheckboxChange = (idNumerico) => {
    setSelectedRegalos(prev =>
      prev.includes(idNumerico)
        ? prev.filter(id => id !== idNumerico)
        : [...prev, idNumerico]
    );
  };

  const confirmarRegalos = async () => {
    if (!invitado || selectedRegalos.length === 0) return;

    try {
      // 1. Liberar regalos que ya no están seleccionados
      const regalosADesmarcar = regalos.filter(
        r => r.codigoInvitado === invitado.codigo && !selectedRegalos.includes(r.id)
      );

      await Promise.all(
        regalosADesmarcar.map(r =>
          updateDoc(doc(db, "wishlist", r.firestoreId), {
            codigoInvitado: "",
            invitadoNombre: "",
            regalado: false
          })
        )
      );

      // 2. Reservar los nuevos regalos seleccionados
      await Promise.all(
        selectedRegalos.map(regaloId => {
          const regalo = regalos.find(r => r.id === regaloId);
          return updateDoc(doc(db, "wishlist", regalo.firestoreId), {
            codigoInvitado: invitado.codigo,
            invitadoNombre: invitado.nombre,
            regalado: true
          });
        })
      );

      // Actualizar el estado local
      const updatedSnapshot = await getDocs(collection(db, "wishlist"));
      setRegalos(updatedSnapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
      })));

      setModal({
        isOpen: true,
        tipo: "success",
        titulo: "¡Reserva exitosa!",
        mensaje: `Has reservado ${selectedRegalos.length} regalo(s). Muchas gracias.`
      });
    } catch (error) {
      setModal({
        isOpen: true,
        tipo: "error",
        titulo: "Error",
        mensaje: "Ocurrió un error al reservar tus regalos"
      });
    }
  };

  const quitarRegalo = async (regaloId) => {
    try {
      const regalo = regalos.find(r => r.id === regaloId);
      if (!regalo) return;

      await updateDoc(doc(db, "wishlist", regalo.firestoreId), {
        codigoInvitado: "",
        invitadoNombre: "",
        regalado: false
      });

      // Actualizar estados
      setSelectedRegalos(prev => prev.filter(id => id !== regaloId));
      setRegalos(prev => prev.map(r =>
        r.id === regaloId
          ? { ...r, codigoInvitado: "", invitadoNombre: "", regalado: false }
          : r
      ));
    } catch (error) {
      console.error("Error al quitar regalo:", error);
    }
  };

  if (loading) return <div className="text-center py-8">Cargando lista de regalos...</div>;

  // Filtrar regalos disponibles (no regalados y no reservados por otros)
  const regalosDisponibles = regalos.filter(r =>
    !r.regalado && (!r.codigoInvitado || r.codigoInvitado === invitado?.codigo)
  );

  // Regalos reservados por el invitado actual
  const misRegalos = invitado
    ? regalos.filter(r => r.codigoInvitado === invitado.codigo && r.regalado)
    : [];

  return (
    <>
      <ModalConfirmacion
        isOpen={modal.isOpen}
        onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
      />

      <section className="bg-white py-16 px-4 text-center text-gray-800">
        <h2 className="text-4xl font-bold mb-6 text-[#c798c8]">Lista de Regalos</h2>

        <p className="mb-8 text-lg text-[#4c044d]">
          Estar presente en nuestra boda ya lo significa todo. Pero si deseas ayudarnos a construir nuestro nuevo hogar, aquí tienes algunas ideas.
        </p>

        <div className="max-w-xl mx-auto">
          {/* Lista de regalos disponibles */}
          <div className="space-y-4 text-left mb-6">
            {regalosDisponibles.length > 0 ? (
              regalosDisponibles.map(regalo => (
                <div
                  key={regalo.id}
                  className="flex items-start bg-[#c798c8]/30 p-4 rounded-xl shadow text-[#4c044d]"
                >
                  <input
                    type="checkbox"
                    checked={selectedRegalos.includes(regalo.id)}
                    onChange={() => handleCheckboxChange(regalo.id)}
                    className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-[#4c044d] focus:ring-[#4c044d]"
                  />
                  <div className="flex-1">
                    <span className="text-lg font-medium">{regalo.nombre}</span>
                    {regalo.descripcion && (
                      <p className="text-sm mt-1 text-gray-600">{regalo.descripcion}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No hay regalos disponibles para seleccionar.
              </p>
            )}
          </div>

          {invitado && regalosDisponibles.length > 0 && (
            <button
              onClick={confirmarRegalos}
              disabled={selectedRegalos.length === 0}
              className={`bg-[#4c044d] text-white px-6 py-3 rounded-lg hover:bg-[#c798c8] transition-colors ${selectedRegalos.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
             Apartar regalo(s)
            </button>
          )}

          {/* Sección de mis regalos reservados - Ahora al final */}
          {invitado && misRegalos.length > 0 && (
            <div className="mt-8 text-left">
              <h3 className="text-xl font-semibold mb-4 text-[#4c044d]">Mis regalos reservados</h3>
              <div className="space-y-3">
                {misRegalos.map(regalo => (
                  <div
                    key={regalo.id}
                    className="flex items-center justify-between bg-[#c798c8]/20 p-3 rounded-lg text-[#4c044d]"
                  >
                    <div>
                      <span className="font-medium" >{regalo.nombre}</span>
                    </div>
                    <button
                      onClick={() => quitarRegalo(regalo.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!invitado && (
            <p className="text-center text-gray-500 mt-6">
              Por favor ingresa tu código de invitación para reservar regalos.
            </p>
          )}
        </div>
      </section>
    </>
  );
}