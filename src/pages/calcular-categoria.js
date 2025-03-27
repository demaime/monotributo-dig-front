import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import preguntas from "../data/categorias-questions.json";

const CalcularCategoria = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [respuestas, setRespuestas] = useState({});

  const handleResponse = (preguntaId, respuesta) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: respuesta,
    }));
  };

  const renderPregunta = (pregunta) => {
    switch (pregunta.tipo) {
      case "seleccion":
        return (
          <div className="space-y-4 overflow-y-auto overflow-x-hidden px-4">
            {pregunta.opciones.map((opcion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleResponse(pregunta.id, opcion)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  respuestas[pregunta.id] === opcion
                    ? "bg-[#0066FF] border-[#0066FF] text-white"
                    : "bg-white border-[#E5F0FF] text-[#6B7280] hover:bg-[#E5F0FF]"
                }`}
              >
                {opcion}
              </motion.button>
            ))}
          </div>
        );

      case "numero":
        return (
          <div className="px-4">
            <input
              type="number"
              min={pregunta.min}
              max={pregunta.max}
              value={respuestas[pregunta.id] || ""}
              onChange={(e) => handleResponse(pregunta.id, e.target.value)}
              className="w-full bg-white border border-[#E5F0FF] rounded-xl p-4 text-[#1E293B] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
            />
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-4 overflow-y-auto overflow-x-hidden px-4">
            {pregunta.opciones.map((opcion, index) => {
              const isChecked = respuestas[pregunta.id]?.includes(opcion);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    const currentSelections = respuestas[pregunta.id] || [];
                    const newSelections = isChecked
                      ? currentSelections.filter((item) => item !== opcion)
                      : [...currentSelections, opcion];
                    handleResponse(pregunta.id, newSelections);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isChecked
                      ? "bg-[#0066FF] border-[#0066FF] text-white"
                      : "bg-white border-[#E5F0FF] text-[#6B7280] hover:bg-[#E5F0FF]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        isChecked
                          ? "border-white bg-white/20"
                          : "border-[#6B7280]"
                      }`}
                    >
                      {isChecked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-white rounded-sm"
                        />
                      )}
                    </div>
                    <span className="flex-1">{opcion}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const preguntaActual = preguntas.preguntas[currentStep];

  return (
    <div className="min-h-screen h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl h-[90vh] bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden"
      >
        {/* Progress bar */}
        <div className="p-8 pb-0">
          <div className="w-full h-2 bg-[#E5F0FF] rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentStep + 1) / preguntas.preguntas.length) * 100
                }%`,
              }}
              className="h-full bg-[#0066FF] rounded-full"
            />
          </div>
        </div>

        {/* Content container with flex layout */}
        <div className="flex flex-col flex-1 min-h-0 p-8">
          {/* Pregunta header - fixed height */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
              {preguntaActual.texto}
            </h2>
            {preguntaActual.descripcion && (
              <p className="text-[#6B7280]">{preguntaActual.descripcion}</p>
            )}
          </motion.div>

          {/* Respuestas container - scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {renderPregunta(preguntaActual)}
          </div>

          {/* Navigation buttons - fixed height */}
          <div className="flex justify-between mt-6 pt-4 border-t border-[#E5F0FF]">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                currentStep === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#E5F0FF]"
              }`}
            >
              <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
              <span className="text-[#6B7280]">Anterior</span>
            </button>
            <button
              onClick={() => {
                if (currentStep < preguntas.preguntas.length - 1) {
                  setCurrentStep((prev) => prev + 1);
                } else {
                  // Aquí manejaremos la lógica para calcular la categoría
                  console.log("Respuestas finales:", respuestas);
                }
              }}
              disabled={!respuestas[preguntaActual.id]}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0066FF] text-white transition-all ${
                !respuestas[preguntaActual.id]
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0066FF]/90"
              }`}
            >
              <span>
                {currentStep === preguntas.preguntas.length - 1
                  ? "Calcular categoría"
                  : "Siguiente"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalcularCategoria;
