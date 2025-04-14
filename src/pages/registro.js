import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  AlertTriangle,
  KeyRound,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../components/Modal";

const servicios = [
  { id: "alta", label: "Alta de Monotributo", price: 70000 },
  { id: "recategorizacion", label: "Recategorización", price: 50000 },
  { id: "baja", label: "Baja de Monotributo", price: 70000 },
  { id: "alta_suscripcion", label: "Alta + Suscripción Mensual", price: 20000 },
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

export default function Registro() {
  const router = useRouter();
  const { servicio, categoria: categoriaUrl } = router.query;

  // Start directly at Step 1 (Service Selection / Initial Fields)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hasCuit: null, // Still needed for conditional check
    hasClaveFiscal: null,
    tipoServicio: "",
    categoria: "",
    telefono: "",
    email: "",
    mensaje: "",
    actividad: "",
    mesInicio: null,
    cuit: "",
    claveFiscal: "",
    nombreCompleto: "",
    aceptaTerminos: false,
    nombre: "",
    apellido: "",
  });
  const [selectedService, setSelectedService] = useState(null);
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalActions, setModalActions] = useState([]); // State for modal actions

  // --- Modal Functions ---
  // Updated openModal to accept actions
  const openModal = (title, message, actions = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalActions(actions || []); // Use provided actions or empty array (Modal will use default)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalMessage("");
    setModalActions([]); // Clear actions on close
  };
  // --- End Modal Functions ---

  // --- Action for Modal Button ---
  const handleObtenerCredenciales = () => {
    // Redirect to AFIP or a help page
    // For now, let's just log it and close the modal
    console.log("Redirecting to AFIP for credentials...");
    window.open("https://www.afip.gob.ar/claveFiscal/", "_blank"); // Open AFIP link in new tab
    closeModal();
  };
  // --- End Action ---

  useEffect(() => {
    console.log("Query Params recibidos:", router.query);
    let initialServicio = servicio || "";
    let initialCategoria = "";

    if (categoriaUrl && categoriasOptions.includes(categoriaUrl)) {
      initialCategoria = categoriaUrl;
      initialServicio = "alta";
    } else {
      initialCategoria = "";
    }

    const initialFormData = {
      hasCuit: null,
      hasClaveFiscal: null,
      tipoServicio: initialServicio,
      categoria: initialCategoria,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      mensaje: "",
      actividad: "",
      mesInicio: null,
      cuit: "",
      claveFiscal: "",
      nombreCompleto: "",
      aceptaTerminos: false,
    };
    setFormData(initialFormData);

    let serviceData = null;
    if (initialFormData.tipoServicio) {
      serviceData = servicios.find(
        (s) => s.id === initialFormData.tipoServicio
      );
    }
    setSelectedService(serviceData);
    // Always start at step 1
    setCurrentStep(1);
  }, [servicio, categoriaUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (name === "hasCuit" || name === "hasClaveFiscal") {
      // Keep the value as 'yes' or 'no' string
    } else {
      val = type === "checkbox" ? checked : value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (name === "tipoServicio") {
      const service = servicios.find((s) => s.id === value);
      setSelectedService(service);
      // Reset check answers when service changes
      setFormData((prev) => ({
        ...prev,
        hasCuit: null,
        hasClaveFiscal: null,
        categoria: "",
        actividad: "",
        mesInicio: null,
        cuit: "",
        claveFiscal: "",
        nombreCompleto: "",
        aceptaTerminos: false,
        nombre: "",
        apellido: "",
      }));
      setCurrentStep(1); // Stay on Step 1
    }
  };

  // Handler specifically for DatePicker
  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      mesInicio: date,
    }));
  };

  const handleNavigateToCalculator = () => {
    router.push("/calcular-categoria");
  };

  // --- Lógica Multi-step ---
  const handleNextStep = () => {
    const isAltaFlow =
      formData.tipoServicio === "alta" ||
      formData.tipoServicio === "alta_suscripcion";

    // --- Step 1 Logic ---
    if (currentStep === 1) {
      if (!formData.tipoServicio) {
        openModal(
          "Servicio Requerido",
          "Por favor, seleccione un tipo de servicio."
        );
        return;
      }

      if (isAltaFlow) {
        // 1. Check CUIT/Clave First
        if (formData.hasCuit === null || formData.hasClaveFiscal === null) {
          openModal(
            "Verificación Requerida",
            "Por favor, indique si posee CUIT/CUIL y Clave Fiscal."
          );
          return;
        }
        if (formData.hasCuit === "no" || formData.hasClaveFiscal === "no") {
          openModal(
            <span className="flex items-center gap-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Información
              Necesaria
            </span>,
            "El CUIT/CUIL y la Clave Fiscal son necesarios para realizar este trámite.",
            [
              {
                text: (
                  <span className="flex items-center gap-x-1.5">
                    <KeyRound className="w-4 h-4" /> Obtener Credenciales
                  </span>
                ),
                onClick: handleObtenerCredenciales,
                style: "primary",
              },
              { text: "Cancelar", onClick: closeModal, style: "secondary" },
            ]
          );
          return;
        }
        // 2. If CUIT/Clave OK, validate other Alta Step 1 fields
        if (
          !formData.actividad ||
          !formData.telefono ||
          !formData.mesInicio ||
          !formData.categoria
        ) {
          openModal(
            "Campos Incompletos",
            "Por favor, complete Actividad, Teléfono, Mes de Inicio y Categoría."
          );
          return;
        }
        // Both checks passed for Alta Step 1, proceed to Step 2
        setCurrentStep(2);
      } else {
        // --- Logic for Non-Alta services in Step 1 ---
        // (Baja, Recategorización)
        // Validate their specific fields
        if (
          !formData.nombre ||
          !formData.apellido ||
          !formData.email ||
          !formData.telefono
        ) {
          openModal(
            "Campos Incompletos",
            "Por favor, complete Nombre, Apellido, Email y Teléfono."
          );
          return;
        }
        // Validation passed for non-alta, but there's no automatic next step.
        // The submit button will just become enabled.
        // console.log("Non-alta Step 1 validation passed");
      }
    }
    // --- Step 2 Logic (Only Alta) ---
    else if (currentStep === 2 && isAltaFlow) {
      if (
        !formData.cuit ||
        !formData.email ||
        !formData.claveFiscal ||
        !formData.nombreCompleto
      ) {
        openModal(
          "Campos Incompletos",
          "Por favor, complete CUIT, Email, Clave Fiscal y Nombre Completo."
        );
        return;
      }
      setCurrentStep(3);
    }
    // --- Step 3 Logic (Only Alta) ---
    else if (currentStep === 3 && isAltaFlow) {
      // This step only has the terms checkbox, validation happens in handleSubmit
      // But we might need a next step action if adding more steps later.
      // For now, clicking "Finalizar" triggers handleSubmit directly.
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // handleSubmit needs slight adjustment for when it's called (step 3 for alta)
  const handleSubmit = (e) => {
    e.preventDefault(); // Ensure preventDefault is called
    console.log("Datos del formulario:", formData);

    // Final validation for Alta (Step 3)
    if (formData.tipoServicio === "alta" && currentStep === 3) {
      if (!formData.aceptaTerminos) {
        openModal(
          "Términos y Condiciones",
          "Debe aceptar los términos y condiciones para continuar."
        );
        return;
      }
      // --- SUBMIT LOGIC FOR ALTA GOES HERE ---
      console.log("SUBMITTING ALTA DATA...");
      openModal("¡Éxito!", "Su solicitud de alta ha sido enviada."); // Example success
      // Potentially redirect or reset form: router.push('/gracias');
    }
    // Final validation for Other Services (triggered from handleNextStep in step 1)
    else if (formData.tipoServicio !== "alta" && currentStep === 1) {
      // Validation was already done in handleNextStep before calling handleSubmit
      // --- SUBMIT LOGIC FOR OTHER SERVICES GOES HERE ---
      console.log("SUBMITTING OTHER SERVICE DATA...");
      openModal(
        "¡Éxito!",
        `Su solicitud de ${selectedService?.label} ha sido enviada.`
      ); // Example success
      // Potentially redirect or reset form: router.push('/gracias');
    }
    // Add a fallback for unexpected states?
    else {
      console.warn(
        "handleSubmit called in unexpected state:",
        currentStep,
        formData.tipoServicio
      );
    }
  };

  // --- Rendering Logic ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Step 1: Service Selection, Fields (and conditional CUIT check)
        const isAltaFlow =
          formData.tipoServicio === "alta" ||
          formData.tipoServicio === "alta_suscripcion";

        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Use grid layout for all fields in this step */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-6">
              {/* --- Service Selection --- */}
              <div className="md:col-span-2">
                <label
                  htmlFor="tipoServicio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Servicio <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipoServicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} -{" "}
                      {s.price.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </option>
                  ))}
                </select>
              </div>

              {/* --- CUIT/Clave Check (Rendered conditionally inline within the grid) --- */}
              {isAltaFlow && (
                <>
                  {/* CUIT Check */}
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Posee CUIT/CUIL? <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex items-center gap-x-3">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="hasCuit"
                          value="yes"
                          checked={formData.hasCuit === "yes"}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                          Sí
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="hasCuit"
                          value="no"
                          checked={formData.hasCuit === "no"}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                          No
                        </div>
                      </label>
                    </div>
                  </fieldset>

                  {/* Clave Fiscal Check */}
                  <fieldset>
                    <legend className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Posee Clave Fiscal (nivel 2+)?{" "}
                      <span className="text-red-500">*</span>
                    </legend>
                    <div className="flex items-center gap-x-3">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="hasClaveFiscal"
                          value="yes"
                          checked={formData.hasClaveFiscal === "yes"}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                          Sí
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="hasClaveFiscal"
                          value="no"
                          checked={formData.hasClaveFiscal === "no"}
                          onChange={handleChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 peer-checked:text-white peer-checked:border-blue-500">
                          No
                        </div>
                      </label>
                    </div>
                  </fieldset>
                </>
              )}

              {/* --- Conditional Form Rendering (Main Fields) --- */}
              {isAltaFlow && renderAltaStep1Fields()}
              {!isAltaFlow &&
                formData.tipoServicio &&
                renderOtherServicesFields()}
            </div>

            {/* Placeholder Text if no service selected */}
            {!formData.tipoServicio && (
              <p className="text-center text-gray-500 pt-4">
                (Seleccione un servicio para ver los campos requeridos)
              </p>
            )}
          </motion.div>
        );
      case 2: // Step 2: Alta Step 2 fields
        return formData.tipoServicio === "alta" ? renderAltaStep2() : null;
      case 3: // Step 3: Alta Terms and Conditions
        return formData.tipoServicio === "alta" ? renderAltaStep3() : null;
      default:
        return null;
    }
  };

  // --- Helper rendering functions ---

  // Render fields for Alta Step 1
  const renderAltaStep1Fields = () => (
    <>
      {/* Categoría + Calcular Button */}
      <div className="md:col-span-2">
        <label
          htmlFor="categoria"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Categoría <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-x-2">
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Seleccione</option>
            {categoriasOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleNavigateToCalculator}
            className="flex-shrink-0 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            title="Calcular si no la sabes"
          >
            <Calculator className="w-4 h-4 mr-1.5" />
            Calcular
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Si no conocés tu categoría, podés calcularla.
        </p>
      </div>

      {/* Actividad */}
      <div className="md:col-span-2">
        <label
          htmlFor="actividad"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Actividad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="actividad"
          name="actividad"
          value={formData.actividad}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ej: Venta de Ropa, Servicios de Consultoría"
        />
      </div>

      {/* Telefono */}
      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Ej: 1123456789"
        />
      </div>

      {/* Mes Inicio */}
      <div>
        <label
          htmlFor="mesInicio"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Mes Inicio <span className="text-red-500">*</span>
        </label>
        <DatePicker
          selected={formData.mesInicio}
          onChange={handleDateChange}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholderText="Seleccione mes y año"
        />
      </div>
    </>
  );

  // Render fields for Other Services Step 1
  const renderOtherServicesFields = () => (
    <>
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Apellido */}
      <div>
        <label
          htmlFor="apellido"
          className="block text-sm font-medium text-gray-700"
        >
          Apellido <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Telefono */}
      <div>
        <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700"
        >
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Mensaje Adicional */}
      <div className="md:col-span-2">
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-gray-700"
        >
          Mensaje (Opcional)
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>
      </div>
    </>
  );

  // renderAltaStep2 (Called for Case 2)
  const renderAltaStep2 = () => (
    <motion.div
      key="step2-alta"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Paso 2: Datos Personales y Fiscales
      </h2>
      {/* CUIT */}
      <div>
        <label
          htmlFor="cuit"
          className="block text-sm font-medium text-gray-700"
        >
          CUIT <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="cuit"
          name="cuit"
          value={formData.cuit}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Sin guiones"
        />
      </div>
      {/* Clave Fiscal */}
      <div>
        <label
          htmlFor="claveFiscal"
          className="block text-sm font-medium text-gray-700"
        >
          Clave Fiscal <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="claveFiscal"
          name="claveFiscal"
          value={formData.claveFiscal}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Nombre Completo */}
      <div>
        <label
          htmlFor="nombreCompleto"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre y Apellido Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombreCompleto"
          name="nombreCompleto"
          value={formData.nombreCompleto}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="ejemplo@correo.com"
        />
      </div>
    </motion.div>
  );

  // renderAltaStep3 (Called for Case 3)
  const renderAltaStep3 = () => (
    <motion.div
      key="step3-alta"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Paso 3: Confirmación
      </h2>
      {/* Terminos */}
      <div className="mt-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleChange}
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            Acepto los{" "}
            <a
              href="/terminos-y-condiciones"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              términos y condiciones
            </a>
            . <span className="text-red-500">*</span>
          </span>
        </label>
      </div>
      {/* Mensaje Adicional */}
      <div>
        <label
          htmlFor="mensaje"
          className="block text-sm font-medium text-gray-700"
        >
          Mensaje (Opcional)
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Si desea agregar alguna aclaración..."
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver al inicio
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-5 rounded-xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Registro</h1>
          <p className="text-gray-600">
            Complete los siguientes datos para comenzar con el trámite.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            {/* Back Button - Show only if currentStep > 1 */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </button>
            ) : (
              <div />
            )}

            {/* Next/Submit Button Logic - Updated */}
            {(() => {
              const isAltaFlow =
                formData.tipoServicio === "alta" ||
                formData.tipoServicio === "alta_suscripcion";
              const lastAltaStep = 3;
              const lastOtherStep = 1;
              const isLastStep = isAltaFlow
                ? currentStep === lastAltaStep
                : currentStep === lastOtherStep;

              if (!isLastStep) {
                // Show 'Siguiente' button
                return (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      // Step 1 (Alta): Disable if service missing OR CUIT check missing OR fields missing
                      (currentStep === 1 &&
                        isAltaFlow &&
                        (!formData.tipoServicio ||
                          formData.hasCuit === null ||
                          formData.hasClaveFiscal === null ||
                          !formData.actividad ||
                          !formData.telefono ||
                          !formData.mesInicio ||
                          !formData.categoria)) ||
                      // Step 1 (Other): Disable if service missing OR fields missing
                      (currentStep === 1 &&
                        !isAltaFlow &&
                        (!formData.tipoServicio ||
                          !formData.nombre ||
                          !formData.apellido ||
                          !formData.email ||
                          !formData.telefono)) ||
                      // Step 2 (Alta): Disable if fields missing
                      (currentStep === 2 &&
                        isAltaFlow &&
                        (!formData.cuit ||
                          !formData.email ||
                          !formData.claveFiscal ||
                          !formData.nombreCompleto))
                    }
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                );
              } else {
                // Show 'Finalizar Solicitud' button on the last step
                return (
                  <button
                    type="submit"
                    disabled={
                      // Step 1 (non-alta): Disable if fields missing
                      (currentStep === lastOtherStep &&
                        !isAltaFlow &&
                        (!formData.nombre ||
                          !formData.apellido ||
                          !formData.email ||
                          !formData.telefono ||
                          !formData.tipoServicio)) ||
                      // Step 3 (alta): Disable if terms not accepted
                      (currentStep === lastAltaStep &&
                        isAltaFlow &&
                        !formData.aceptaTerminos)
                    }
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 mr-2" /> Finalizar Solicitud
                  </button>
                );
              }
            })()}
          </div>
        </form>
      </motion.div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        actions={modalActions}
      >
        {modalMessage}
      </Modal>
    </div>
  );
}
