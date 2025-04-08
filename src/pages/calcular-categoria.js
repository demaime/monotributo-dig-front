import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X, CheckCircle, Check } from "lucide-react";
import { useRouter } from "next/router";
import preguntasData from "../data/categorias-questions.json";

// Datos de la tabla de categorías del Monotributo (Valores ~Abril 2024 - Ejemplo)
const categoriasMonotributo = {
  A: {
    ingresosBrutosAnuales: 7813063.45,
    superficieAfectada: 30,
    energiaElectricaAnual: 3330,
    alquileresAnuales: 1816991.5,
    totalServicios: 32221.31,
    totalVenta: 32221.31,
    aportesObraSocialBase: 16716.32,
  },
  B: {
    ingresosBrutosAnuales: 11447046.44,
    superficieAfectada: 45,
    energiaElectricaAnual: 5000,
    alquileresAnuales: 1816991.5,
    totalServicios: 36679.0,
    totalVenta: 36679.0,
    aportesObraSocialBase: 16716.32,
  },
  C: {
    ingresosBrutosAnuales: 16050091.57,
    superficieAfectada: 60,
    energiaElectricaAnual: 6700,
    alquileresAnuales: 2483221.72,
    totalServicios: 42951.25,
    totalVenta: 41982.19,
    aportesObraSocialBase: 16716.32,
  },
  D: {
    ingresosBrutosAnuales: 19926340.1,
    superficieAfectada: 85,
    energiaElectricaAnual: 10000,
    alquileresAnuales: 2483221.72,
    totalServicios: 55047.33,
    totalVenta: 53714.87,
    aportesObraSocialBase: 19865.77,
  },
  E: {
    ingresosBrutosAnuales: 23439190.34,
    superficieAfectada: 110,
    energiaElectricaAnual: 13000,
    alquileresAnuales: 3149451.93,
    totalServicios: 77946.73,
    totalVenta: 70436.5,
    aportesObraSocialBase: 24226.55,
  },
  F: {
    ingresosBrutosAnuales: 29374695.9,
    superficieAfectada: 150,
    energiaElectricaAnual: 16500,
    alquileresAnuales: 3149451.93,
    totalServicios: 98096.95,
    totalVenta: 84530.08,
    aportesObraSocialBase: 27860.54,
  },
  G: {
    ingresosBrutosAnuales: 35128502.31,
    superficieAfectada: 200,
    energiaElectricaAnual: 20000,
    alquileresAnuales: 3755115.76,
    totalServicios: 149836.62,
    totalVenta: 103321.64,
    aportesObraSocialBase: 30040.93,
  },
  H: {
    ingresosBrutosAnuales: 53298417.3,
    superficieAfectada: 200,
    energiaElectricaAnual: 20000,
    alquileresAnuales: 5450974.5,
    totalServicios: 340061.68,
    totalVenta: 206815.63,
    aportesObraSocialBase: 36097.56,
  },
  I: {
    ingresosBrutosAnuales: 59657887.55,
    superficieAfectada: 200,
    energiaElectricaAnual: 20000,
    alquileresAnuales: 5450974.5,
    totalServicios: null,
    totalVenta: 309020.04,
    aportesObraSocialBase: 44576.86,
  }, // Solo venta
  J: {
    ingresosBrutosAnuales: 68318880.36,
    superficieAfectada: 200,
    energiaElectricaAnual: 20000,
    alquileresAnuales: 5450974.5,
    totalServicios: null,
    totalVenta: 377851.82,
    aportesObraSocialBase: 50027.83,
  }, // Solo venta
  K: {
    ingresosBrutosAnuales: 82370281.28,
    superficieAfectada: 200,
    energiaElectricaAnual: 20000,
    alquileresAnuales: 5450974.5,
    totalServicios: null,
    totalVenta: 456773.2,
    aportesObraSocialBase: 57174.67,
  }, // Solo venta
};

// Valor adicional por cada adherente (usar valor oficial actualizado)
const costoAdicionalPorAdherente = 17896.86;

// Función para parsear los rangos de ingresos mensuales
const parseIngresoMensual = (opcionSeleccionada) => {
  if (!opcionSeleccionada) return 0;
  // Ejemplo: "Entre $651.089 y $953.920" -> 953920
  // Ejemplo: "Hasta $651.088" -> 651088
  const matches = opcionSeleccionada.match(/\$?([0-9.,]+)/g);
  if (!matches) return 0;
  const lastNumberStr = matches[matches.length - 1].replace(/[^0-9]/g, "");
  return parseInt(lastNumberStr, 10) || 0;
};

