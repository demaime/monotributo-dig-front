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
  UploadCloud,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "../components/Modal";
import { submitForm, uploadFiles } from "../utils/api";

const servicios = [
  {
    id: "alta_suscripcion",
    label: "ALTA GRATUITA + SUSCRIPCIÓN por 6 MESES",
    price: 20000,
  },
  { id: "alta", label: "Alta de Monotributo", price: 70000 },
  { id: "recategorizacion", label: "Recategorización", price: 50000 },
  { id: "baja", label: "Baja de Monotributo", price: 70000 },
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
  // --- State for Upload Modal ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [files, setFiles] = useState({
    frontDni: null,
    backDni: null,
    selfie: null,
  });
  const [uploading, setUploading] = useState(false); // Optional: for loading state
  const [documentosCargados, setDocumentosCargados] = useState(false); // <-- Nuevo estado
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío del formulario

  // --- Modal Functions ---
  // Updated openModal to accept actions
  const openModal = (title, message, actions = null, countdown = null) => {
    // Ensure other modals are closed when opening a general info modal
    setIsUploadModalOpen(false);
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
    closeModal(); // Close the first modal (info modal)
    // Open AFIP site based on what the user is missing
    if (formData.hasCuit === "no") {
      window.open("https://www.afip.gob.ar/cuit-cuil/", "_blank");
    } else if (formData.hasClaveFiscal === "no") {
      window.open("https://www.afip.gob.ar/clavefiscal/", "_blank");
    }
  };
  // --- End Action ---

  // --- File Handling Logic ---
  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles && inputFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] }));
    } else {
      // Handle case where user cancels file selection (optional)
      setFiles((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUploadSubmit = async () => {
    // Basic validation
    if (!files.frontDni || !files.backDni || !files.selfie) {
      openModal(
        "Archivos Faltantes",
        "Por favor, cargue los tres archivos requeridos."
      );
      return;
    }

    setUploading(true); // Indicate loading

    try {
      // Send files to backend via API utility
      const result = await uploadFiles(files, {
        email: formData.email,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
      });

      // Success handling
      setUploading(false);
      setDocumentosCargados(true);
      openModal(
        "¡Carga Exitosa!",
        "Sus documentos han sido cargados. Uno de nuestros representantes se pondrá en contacto a la brevedad para continuar con el trámite."
      );
      setIsUploadModalOpen(false); // Close upload modal
      setFiles({ frontDni: null, backDni: null, selfie: null }); // Reset files state
    } catch (error) {
      setUploading(false);
      console.error("Upload error:", error);
      // Use the standard modal for showing the error to the user
      openModal(
        "Error de Carga",
        "Hubo un problema al cargar sus archivos. Por favor, verifique los archivos e intente nuevamente. Si el problema persiste, contáctenos."
      );
      // Keep the upload modal open so the user can retry
    }
  };
  // --- End File Handling Logic ---

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
  }, [servicio, categoriaUrl, router.query]);

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
        // 1. Check if CUIT/Clave questions need to be answered
        if (formData.hasCuit === null || formData.hasClaveFiscal === null) {
          openModal(
            "Verificación Requerida",
            "Por favor, indique si posee CUIT y Clave Fiscal."
          );
          return; // Stop: Need CUIT/Clave status
        }

        // 2. Check if answered "no" to having CUIT
        if (formData.hasCuit === "no") {
          openModal(
            <span className="flex items-center gap-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Información
              Necesaria
            </span>,
            <div>
              <p>El CUIT es necesario para realizar este trámite.</p>
              <p className="mt-2">
                Por favor, obtenga primero su CUIT antes de continuar con este
                proceso.
              </p>
            </div>,
            [
              {
                text: (
                  <span className="flex items-center gap-x-1.5">
                    <KeyRound className="w-4 h-4" /> Obtener CUIT
                  </span>
                ),
                onClick: handleObtenerCredenciales, // Opens AFIP site
                style: "primary",
              },
              { text: "Cancelar", onClick: closeModal, style: "secondary" },
            ]
          );
          return; // Stop: Need CUIT
        }

        // 3. Check if answered "no" to having Clave Fiscal
        if (formData.hasClaveFiscal === "no") {
          openModal(
            <span className="flex items-center gap-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" /> Información
              Necesaria
            </span>,
            <div>
              <p>La Clave Fiscal es necesaria para realizar este trámite.</p>
              <p className="mt-2">
                Por favor, obtenga su Clave Fiscal antes de continuar con este
                proceso.
              </p>
            </div>,
            [
              {
                text: (
                  <span className="flex items-center gap-x-1.5">
                    <KeyRound className="w-4 h-4" /> Obtener Clave Fiscal
                  </span>
                ),
                onClick: handleObtenerCredenciales, // Opens AFIP site
                style: "primary",
              },
              { text: "Cancelar", onClick: closeModal, style: "secondary" },
            ]
          );
          return; // Stop: Need Clave Fiscal
        }

        // 5. Validate the other essential fields for Alta Step 1.
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
          return; // Stop: Other fields missing
        }

        // All checks passed for Alta Step 1, proceed to Step 2 (Documents)
        setCurrentStep(2);
      } else {
        // --- Logic for Non-Alta services in Step 1 ---
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
        // For non-alta, Step 1 is the last step, submit is handled by the button
      }
    }
    // --- Step 2 Logic (Documents for Alta flow) ---
    else if (currentStep === 2 && isAltaFlow) {
      // Validate required files and email
      if (!files.frontDni || !files.backDni || !files.selfie) {
        openModal(
          "Documentos Requeridos",
          "Por favor, adjunte los tres documentos requeridos: frente del DNI, dorso del DNI y selfie."
        );
        return;
      }

      if (!formData.email) {
        openModal(
          "Email Requerido",
          "Por favor, ingrese su dirección de email para que podamos contactarlo."
        );
        return;
      }

      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        openModal(
          "Email Inválido",
          "Por favor, ingrese una dirección de email válida."
        );
        return;
      }

      // Upload files before proceeding to next step
      setUploading(true);
      uploadFiles(files, {
        email: formData.email,
        nombre: formData.nombre || "",
        apellido: formData.apellido || "",
        telefono: formData.telefono || "",
      })
        .then((result) => {
          setUploading(false);
          setDocumentosCargados(true);
          // Success - proceed to next step
      setCurrentStep(3);
        })
        .catch((error) => {
          setUploading(false);
          console.error("Upload error:", error);
          openModal(
            "Error de Carga",
            "Hubo un problema al cargar sus archivos. Por favor, verifique los archivos e intente nuevamente. Si el problema persiste, contáctenos."
          );
        });
    }
    // --- Step 3 Logic (Personal Data for Alta flow) ---
    else if (currentStep === 3 && isAltaFlow) {
      if (!formData.cuit || !formData.claveFiscal) {
        openModal(
          "Campos Incompletos",
          "Por favor, complete todos los campos requeridos: CUIT y Clave Fiscal."
        );
        return;
      }
      setCurrentStep(4);
    }
    // --- Step 4 Logic (Confirmation for Alta flow) ---
    else if (currentStep === 4 && isAltaFlow) {
      // Final form validation happens in handleSubmit
      // This step only has the terms checkbox
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // handleSubmit needs adjustment for the last step (now step 4 for alta)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ensure preventDefault is called
    console.log("Datos del formulario:", formData);

    setIsSubmitting(true); // Iniciar el estado de carga

    // Final validation for Alta (Step 4)
    if (
      (formData.tipoServicio === "alta" ||
        formData.tipoServicio === "alta_suscripcion") &&
      currentStep === 4
    ) {
      if (!formData.aceptaTerminos) {
        setIsSubmitting(false); // Detener carga si hay error de validación
        openModal(
          "Términos y Condiciones",
          "Debe aceptar los términos y condiciones para continuar."
        );
        return;
      }

      // Ensure we have document uploads
      if (!documentosCargados) {
        setIsSubmitting(false);
        openModal(
          "Documentos Faltantes",
          "Es necesario cargar los documentos requeridos antes de finalizar el proceso."
        );
        setCurrentStep(2); // Return to document upload step
        return;
      }

      try {
        // Generate nombreCompleto from nombre and apellido if it's missing
        const nombreApellido = `${formData.nombre} ${formData.apellido}`.trim();
        
        // Include information about documents being uploaded
        const completeFormData = {
          ...formData,
          nombreCompleto: nombreApellido, // Set nombreCompleto based on nombre and apellido
          documentosCargados: documentosCargados,
        };

        // Submit form data via API utility
        const result = await submitForm(completeFormData);

        openModal(
          "¡Éxito!",
          "Su solicitud ha sido enviada.",
          [
            {
              text: "Volver al inicio",
              onClick: () => {
                closeModal();
                router.push("/");
              },
              style: "primary",
            },
          ],
          5
        ); // 5 second countdown

        // Redirección automática después de 5 segundos
        setTimeout(() => {
          closeModal();
          router.push("/");
        }, 5000);
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        openModal(
          "Error",
          "Hubo un problema al enviar su solicitud. Por favor, inténtelo de nuevo más tarde."
        );
      } finally {
        setIsSubmitting(false); // Finalizar estado de carga independientemente del resultado
      }
    }
    // Final validation for Other Services (triggered from handleNextStep in step 1)
    else if (
      formData.tipoServicio !== "alta" &&
      formData.tipoServicio !== "alta_suscripcion" &&
      currentStep === 1
    ) {
      try {
        // Submit form data via API utility
        const result = await submitForm(formData);

        openModal(
          "¡Éxito!",
          `Su solicitud de ${selectedService?.label} ha sido enviada.`,
          [
            {
              text: "Volver al inicio",
              onClick: () => {
                closeModal();
                router.push("/");
              },
              style: "primary",
            },
          ],
          5 // 5 second countdown
        );

        // Redirección automática después de 5 segundos
        setTimeout(() => {
          closeModal();
          router.push("/");
        }, 5000);
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        openModal(
          "Error",
          "Hubo un problema al enviar su solicitud. Por favor, inténtelo de nuevo más tarde."
        );
      } finally {
        setIsSubmitting(false); // Finalizar estado de carga independientemente del resultado
      }
    }
    // Add a fallback for unexpected states?
    else {
      console.warn(
        "handleSubmit called in unexpected state:",
        currentStep,
        formData.tipoServicio
      );
      setIsSubmitting(false); // Finalizar estado de carga
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
                      {s.id === "alta_suscripcion" ? " por mes" : ""}
                    </option>
                  ))}
                </select>
              </div>

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
      case 2: // Step 2: Document Upload for Alta flows
        return formData.tipoServicio === "alta" ||
          formData.tipoServicio === "alta_suscripcion"
          ? renderAltaStep2_Documents()
          : null;
      case 3: // Step 3: Alta Step 3 fields (Personal and Fiscal Data)
        return formData.tipoServicio === "alta" ||
          formData.tipoServicio === "alta_suscripcion"
          ? renderAltaStep3()
          : null;
      case 4: // Step 4: Alta Terms and Conditions
        return formData.tipoServicio === "alta" ||
          formData.tipoServicio === "alta_suscripcion"
          ? renderAltaStep4()
          : null;
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
        <p className="text-xs font-semibold text-blue-500 mt-1">
          Si no conocés tu categoría,{" "}
          <span
            className="underline cursor-pointer hover:text-blue-700"
            onClick={handleNavigateToCalculator}
          >
            podés calcularla
          </span>
          .
        </p>
      </div>

      {/* --- CUIT/Clave Check (Moved here) --- */}
      {/* CUIT Check */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">
          ¿Posee CUIT? <span className="text-red-500">*</span>
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
          ¿Posee{" "}
          <a
            href="https://www.afip.gob.ar/clavefiscal/ayuda/obtener-clave-fiscal.asp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Clave Fiscal (nivel 2+)
          </a>
          ? <span className="text-red-500">*</span>
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

      {/* Documentos Cargados - Display indicator if documents are uploaded */}
      {documentosCargados && (
        <div className="md:col-span-2 flex items-center gap-x-2 p-2 border border-green-300 rounded-md bg-green-50">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Documentos adjuntados correctamente
          </span>
        </div>
      )}

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

  // NUEVO: Renderizar el paso de documentos (Paso 2)
  const renderAltaStep2_Documents = () => (
    <motion.div
      key="step2-documents"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Paso 2: Verificación de Identidad
      </h2>

      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
        <p className="text-sm text-blue-800">
          Para completar su alta de monotributo, necesitamos verificar su
          identidad. Por favor adjunte los siguientes documentos:
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email de contacto <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Usaremos este email para contactarlo sobre su trámite.
          </p>
        </div>

        {/* Front DNI Input */}
        <div>
          <label
            htmlFor="frontDni"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frente del DNI <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => document.getElementById("frontDni").click()}
                className={`w-full p-2 border border-gray-300 rounded-md text-xs text-left flex items-center ${
                  files.frontDni ? "bg-gray-50" : "bg-white"
                }`}
              >
                {files.frontDni ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    {files.frontDni.name.length > 25
                      ? `${files.frontDni.name.substring(0, 25)}...`
                      : files.frontDni.name}
                  </span>
                ) : (
                  <span className="flex items-center text-gray-500">
                    <UploadCloud className="w-4 h-4 mr-2 text-gray-400" />
                    Seleccionar archivo
                  </span>
                )}
              </button>
              <input
                type="file"
                id="frontDni"
                name="frontDni"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Back DNI Input */}
        <div>
          <label
            htmlFor="backDni"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Dorso del DNI <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => document.getElementById("backDni").click()}
                className={`w-full p-2 border border-gray-300 rounded-md text-xs text-left flex items-center ${
                  files.backDni ? "bg-gray-50" : "bg-white"
                }`}
              >
                {files.backDni ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    {files.backDni.name.length > 25
                      ? `${files.backDni.name.substring(0, 25)}...`
                      : files.backDni.name}
                  </span>
                ) : (
                  <span className="flex items-center text-gray-500">
                    <UploadCloud className="w-4 h-4 mr-2 text-gray-400" />
                    Seleccionar archivo
                  </span>
                )}
              </button>
              <input
                type="file"
                id="backDni"
                name="backDni"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Selfie Input */}
        <div>
          <label
            htmlFor="selfie"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selfie <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => document.getElementById("selfie").click()}
                className={`w-full p-2 border border-gray-300 rounded-md text-xs text-left flex items-center ${
                  files.selfie ? "bg-gray-50" : "bg-white"
                }`}
              >
                {files.selfie ? (
                  <span className="flex items-center text-green-600">
                    <Check className="w-4 h-4 mr-2" />
                    {files.selfie.name.length > 25
                      ? `${files.selfie.name.substring(0, 25)}...`
                      : files.selfie.name}
                  </span>
                ) : (
                  <span className="flex items-center text-gray-500">
                    <UploadCloud className="w-4 h-4 mr-2 text-gray-400" />
                    Seleccionar archivo
                  </span>
                )}
              </button>
              <input
                type="file"
                id="selfie"
                name="selfie"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Asegúrese de que su rostro se vea completo y claro.
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Renombrar renderAltaStep2 a renderAltaStep3 (datos personales)
  const renderAltaStep3 = () => (
    <motion.div
      key="step3-alta"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Paso 3: Datos Personales y Fiscales
      </h2>
      
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
    </motion.div>
  );

  // Renombrar renderAltaStep3 a renderAltaStep4 (confirmación y términos)
  const renderAltaStep4 = () => (
    <motion.div
      key="step4-alta"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Paso 4: Confirmación
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
    // Main container with padding-top to clear fixed nav
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start p-4 relative">
      {/* Back button container - Place it *inside* the padded container */}
      <div className="w-full max-w-2xl mb-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al inicio
        </button>
      </div>

      {/* The main form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Make sure card doesn't have negative margin or positioning that pulls it up
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
              const lastAltaStep = 4; // Updated for the new 4-step flow
              const lastOtherStep = 1;
              const isLastStep = isAltaFlow
                ? currentStep === lastAltaStep
                : currentStep === lastOtherStep;

              if (!isLastStep && currentStep !== 2) {
                // Show 'Siguiente' button for steps that don't have special handling
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
                      // Step 3 (Alta): Disable if fields missing
                      (currentStep === 3 &&
                        isAltaFlow &&
                        (!formData.cuit ||
                          !formData.claveFiscal))
                    }
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                );
              } else if (currentStep === 2) {
                // Special case for Step 2 (Documents) with upload handling
                return (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={
                      uploading ||
                      !files.frontDni ||
                      !files.backDni ||
                      !files.selfie ||
                      !formData.email
                    }
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <span className="animate-pulse">Subiendo...</span>
                      </>
                    ) : (
                      <>
                        Siguiente <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
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
                          !formData.tipoServicio ||
                          isSubmitting)) ||
                      // Step 4 (alta): Disable if terms not accepted or is submitting
                      (currentStep === lastAltaStep &&
                        isAltaFlow &&
                        (!formData.aceptaTerminos || isSubmitting))
                    }
                    className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                    <Check className="w-4 h-4 mr-2" /> Finalizar Solicitud
                      </>
                    )}
                  </button>
                );
              }
            })()}
          </div>
        </form>
      </motion.div>

      {/* Info/Error Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        actions={modalActions}
        countdown={
          modalActions.length > 0 && modalTitle === "¡Éxito!" ? 5 : null
        }
      >
        {modalMessage}
      </Modal>
    </div>
  );
}
