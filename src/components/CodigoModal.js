import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function CodigoModal({ isOpen, onConfirm, onClose }) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Inicia en true para verificación automática
  const [autoChecking, setAutoChecking] = useState(false);

  // Verificación automática al montar el componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCode = localStorage.getItem("invitadoCodigo") ||
        document.cookie.split('; ').find(row => row.startsWith('invitadoCodigo='))?.split('=')[1];

      if (savedCode) {
        setCodigo(savedCode);
        verificarCodigo(savedCode, true);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const verificarCodigo = async (code, isAutoCheck = false) => {
    if (!code.trim()) {
      if (!isAutoCheck) setError("Por favor ingresa un código válido");
      return false;
    }

    isAutoCheck ? setAutoChecking(true) : setLoading(true);
    setError("");

    try {
      const q = query(collection(db, "invitados"), where("codigo", "==", code.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        guardarCodigo(code.trim());
        onConfirm({ id: doc.id, ...doc.data() });
        return true;
      } else {
        if (!isAutoCheck) setError("Código no encontrado. Intente nuevamente.");
        return false;
      }
    } catch (err) {
      console.error("Error buscando invitado:", err);
      if (!isAutoCheck) setError("Ocurrió un error. Por favor intente más tarde.");
      return false;
    } finally {
      isAutoCheck ? setAutoChecking(false) : setLoading(false);
    }
  };

  const guardarCodigo = (code) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("invitadoCodigo", code);
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días
      document.cookie = `invitadoCodigo=${code}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verificarCodigo(codigo);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        {autoChecking ? (
          <div className="text-center py-8">
            <svg className="animate-spin mx-auto h-8 w-8 text-[#4c044d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-700">Verificando tu código de acceso...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#4c044d]">Ingresa tu código de invitación</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border p-2 rounded mb-4 w-full focus:ring-2 focus:ring-[#4c044d] focus:border-[#4c044d]"
                placeholder="Ej: AB12"
                autoFocus
                disabled={loading}
              />

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`bg-[#4c044d] text-white px-4 py-2 rounded hover:bg-[#c798c8] w-full flex items-center justify-center ${loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : "Continuar"}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              El código se guardará automáticamente en este dispositivo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}