// NUEVA Función para parsear los rangos de Superficie, Alquiler, Energía
const parseRangoHasta = (opcionSeleccionada) => {
  if (!opcionSeleccionada) return 0;
  // Ejemplo: "Hasta 45 m²" -> 45
  // Ejemplo: "Hasta $1.816.991" -> 1816991
  // Ejemplo: "Hasta 3330 Kw" -> 3330
  const matches = opcionSeleccionada.match(/[0-9.,]+/);
  if (!matches) return 0;
  const numberStr = matches[0].replace(/[^0-9]/g, "");
  return parseInt(numberStr, 10) || 0;
};

const calcularCategoriaYCuota = (respuestas) => {
  const categorias = Object.keys(categoriasMonotributo);
  let categoriaDeterminada = null;

  // 1. Obtener valores del usuario
  const rubro = respuestas[1];
  const ingresoMensualEstimado = parseIngresoMensual(respuestas[2]);
  const ingresoAnualEstimado = ingresoMensualEstimado * 12;
  const tieneLocal = respuestas[3] === "Sí";
  // Usar parseRangoHasta para las nuevas opciones de selección
  const superficie = tieneLocal ? parseRangoHasta(respuestas["3a"]) : 0;
  const alquilerAnual = tieneLocal ? parseRangoHasta(respuestas["3b"]) : 0;
  const energiaAnual = tieneLocal ? parseRangoHasta(respuestas["3c"]) : 0;
  const tieneOtrosAportes = respuestas[4] !== "No";
  const cantidadAdherentes = !tieneOtrosAportes
    ? parseInt(respuestas[5], 10) || 0
    : 0;

  // 2. Determinar la categoría (la lógica de comparación usa los valores parseados)
  for (const cat of categorias) {
    const limites = categoriasMonotributo[cat];

    if (
      rubro === "Prestación de servicios" &&
      limites.totalServicios === null
    ) {
      continue;
    }

    // Comparar el valor parseado del usuario con el límite de la categoría
    let superaLimite = false;
    if (ingresoAnualEstimado > limites.ingresosBrutosAnuales)
      superaLimite = true;
    if (tieneLocal) {
      // ¡Importante! La lógica ahora es al revés: si el valor del usuario
      // *supera* el límite de la categoría actual, debe ir a una superior.
      // Pero como las opciones son "Hasta X", el usuario selecciona el límite
      // máximo que *no* supera. La comparación sigue siendo la misma: si el
      // valor seleccionado (que es un límite) es mayor que el límite de la
      // categoría actual en la tabla, entonces no califica para esa categoría.
      // Ejemplo: Usuario selecciona "Hasta 45 m²" (valor=45).
      // Si estamos evaluando Cat A (límite 30), 45 > 30, no califica para A.
      // Si estamos evaluando Cat B (límite 45), 45 > 45 es falso, sí califica para B.
      if (superficie > limites.superficieAfectada) superaLimite = true;
      if (energiaAnual > limites.energiaElectricaAnual) superaLimite = true;
      if (alquilerAnual > limites.alquileresAnuales) superaLimite = true;
    }

    // Si NO supera ningún límite de esta categoría, esta es la correcta (o una inferior)
    if (!superaLimite) {
      // Si el rubro es Venta y estamos en I, J o K, califica.
      if (
        rubro !== "Prestación de servicios" &&
        ["I", "J", "K"].includes(cat)
      ) {
        categoriaDeterminada = cat;
        break;
      }
      // Si es Servicios o Venta en A-H, califica.
      else if (
        limites.totalServicios !== null ||
        rubro !== "Prestación de servicios"
      ) {
        categoriaDeterminada = cat;
        break; // Encontramos la categoría más baja que cumple
      }
    }
  }

  // Si superó la última categoría, queda excluido (o manejar de otra forma)
  if (!categoriaDeterminada) {
    // Podríamos devolver un estado especial o la última categoría válida
    // Por ahora, asumimos que cae en la K si superó H (si es venta) o H si es servicio
    if (rubro === "Prestación de servicios") {
      categoriaDeterminada = "H";
    } else {
      // Si superó K en venta, técnicamente está excluido.
      // Para el cálculo mostramos K, pero podríamos indicar exclusión.
      categoriaDeterminada = "K";
    }
    // Considerar el caso de exclusión real
  }

  // 3. Calcular cuota
  const datosCategoriaFinal = categoriasMonotributo[categoriaDeterminada];
  let cuotaBase = 0;
  let costoAdherentesTotal = 0;

  if (datosCategoriaFinal) {
    cuotaBase =
      rubro === "Prestación de servicios"
        ? datosCategoriaFinal.totalServicios
        : datosCategoriaFinal.totalVenta;

    if (cantidadAdherentes > 0) {
      // Usamos el valor de AportesObraSocial de la *categoría determinada* como base por adherente
      // const costoUnitarioAdherente = datosCategoriaFinal.aportesObraSocialBase;
      // O usamos un valor fijo si así lo definen las normativas
      costoAdherentesTotal = cantidadAdherentes * costoAdicionalPorAdherente;
    }
  }

  const cuotaTotal = cuotaBase + costoAdherentesTotal;

  return {
    categoriaDeterminada,
    cuotaTotal: cuotaTotal.toFixed(2),
    cuotaBase: cuotaBase.toFixed(2),
    costoAdherentes: costoAdherentesTotal.toFixed(2),
    cantidadAdherentes,
  };
};

