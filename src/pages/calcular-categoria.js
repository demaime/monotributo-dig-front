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
          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResponse(pregunta.id, opcion)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  respuestas[pregunta.id] === opcion
                    ? "bg-[#43d685] border-white/20 text-white"
                    : "bg-white/10 border-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {opcion}
              </motion.button>
            ))}
          </div>
        );

      case "numero":
        return (
          <input
            type="number"
            min={pregunta.min}
            max={pregunta.max}
            value={respuestas[pregunta.id] || ""}
            onChange={(e) => handleResponse(pregunta.id, e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685]"
          />
        );

      case "checkbox":
        return (
          <div className="space-y-4">
            {pregunta.opciones.map((opcion, index) => {
              const isChecked = respuestas[pregunta.id]?.includes(opcion);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const currentSelections = respuestas[pregunta.id] || [];
                    const newSelections = isChecked
                      ? currentSelections.filter((item) => item !== opcion)
                      : [...currentSelections, opcion];
                    handleResponse(pregunta.id, newSelections);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isChecked
                      ? "bg-[#43d685] border-white/20 text-white"
                      : "bg-white/10 border-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        isChecked
                          ? "border-white bg-white/20"
                          : "border-white/50"
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
                    {opcion}
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
    <div className="min-h-screen bg-gradient-to-br from-[#072a30] to-[#43d685]/90 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          {/* Progress bar */}
          <div className="w-full h-2 bg-white/10 rounded-full mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((currentStep + 1) / preguntas.preguntas.length) * 100
                }%`,
              }}
              className="h-full bg-[#43d685] rounded-full"
            />
          </div>

          {/* Pregunta */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {preguntaActual.texto}
            </h2>
            {preguntaActual.descripcion && (
              <p className="text-white/70 mb-6">{preguntaActual.descripcion}</p>
            )}
            {renderPregunta(preguntaActual)}
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                currentStep === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/10"
              }`}
            >
              <ArrowLeft className="w-5 h-5 text-white" />
              <span className="text-white">Anterior</span>
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-[#43d685] text-white transition-all ${
                !respuestas[preguntaActual.id]
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#43d685]/90"
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
        </motion.div>
      </div>
    </div>
  );
};

export default CalcularCategoria;
