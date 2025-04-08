import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calculator, Check } from "lucide-react";

const servicios = [
  { id: "alta", label: "Alta de Monotributo", price: 5000 },
  { id: "recategorizacion", label: "Recategorización", price: 3000 },
  { id: "baja", label: "Baja de Monotributo", price: 2000 },
];

// Opciones de categoría para el desplegable
const categoriasOptions = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
];

// Opciones para Mes de Inicio
const mesesOptions = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Registro() {
  const router = useRouter();
  const { servicio, categoria: categoriaUrl } = router.query;

  const [currentStep, setCurrentStep] = useState(1); // Estado para multi-step
  const [formData, setFormData] = useState({
    // Campos comunes / iniciales
    tipoServicio: "",
    categoria: "",
    telefono: "",
    email: "",
    mensaje: "",
    // Campos Alta - Step 1
    actividad: "",
    mesInicio: "",
    // Campos Alta - Step 2
    cuit: "",
    claveFiscal: "",
    nombreCompleto: "", // Reemplaza nombre/apellido para Alta
    aceptaTerminos: false,
    // Campos Otros Servicios (si no es alta)
    nombre: "",
    apellido: "",
  });
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    console.log("Query Params recibidos:", router.query);
    // 1. Determinar estado inicial basado en URL Params
    let initialServicio = servicio || "";
    let initialCategoria = "";

    // Validar y usar categoría de la URL si existe y es válida
    if (categoriaUrl && categoriasOptions.includes(categoriaUrl)) {
      console.log(`Categoría válida encontrada en URL: ${categoriaUrl}`);
      initialCategoria = categoriaUrl;
      // Si viene categoría, asegurar que el servicio sea 'alta'
      initialServicio = "alta";
    } else {
      // Si no hay categoría válida en URL, asegurar que la categoría esté vacía
      // incluso si el servicio es 'alta' (forzar selección manual)
      initialCategoria = "";
    }

    // 2. Crear el objeto de estado inicial
    const initialFormData = {
      tipoServicio: initialServicio,
      categoria: initialCategoria,
      nombre: "", // Resetear otros campos si es necesario
      apellido: "",
      email: "",
      telefono: "",
      mensaje: "",
      actividad: "",
      mesInicio: "",
      cuit: "",
      claveFiscal: "",
      nombreCompleto: "",
      aceptaTerminos: false,
    };

    // 3. Establecer el estado del formulario
    console.log(
      "Estableciendo estado inicial del formulario:",
      initialFormData
    );
    setFormData(initialFormData);

    // 4. Establecer el servicio seleccionado
    let serviceData = null;
    if (initialFormData.tipoServicio) {
      serviceData = servicios.find(
        (s) => s.id === initialFormData.tipoServicio
      );
    }
    setSelectedService(serviceData);
    console.log("Servicio seleccionado establecido:", serviceData);

    // Re-ejecutar si cambian los parámetros de la URL
  }, [servicio, categoriaUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (name === "tipoServicio") {
      const service = servicios.find((s) => s.id === value);
      setSelectedService(service);
      setCurrentStep(1); // Resetear a paso 1 si cambia el servicio
      // Resetear campos específicos al cambiar servicio manualmente
      setFormData((prev) => ({
        ...prev,
        categoria: "",
        actividad: "",
        mesInicio: "",
        cuit: "",
        claveFiscal: "",
        nombreCompleto: "",
        aceptaTerminos: false,
        nombre: "",
        apellido: "",
      }));
    }
  };

  const handleNavigateToCalculator = () => {
    router.push("/calcular-categoria");
  };

  // --- Lógica Multi-step ---
  const handleNextStep = () => {
    // Validar campos del paso 1 para 'alta'
    if (!formData.actividad || !formData.telefono || !formData.mesInicio) {
      alert("Por favor, complete todos los campos obligatorios del paso 1.");
      return;
    }
    if (!formData.categoria) {
      // Validar categoría también aquí
      alert("Por favor, seleccione o calcule su categoría.");
      return;
    }
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };
  // --- Fin Lógica Multi-step ---

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);

    // Validaciones específicas para 'alta' en paso 2
    if (formData.tipoServicio === "alta") {
      if (
        !formData.cuit ||
        !formData.email ||
        !formData.claveFiscal ||
        !formData.nombreCompleto
      ) {
        alert("Por favor, complete todos los campos obligatorios del paso 2.");
        return;
      }
      if (!formData.aceptaTerminos) {
        alert("Debe aceptar los términos y condiciones.");
        return;
      }
    }
    // Validaciones para otros servicios (si fueran necesarias)
    else if (
      formData.tipoServicio === "recategorizacion" ||
      formData.tipoServicio === "baja"
    ) {
      if (
        !formData.nombre ||
        !formData.apellido ||
        !formData.email ||
        !formData.telefono
      ) {
        alert(
          "Por favor, complete Nombre, Apellido, Email y Teléfono para este trámite."
        );
        return;
      }
    } else {
      // Si no hay servicio seleccionado
      alert("Por favor, seleccione un tipo de servicio.");
      return;
    }

    // Proceder si todo es válido
    if (selectedService) {
      const queryData = {
        service: selectedService.label,
        price: selectedService.price,
        // Incluir datos relevantes según el servicio
        ...(formData.tipoServicio === "alta" && {
          categoria: formData.categoria,
          actividad: formData.actividad,
          mesInicio: formData.mesInicio,
          cuit: formData.cuit,
          email: formData.email, // Email se pide en paso 2 para alta
          telefono: formData.telefono, // Teléfono se pide en paso 1 para alta
          nombreCompleto: formData.nombreCompleto,
          // No enviar clave fiscal por seguridad
        }),
        ...(formData.tipoServicio !== "alta" && {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: formData.mensaje,
        }),
      };
      console.log("Redirigiendo a pago con datos:", queryData);

      router.push({
        pathname: "/payment",
        query: queryData,
      });
    } else {
      // Este caso ya se cubre en la validación anterior
      console.error(
        "Error inesperado: No hay servicio seleccionado pero se pasó la validación."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#E5F0FF] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1E293B] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Registro</h1>
          <p className="text-[#6B7280] mb-8">
            Complete el formulario para comenzar con el trámite
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- Selector de Servicio (Condicionalmente visible) --- */}
            {(formData.tipoServicio !== "alta" || currentStep === 1) && (
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Tipo de Servicio
                </label>
                <select
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  required
                  // Deshabilitar si ya estamos en el flujo de alta (paso 1) para evitar cambios accidentales?
                  // Opcional: podrías añadir disabled={formData.tipoServicio === 'alta'}
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} - ${s.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.tipoServicio === "alta" && (
              <>
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Categoría de Monotributo
                      </label>
                      <div className="flex items-center gap-4">
                        <select
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                          className="flex-grow px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                          required
                        >
                          <option value="">-- Seleccione --</option>
                          {categoriasOptions.map((cat) => (
                            <option key={cat} value={cat}>
                              Categoría {cat}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={handleNavigateToCalculator}
                          className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-100 text-[#6B7280] border border-gray-300 hover:bg-gray-200 transition-colors"
                          title="Calcular si no la sabes"
                        >
                          <Calculator className="w-4 h-4" />
                          <span className="hidden sm:inline">Calcular</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Si no conocés tu categoría, podés calcularla.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Actividad Principal
                      </label>
                      <input
                        type="text"
                        name="actividad"
                        value={formData.actividad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                        placeholder="Ej: Programación, Kiosco, Consultoría"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Mes Estimado de Inicio de Actividad
                      </label>
                      <select
                        name="mesInicio"
                        value={formData.mesInicio}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="">-- Seleccione Mes --</option>
                        {mesesOptions.map((mes) => (
                          <option key={mes} value={mes}>
                            {mes}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0066FF] text-white hover:bg-[#0066FF]/90 transition-all duration-300"
                      >
                        <span>Siguiente</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        CUIT
                      </label>
                      <input
                        type="text"
                        name="cuit"
                        value={formData.cuit}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Clave Fiscal (Nivel 3)
                      </label>
                      <input
                        type="password"
                        name="claveFiscal"
                        value={formData.claveFiscal}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1E293B] mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="aceptaTerminos"
                        name="aceptaTerminos"
                        checked={formData.aceptaTerminos}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="aceptaTerminos"
                        className="text-sm text-[#6B7280]"
                      >
                        He Leído y Acepto las{" "}
                        <a
                          href="/politica-privacidad"
                          target="_blank"
                          className="underline hover:text-[#0066FF]"
                        >
                          Política de privacidad
                        </a>{" "}
                        y los{" "}
                        <a
                          href="/terminos-condiciones"
                          target="_blank"
                          className="underline hover:text-[#0066FF]"
                        >
                          Términos y Condiciones
                        </a>{" "}
                        de contratación.
                      </label>
                    </div>
                    {selectedService && (
                      <p className="text-sm text-center text-[#6B7280] pt-4 border-t border-gray-200">
                        El costo del servicio es de{" "}
                        <strong>${selectedService.price}</strong> y lo pagarás
                        por MercadoPago a nombre de Sanstag SAS.
                      </p>
                    )}
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg hover:bg-gray-100 text-[#6B7280] transition-colors"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Anterior</span>
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-[#0066FF] text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-[#0066FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!formData.aceptaTerminos}
                      >
                        Proceder al pago
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {formData.tipoServicio && formData.tipoServicio !== "alta" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1E293B] mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Mensaje (opcional)
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  ></textarea>
                </div>
                {selectedService && (
                  <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                    <p className="text-[#1E293B] font-medium">
                      Total a pagar: ${selectedService.price}
                    </p>
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#0066FF] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0066FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Proceder al pago
                </motion.button>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
