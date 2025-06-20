import React from "react";

export default function ModalConfirmacion({
  isOpen,
  onClose,
  tipo = "success",
  titulo,
  mensaje,
  onConfirm
}) {
  if (!isOpen) return null;

  const colorClasses = {
    success: "bg-white border-[#c798c8]",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700"
  };

  const buttonClasses = {
    success: "bg-[#4c044d] hover:bg-[#c798c8]",
    error: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`border-l-4 ${colorClasses[tipo]} p-4 rounded-lg bg-white shadow-lg max-w-md w-full`}>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold">{titulo}</h3>
          <button
            onClick={onClose}
            className="text-[#4c044d] hover:text-[#c798c8]"
          >
            ✕
          </button>
        </div>
        <p className="my-4">{mensaje}</p>
        <div className="flex justify-end gap-2">
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`${buttonClasses[tipo]} text-white px-4 py-2 rounded`}
            >
              Aceptar
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-[#4c044d] text-white px-4 py-2 rounded hover:bg-[#c798c8]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}