const CalcularCategoria = () => {
  const router = useRouter();
  const [respuestas, setRespuestas] = useState({});
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const [resultadoCalculo, setResultadoCalculo] = useState(null);

  const allQuestions = preguntasData.preguntas;

  const visibleQuestions = useMemo(() => {
    const visible = [];
    let addLocalSubquestions = false;

    for (const q of allQuestions) {
      let shouldShow = true;

      if (q.id === 5 && respuestas[4] !== "No") {
        shouldShow = false;
      }

      if (shouldShow) {
        visible.push(q);
        if (q.id === 3 && respuestas[3] === "Sí") {
          addLocalSubquestions = true;
        }
      }
    }

    if (addLocalSubquestions) {
      const indexQ3 = visible.findIndex((q) => q.id === 3);
      if (indexQ3 !== -1) {
        visible.splice(indexQ3 + 1, 0, {
          id: "3_sub",
          texto: "Detalles del local",
          tipo: "subpreguntas_local",
          descripcion:
            "Por favor, completá los siguientes datos sobre tu local.",
        });
      }
    }

    return visible;
  }, [respuestas, allQuestions]);

  const currentVisibleQuestion = visibleQuestions[currentVisibleIndex];
  const totalVisibleSteps = visibleQuestions.length;

  const handleResponse = (preguntaId, respuesta) => {
    setRespuestas((prev) => {
      const newRespuestas = { ...prev, [preguntaId]: respuesta };

      if (preguntaId === 3 && respuesta === "No") {
        delete newRespuestas["3a"];
        delete newRespuestas["3b"];
        delete newRespuestas["3c"];
      }
      if (preguntaId === 4) {
        delete newRespuestas[5];
      }

      const oldVisibleLength = visibleQuestions.length;

      return newRespuestas;
    });
  };

  React.useEffect(() => {
    if (currentVisibleIndex >= visibleQuestions.length) {
      setCurrentVisibleIndex(Math.max(0, visibleQuestions.length - 1));
    }
  }, [visibleQuestions, currentVisibleIndex]);

  const isCurrentQuestionAnswered = () => {
    if (!currentVisibleQuestion) return false;

    // Validación para subpreguntas (ahora todas "seleccion_desplegable")
    if (currentVisibleQuestion.id === "3_sub") {
      const subPregsDefinition =
        allQuestions.find((q) => q.id === 3)?.subpreguntas?.preguntas || [];
      return subPregsDefinition.every((sub) => {
        const value = respuestas[sub.id];
        // Validar que cada desplegable tenga una selección válida
        return value !== undefined && value !== null && value !== "";
      });
    }

    // Validación para checkbox (pregunta 7)
    if (currentVisibleQuestion.tipo === "checkbox") {
      const totalOpciones = currentVisibleQuestion.opciones.length;
      const selecciones = respuestas[currentVisibleQuestion.id] || [];
      return selecciones.length === totalOpciones;
    }

    const value = respuestas[currentVisibleQuestion.id];

    // Validación general para tipos de selección (botones y desplegable)
    if (
      ["seleccion", "seleccion_desplegable"].includes(
        currentVisibleQuestion.tipo
      )
    ) {
      return value !== undefined && value !== null && value !== "";
    }

    return value !== undefined && value !== null;
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) return;

    const nextVisibleIndex = currentVisibleIndex + 1;
    if (nextVisibleIndex < totalVisibleSteps) {
      setCurrentVisibleIndex(nextVisibleIndex);
    } else {
      // Último paso: Calcular y mostrar resultados (YA NO GUARDA EN STORAGE)
      const resultado = calcularCategoriaYCuota(respuestas);
      setResultadoCalculo(resultado);
      console.log("Resultado del cálculo:", resultado);
    }
  };

  const handlePrevious = () => {
    // Si estamos viendo resultados, esta función no debería llamarse desde ahí
    // Mantenemos la lógica para volver atrás *dentro* del wizard
    const prevVisibleIndex = currentVisibleIndex - 1;
    if (prevVisibleIndex >= 0) {
      setCurrentVisibleIndex(prevVisibleIndex);
    }
  };

  const renderPregunta = (pregunta) => {
    if (!pregunta) return null;

    // Renderizar el paso de subpreguntas
    if (pregunta.tipo === "subpreguntas_local") {
      const subPregsDefinition =
        allQuestions.find((q) => q.id === 3)?.subpreguntas?.preguntas || [];
      return (
        <div className="space-y-6 px-4">
          {" "}
          {/* Más espacio entre subpreguntas */}
          {subPregsDefinition.map((subpregunta) => (
            // Renderizar cada subpregunta usando el case "seleccion_desplegable"
            <div key={subpregunta.id}>{renderPregunta(subpregunta)}</div>
          ))}
        </div>
      );
    }

    switch (pregunta.tipo) {
      case "seleccion": // Para botones
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

      // Case unificado para todos los desplegables
      case "seleccion_desplegable":
        return (
          <div className="px-4 space-y-2">
            {/* SIEMPRE mostrar el label/texto */}
            <label
              htmlFor={pregunta.id}
              className="block text-base font-semibold text-[#1E293B]"
            >
              {pregunta.texto}
            </label>
            {/* Mostrar descripción si existe */}
            {pregunta.descripcion && (
              <p className="text-sm text-[#6B7280]">{pregunta.descripcion}</p>
            )}
            <div className="relative pt-2">
              <select
                id={pregunta.id}
                value={respuestas[pregunta.id] || ""}
                onChange={(e) => handleResponse(pregunta.id, e.target.value)}
                className={`w-full p-3 rounded-lg border bg-white text-[#1E293B] focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] appearance-none transition-all ${
                  respuestas[pregunta.id] && respuestas[pregunta.id] !== ""
                    ? "border-[#0066FF]"
                    : "border-[#E5F0FF] text-gray-500"
                }`}
              >
                <option value="" disabled>
                  {pregunta.placeholder || "-- Seleccione --"}
                </option>
                {pregunta.opciones.map((opcion, index) => (
                  <option key={`${pregunta.id}-opt-${index}`} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pt-2">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548c.436-.446 1.145-.446 1.58 0L10 10.405l2.904-2.857c.435-.446 1.144-.446 1.58 0 .436.445.436 1.168 0 1.613l-3.694 3.638c-.435.446-1.144.446-1.58 0L5.516 9.16c-.436-.445-.436-1.168 0-1.613z" />
                </svg>
              </div>
            </div>
          </div>
        );

      case "checkbox": // Pregunta 7 (Declaraciones)
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
                  // Estilos base para el botón checkbox
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    isChecked
                      ? "bg-blue-50 border-[#0066FF] text-[#1E293B]"
                      : "bg-white border-[#E5F0FF] text-[#6B7280] hover:bg-[#E5F0FF]"
                  }`}
                >
                  {/* Contenedor del cuadradito del check */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isChecked
                        ? "bg-[#0066FF] border-[#0066FF]"
                        : "bg-white border-[#6B7280]"
                    }`}
                  >
                    {/* Tick visible cuando está chequeado */}
                    {isChecked && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  {/* Texto de la opción */}
                  <span className="flex-1 text-sm">{opcion}</span>
                </motion.button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const progress =
    totalVisibleSteps > 0
      ? ((currentVisibleIndex + 1) / totalVisibleSteps) * 100
      : 0;

  // Renderizado condicional (Resultados)
  if (resultadoCalculo) {
    const handleContinuarTramite = () => {
      // 1. Obtener categoría
      const categoria = resultadoCalculo?.categoriaDeterminada;
      if (!categoria) {
        console.error(
          "No se pudo obtener la categoría calculada para la navegación."
        );
        // Quizás mostrar un error al usuario
        return;
      }

      // 2. Navegar con parámetros en URL
      console.log(
        `Navegando a /registro con servicio=alta y categoria=${categoria}`
      );
      router.push(`/registro?servicio=alta&categoria=${categoria}`);
    };

    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">
            ¡Cálculo completado!
          </h2>
          <p className="text-lg text-[#6B7280] mb-6">
            Según los datos ingresados, tu categoría estimada es:
          </p>

          <div className="bg-[#E5F0FF] rounded-xl p-6 mb-6">
            <p className="text-sm text-[#0066FF] font-semibold mb-1">
              CATEGORÍA ESTIMADA
            </p>
            <p className="text-4xl font-bold text-[#1E293B]">
              {resultadoCalculo.categoriaDeterminada}
            </p>
          </div>

          <div className="bg-[#F3F4F6] rounded-xl p-6 mb-8">
            <p className="text-sm text-[#6B7280] font-semibold mb-1">
              CUOTA MENSUAL ESTIMADA
            </p>
            <p className="text-3xl font-bold text-[#1E293B]">
              ${resultadoCalculo.cuotaTotal}
            </p>
            {resultadoCalculo.cantidadAdherentes > 0 && (
              <p className="text-sm text-[#6B7280] mt-2">
                (Incluye ${resultadoCalculo.cuotaBase} de cuota base + $
                {resultadoCalculo.costoAdherentes} por{" "}
                {resultadoCalculo.cantidadAdherentes} adherente
                {resultadoCalculo.cantidadAdherentes !== 1 ? "s" : ""})
              </p>
            )}
          </div>

          <p className="text-xs text-[#6B7280] mb-6">
            Recordá que este cálculo es una estimación basada en los topes
            vigentes y los datos proporcionados. La categoría final puede
            variar.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-100 text-[#6B7280] border border-gray-300 transition-all w-full sm:w-auto`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </button>
            <button
              onClick={handleContinuarTramite}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0066FF] text-white hover:bg-[#0066FF]/90 transition-all w-full sm:w-auto`}
            >
              <span>Continuar trámite</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Si no hay resultado, mostrar el wizard normal
  if (!currentVisibleQuestion) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
        <p>Cargando o estado inválido...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden"
      >
        <div className="p-8 pb-0">
          <div className="w-full h-2 bg-[#E5F0FF] rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#0066FF] rounded-full transition-width duration-300 ease-in-out"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0 p-8">
          <motion.div
            key={currentVisibleIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-[#1E293B] mb-2">
              {currentVisibleQuestion.texto}
            </h2>
            {currentVisibleQuestion.descripcion && (
              <p className="text-[#6B7280]">
                {currentVisibleQuestion.descripcion}
              </p>
            )}
          </motion.div>

          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {renderPregunta(currentVisibleQuestion)}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-[#E5F0FF]">
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push("/")}
                className="flex flex-1 sm:flex-initial items-center justify-center gap-2 px-6 py-3 rounded-xl text-red-500 hover:bg-red-100 transition-all border border-red-200"
              >
                <X className="w-5 h-5" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handlePrevious}
                disabled={currentVisibleIndex === 0}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all border border-gray-300 ${
                  currentVisibleIndex === 0
                    ? "opacity-50 cursor-not-allowed text-gray-400"
                    : "hover:bg-[#E5F0FF] text-[#6B7280]"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Anterior</span>
              </button>
            </div>
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered()}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0066FF] text-white transition-all w-full sm:w-auto ${
                !isCurrentQuestionAnswered()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0066FF]/90"
              }`}
            >
              <span>
                {currentVisibleIndex === totalVisibleSteps - 1
                  ? "Calcular categoría"
                  : "Siguiente"}
              </span>
              {currentVisibleIndex === totalVisibleSteps - 1 ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <ArrowRight className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalcularCategoria;
