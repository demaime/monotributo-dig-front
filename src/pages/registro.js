import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  XCircle,
  X,
  CheckCircle,
  Upload,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const servicios = [
  { id: "plan_base", nombre: "Plan Base" },
  { id: "plan_full", nombre: "Plan Full" },
  { id: "plan_premium", nombre: "Plan Premium" },
  { id: "alta", nombre: "Alta de Monotributo" },
  { id: "recategorizacion", nombre: "Recategorización" },
  { id: "baja", nombre: "Baja de Monotributo" },
  { id: "factura_adicional", nombre: "Emisión de Factura Adicional" },
];

// Define los servicios que siguen el flujo corto (paso 2 simplificado)
const serviciosFlujoCorto = ["recategorizacion", "baja", "factura_adicional"];
// Define los servicios que siguen el flujo de alta/planes
const serviciosFlujoAlta = ["plan_base", "plan_full", "plan_premium", "alta"];

// --- Framer Motion Variants ---
const stepVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "100%" : "-100%", // Slide in from right/left
    transition: { duration: 0.3 },
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: 0.1 }, // Add slight delay for smoother feel
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? "-100%" : "100%", // Slide out to left/right
    transition: { duration: 0.3 },
  }),
};

// --- Opciones para el Paso 10 ---
const opcionesTipoTrabajo = [
  {
    id: "independiente",
    label: "Voy a realizar trabajo independiente",
    descripcion: "Venta de productos o servicios, con o sin empleados.",
  },
  {
    id: "cooperativa",
    label: "Como miembro de una cooperativa",
    descripcion:
      "La cooperativa debe estar registrada en ARCA y tenés que tener la CUIT.",
  },
  {
    id: "promovido",
    label: "Como trabajador promovido",
    descripcion: "Opción especial para trabajadores en condiciones precarias.",
    // link: { text: "Conocé los requisitos.", url: "#" } // Placeholder para enlace
  },
  {
    id: "locador",
    label: "Como locador de hasta 2 inmuebles",
    descripcion:
      "Opción exclusiva para aquellos alcanzados por el art. 8 de la Ley 27.737.",
  },
];

// --- Opciones para Paso 11 (Facturación Anual) ---
const opcionesFacturacion = [
  "Hasta $7.813.063",
  "Entre $7.813.064 y $11.447.046",
  "Entre $11.447.047 y $16.050.091",
  "Entre $16.050.092 y $19.926.340",
  "Entre $19.926.341 y $23.439.190",
  "Entre $23.439.191 y $29.374.695",
  "Entre $29.374.696 y $35.128.502",
  "Entre $35.128.503 y $53.298.417",
  "Entre $53.298.418 y $59.657.887",
  "Entre $59.657.888 y $68.318.880",
  "Entre $68.318.881 y $82.370.281",
];

// --- Opciones para Paso 12 (Aportes Jubilación) ---
const opcionesAportes = [
  {
    id: "activo",
    label: "Trabajador activo",
    descripcion: "Voy a pagar la jubilación y obra social con el monotributo.",
  },
  {
    id: "dependencia",
    label: "Empleado en relación de dependencia",
    descripcion:
      "Cobro regularmente un sueldo y mi empleador hace los aportes a la jubilación y obra social a mi nombre.",
  },
  {
    id: "jubilado",
    label: "Jubilado",
    descripcion:
      "Cobro una jubilación mensual luego de aportar durante mi vida como trabajador.",
  },
  {
    id: "caja_provincial",
    label: "Aporto a una Caja Previsional Provincial",
    descripcion:
      "Algunas profesiones (como Maestros, Médicos, Abogados y otros) aportan a su propia caja previsional.",
  },
  {
    id: "locador_bienes",
    label: "Locador de bienes muebles o inmuebles",
    descripcion:
      "Si ejercés sólo esta actividad y no te encontrás organizado en forma de empresa, no corresponde pagar jubilación y obra social con el monotributo.",
  },
];

// --- Opciones para Paso 13 (Obra Social) - Extraído de SSSalud ---
// Nota: Los RNAS se formatean quitando guiones y ceros iniciales según los enlaces del sitio.
const opcionesObraSocial = [
  {
    rnos: "1508",
    denominacion:
      "OBRA SOCIAL DE LA ASOCIACION CIVIL PROSINDICATO DE AMAS DE CASA DE LA REPUBLICA ARGENTINA",
  },
  {
    rnos: "2105",
    denominacion:
      "OBRA SOCIAL PROFESIONALES DEL TURF DE LA REPUBLICA ARGENTINA",
  },
  {
    rnos: "2501",
    denominacion: "OBRA SOCIAL DE MINISTROS, SECRETARIOS Y SUBSECRETARIOS",
  },
  {
    rnos: "2600",
    denominacion:
      "OBRA SOCIAL DE LOS TRABAJADORES DE LA CARNE Y AFINES DE LA REPUBLICA ARGENTINA",
  },
  {
    rnos: "3405",
    denominacion:
      "OBRA SOCIAL ASOCIACION MUTUAL DE LOS OBREROS CATOLICOS PADRE FEDERICO GROTE",
  },
  {
    rnos: "3504",
    denominacion:
      "OBRA SOCIAL DE CONDUCTORES TITULARES DE TAXIS DE LA CIUDAD AUTONOMA DE BUENOS AIRES",
  },
  {
    rnos: "3603",
    denominacion:
      "OBRA SOCIAL PROGRAMAS MEDICOS SOCIEDAD ARGENTINA DE CONSULTORIA MUTUAL",
  },
  {
    rnos: "104603",
    denominacion: "OBRA SOCIAL DE OPERADORES CINEMATOGRAFICOS",
  },
  {
    rnos: "104801",
    denominacion:
      "OBRA SOCIAL DE COLOCADORES DE AZULEJOS, MOSAICOS, GRANITEROS, LUSTRADORES Y PORCELANEROS",
  },
  {
    rnos: "106203",
    denominacion:
      "OBRA SOCIAL DEL PERSONAL DE DISTRIBUIDORAS CINEMATOGRAFICAS DE LA R.A.",
  },
  {
    rnos: "108001",
    denominacion:
      "OBRA SOCIAL PARA EL PERSONAL DE LA INDUSTRIA FORESTAL DE SANTIAGO DEL ESTERO",
  },
  {
    rnos: "111308",
    denominacion: "OBRA SOCIAL DE MAQUINISTAS DE TEATRO Y TELEVISION",
  },
  {
    rnos: "111704",
    denominacion: "OBRA SOCIAL DE ENCARGADOS APUNTADORES MARITIMOS",
  },
  { rnos: "112707", denominacion: "OBRA SOCIAL DEL PERSONAL MOSAISTA" },
  { rnos: "112806", denominacion: "OBRA SOCIAL DE MUSICOS" },
  {
    rnos: "115102",
    denominacion: "OBRA SOCIAL DE TRABAJADORES DE PRENSA DE BUENOS AIRES",
  },
  {
    rnos: "116105",
    denominacion: "OBRA SOCIAL DE CAPATACES ESTIBADORES PORTUARIOS",
  },
  {
    rnos: "117702",
    denominacion: "OBRA SOCIAL DEL PERSONAL DE PRENSA DE MAR DEL PLATA",
  },
  {
    rnos: "118002",
    denominacion: "OBRA SOCIAL DE EMPLEADOS DE PRENSA DE CORDOBA",
  },
  {
    rnos: "118200",
    denominacion:
      "OBRA SOCIAL DE AGENTES DE PROPAGANDA MEDICA DE LA REPUBLICA ARGENTINA",
  },
  {
    rnos: "122104",
    denominacion:
      "OBRA SOCIAL DE VIAJANTES VENDEDORES DE LA REPUBLICA ARGENTINA. (ANDAR)",
  },
  {
    rnos: "122500",
    denominacion: "OBRA SOCIAL DEL PERSONAL DE LA INDUSTRIA DEL VIDRIO",
  },
  {
    rnos: "123602",
    denominacion: "OBRA SOCIAL DE TRABAJADORES DE PERKINS ARGENTINA S.A.I.C",
  },
  {
    rnos: "123701",
    denominacion: "OBRA SOCIAL DE PEONES DE TAXIS DE LA CAPITAL FEDERAL",
  },
  {
    rnos: "125509",
    denominacion:
      "OBRA SOCIAL DE LA FEDERACION ARGENTINA DEL TRABAJADOR DE LAS UNIVERSIDADES NACIONALES",
  },
  {
    rnos: "126809",
    denominacion:
      "OBRA SOCIAL DE CONDUCTORES DE REMISES Y AUTOS AL INSTANTE Y AFINES",
  },
  {
    rnos: "127406",
    denominacion:
      "OBRA SOCIAL DE OBREROS Y EMPLEADOS TINTOREROS SOMBREREROS Y LAVADEROS DE LA REPUBLICA ARGENTINA",
  },
  {
    rnos: "128508",
    denominacion: "OBRA SOCIAL DE FARMACEUTICOS Y BIOQUIMICOS",
  },
  {
    rnos: "400404",
    denominacion:
      "OBRA SOCIAL DEL PERSONAL DE DIRECCION DE LA INDUSTRIA CERVECERA Y MALTERA",
  },
  {
    rnos: "400602",
    denominacion:
      "OBRA SOCIAL DEL PERSONAL DIRECTIVO DE LA INDUSTRIA DE LA CONSTRUCCION",
  },
  {
    rnos: "401209",
    denominacion:
      "OBRA SOCIAL DEL PERSONAL DE DIRECCION DE LA INDUSTRIA METALURGICA Y DEMAS ACTIVIDADES EMPRESARIAS",
  },
  {
    rnos: "401704",
    denominacion: "OBRA SOCIAL DE EMPRESARIOS, PROFESIONALES Y MONOTRIBUTISTAS",
  },
  {
    rnos: "402202",
    denominacion: "OBRA SOCIAL MUTUALIDAD INDUSTRIAL TEXTIL ARGENTINA",
  },
  {
    rnos: "402608",
    denominacion:
      "OBRA SOCIAL ASOCIACION DE SERVICIOS SOCIALES PARA EMPRESARIOS Y PERSONAL DE DIRECCION DE EMPRESAS DEL COMERCIO, SERVICIOS, PRODUCCION, INDUSTRIA Y CIVIL (ASSPE )",
  },
  { rnos: "402707", denominacion: "OBRA SOCIAL DE DIRECCION OSDO" },
  {
    rnos: "901808",
    denominacion: "ASOCIACION MUTUAL DE PARTICIPANTES DE ECONOMIA SOLIDARIAS",
  },
  { rnos: "903903", denominacion: "MET-CORDOBA SA" },
];

// --- Opciones para Paso 11 (Consumo Energía Anual) ---
const opcionesConsumoEnergia = [
  "Hasta 3330 Kw",
  "Hasta 5000 Kw",
  "Hasta 6700 Kw",
  "Hasta 10000 Kw",
  "Hasta 13000 Kw",
  "Hasta 16500 Kw",
  "Hasta 20000 Kw",
];

// --- Opciones para Paso 11 (Superficie Afectada) ---
const opcionesSuperficie = [
  "Hasta 20 m²",
  "Hasta 30 m²",
  "Hasta 45 m²",
  "Hasta 60 m²",
  "Hasta 85 m²",
  "Hasta 110 m²",
  "Hasta 150 m²",
  "Hasta 200 m²",
  "Más de 200 m²",
];

export default function Registro() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    claveFiscal: "",
    mensaje: "",
    tipoTrabajo: "",
    cuitCooperativa: "", // <-- Añadir nuevo campo al estado
    mesInicio: null,
    facturacionAnualEstimada: "",
    tieneLocal: null,
    domicilioLocal: "",
    actividadesDesarrolladas: "",
    esAlquilado: null, // 'si' o 'no'
    montoAlquilerAnual: "",
    superficieAfectada: "",
    consumoEnergiaAnual: "",
    aporteJubilacion: "",
    cuitEmpleador: "",
    cuitCajaPrevisional: "",
    obraSocialSeleccionada: "",
    sumarAportesConyuge: null,
    cuitConyuge: "",
    familiaresCuil: [],
    aportaOtraJurisdiccion: null,
    jurisdiccionDonde: "",
    jurisdiccionCual: "",
    dniCoincideActividad: null,
    domicilioActividad: "",
    // Nuevos campos para archivos
    frontDniFile: null,
    backDniFile: null,
    selfieFile: null,
  });
  const [direction, setDirection] = useState(1);
  const [cuilFamiliarActual, setCuilFamiliarActual] = useState("");
  const [isObraSocialModalOpen, setIsObraSocialModalOpen] = useState(false);
  const [obraSocialSearchTerm, setObraSocialSearchTerm] = useState("");
  // Nuevo estado para modales de Superficie y Consumo
  const [isSuperficieModalOpen, setIsSuperficieModalOpen] = useState(false);
  const [isConsumoModalOpen, setIsConsumoModalOpen] = useState(false);
  // ID de transacción para asociar archivos con formulario
  const [transactionId] = useState(
    () => `trans_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
  );

  // Efecto para preseleccionar el servicio desde la URL
  useEffect(() => {
    if (router.isReady && router.query.servicio) {
      const servicioFromUrl = router.query.servicio;
      // Verificar si el servicio existe en nuestra lista
      const servicioExiste = servicios.some((s) => s.id === servicioFromUrl);

      if (servicioExiste) {
        setSelectedService(servicioFromUrl);
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "radio" ? value : value;
    setFormData((prev) => {
      let newState = { ...prev, [name]: val };

      // Limpiar campos dependientes cuando cambian las opciones principales
      if (name === "tieneLocal") {
        if (value === "no") {
          newState.domicilioLocal = "";
          newState.esAlquilado = null;
          newState.montoAlquilerAnual = "";
          newState.superficieAfectada = "";
          newState.consumoEnergiaAnual = "";
        } else {
          newState.tieneLocal = value; // Asegurar que 'si' se establece correctamente
        }
      }
      if (name === "esAlquilado" && value === "no") {
        newState.montoAlquilerAnual = "";
      }
      if (name === "aporteJubilacion" && type === "radio") {
        newState.aporteJubilacion = value;
        if (value !== "dependencia") newState.cuitEmpleador = "";
        if (value !== "caja_provincial") newState.cuitCajaPrevisional = "";
        if (value !== "activo") {
          newState.obraSocialSeleccionada = "";
          newState.sumarAportesConyuge = null;
          newState.cuitConyuge = "";
          newState.familiaresCuil = [];
        }
      }
      if (name === "sumarAportesConyuge" && value === "no")
        newState.cuitConyuge = "";
      if (name === "aportaOtraJurisdiccion" && value === "no") {
        newState.jurisdiccionDonde = "";
        newState.jurisdiccionCual = "";
      }
      if (name === "dniCoincideActividad" && value === "si") {
        newState.domicilioActividad = "";
      }

      // Asegurar que los radios establezcan su valor directamente
      if (type === "radio") {
        newState[name] = value;
      }

      return newState;
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, mesInicio: date }));
  };

  const handleAddFamiliar = () => {
    const cuilToAdd = cuilFamiliarActual.trim();
    if (cuilToAdd && !formData.familiaresCuil.includes(cuilToAdd)) {
      setFormData((prev) => ({
        ...prev,
        familiaresCuil: [...prev.familiaresCuil, cuilToAdd],
      }));
      setCuilFamiliarActual("");
    } else if (!cuilToAdd) {
      alert("Ingrese el CUIL del familiar.");
    } else {
      alert("Este CUIL ya fue agregado.");
    }
  };

  const handleRemoveFamiliar = (cuilToRemove) => {
    setFormData((prev) => ({
      ...prev,
      familiaresCuil: prev.familiaresCuil.filter(
        (cuil) => cuil !== cuilToRemove
      ),
    }));
  };

  const openObraSocialModal = () => setIsObraSocialModalOpen(true);
  const closeObraSocialModal = () => {
    setIsObraSocialModalOpen(false);
    setObraSocialSearchTerm("");
  };
  const handleSelectObraSocial = (obraSocialValue) => {
    setFormData((prev) => ({
      ...prev,
      obraSocialSeleccionada: obraSocialValue,
    }));
    closeObraSocialModal();
  };

  // --- Handlers para Modal Superficie ---
  const openSuperficieModal = () => setIsSuperficieModalOpen(true);
  const closeSuperficieModal = () => setIsSuperficieModalOpen(false);
  const handleSelectSuperficie = (superficieValue) => {
    setFormData((prev) => ({ ...prev, superficieAfectada: superficieValue }));
    closeSuperficieModal();
  };

  // --- Handlers para Modal Consumo Energía ---
  const openConsumoModal = () => setIsConsumoModalOpen(true);
  const closeConsumoModal = () => setIsConsumoModalOpen(false);
  const handleSelectConsumo = (consumoValue) => {
    setFormData((prev) => ({ ...prev, consumoEnergiaAnual: consumoValue }));
    closeConsumoModal();
  };
  // --- Fin Handlers Modales ---

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      // Actualizar el estado del archivo
      setFormData((prev) => ({
        ...prev,
        [`${name}File`]: files[0],
      }));
    }
  };

  // Función para eliminar un archivo
  const handleRemoveFile = (fileType) => {
    // Limpiar el archivo del formulario
    setFormData((prev) => ({
      ...prev,
      [`${fileType}File`]: null,
    }));
  };

  const handleNext = () => {
    setDirection(1);
    if (currentStep === 1) {
      if (!selectedService) {
        alert("Por favor, seleccione un servicio.");
        return;
      }
      if (serviciosFlujoCorto.includes(selectedService)) {
        setCurrentStep(2);
      } else if (serviciosFlujoAlta.includes(selectedService)) {
        // Primero iremos al paso de datos personales
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (
        !formData.apellido ||
        !formData.nombre ||
        !formData.dni ||
        !formData.claveFiscal
      ) {
        alert(
          "Por favor, complete todos los campos requeridos (excepto mensaje)."
        );
        return;
      }

      if (serviciosFlujoCorto.includes(selectedService)) {
        console.log("Datos del formulario (Flujo Corto):", {
          ...formData,
          servicio: selectedService,
        });
        alert("Flujo corto completado (temporal). Ver consola.");
      } else if (serviciosFlujoAlta.includes(selectedService)) {
        // Para flujo de alta, continuamos con el paso de tipo de trabajo
        setCurrentStep(10);
      }
    } else if (
      currentStep === 10 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (!formData.tipoTrabajo) {
        alert("Por favor, seleccione cómo va a trabajar.");
        return;
      }
      // Validar CUIT Cooperativa si es necesario
      if (
        formData.tipoTrabajo === "cooperativa" &&
        !formData.cuitCooperativa.trim()
      ) {
        alert("Por favor, ingrese el CUIT de la cooperativa.");
        return;
      }
      setCurrentStep(11);
    } else if (
      currentStep === 11 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (
        !formData.mesInicio ||
        !formData.facturacionAnualEstimada ||
        !formData.actividadesDesarrolladas.trim()
      ) {
        alert(
          "Por favor, complete Mes de Inicio, Facturación Anual y Actividades Desarrolladas."
        );
        return;
      }
      if (formData.tieneLocal === null) {
        alert("Por favor, indique si tiene o usa un local/oficina.");
        return;
      }
      if (formData.tieneLocal === "si" && !formData.domicilioLocal.trim()) {
        alert("Por favor, complete el domicilio del local.");
        return;
      }
      // --> Validación nuevos campos del local
      if (formData.tieneLocal === "si") {
        if (formData.esAlquilado === null) {
          alert("Por favor, indique si el local es alquilado.");
          return;
        }
        if (
          formData.esAlquilado === "si" &&
          !formData.montoAlquilerAnual.trim()
        ) {
          alert("Por favor, ingrese el monto anual del alquiler.");
          return;
        }
        if (!formData.superficieAfectada.trim()) {
          alert("Por favor, ingrese la superficie afectada.");
          return;
        }
        if (!formData.consumoEnergiaAnual) {
          alert("Por favor, seleccione el rango de consumo de energía.");
          return;
        }
      }
      // <-- Fin Validación nuevos campos
      setCurrentStep(12);
    } else if (
      currentStep === 12 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (!formData.aporteJubilacion) {
        alert("Seleccione su situación de aportes.");
        return;
      }
      if (
        formData.aporteJubilacion === "dependencia" &&
        !formData.cuitEmpleador.trim()
      ) {
        alert("Ingrese CUIT del empleador.");
        return;
      }
      if (
        formData.aporteJubilacion === "caja_provincial" &&
        !formData.cuitCajaPrevisional.trim()
      ) {
        alert("Ingrese CUIT de la Caja Previsional.");
        return;
      }
      console.log("Datos Paso 12:", {
        aporte: formData.aporteJubilacion,
        cuitE: formData.cuitEmpleador,
        cuitC: formData.cuitCajaPrevisional,
      });
      if (formData.aporteJubilacion === "activo") {
        setCurrentStep(13);
      } else {
        setCurrentStep(15);
      }
    } else if (
      currentStep === 13 &&
      formData.aporteJubilacion === "activo" &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (!formData.obraSocialSeleccionada) {
        alert("Seleccione una Obra Social.");
        return;
      }
      console.log("Datos Paso 13:", { os: formData.obraSocialSeleccionada });
      setCurrentStep(14);
    } else if (
      currentStep === 14 &&
      formData.aporteJubilacion === "activo" &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (formData.sumarAportesConyuge === null) {
        alert("Indique si desea sumar aportes del cónyuge.");
        return;
      }
      if (
        formData.sumarAportesConyuge === "si" &&
        !formData.cuitConyuge.trim()
      ) {
        alert("Ingrese el CUIL del cónyuge.");
        return;
      }
      console.log("Datos Paso 14:", {
        conyuge: formData.sumarAportesConyuge,
        cuil: formData.cuitConyuge,
        familiares: formData.familiaresCuil,
      });
      setCurrentStep(15);
    } else if (
      currentStep === 15 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      if (formData.aportaOtraJurisdiccion === null) {
        alert(
          "Indique si realiza aportes por alguna actividad en otra jurisdicción."
        );
        return;
      }
      if (
        formData.aportaOtraJurisdiccion === "si" &&
        (!formData.jurisdiccionDonde.trim() ||
          !formData.jurisdiccionCual.trim())
      ) {
        alert("Complete los datos de la actividad en otra jurisdicción.");
        return;
      }
      if (formData.dniCoincideActividad === null) {
        alert(
          "Indique si el domicilio de su DNI coincide con el de su actividad."
        );
        return;
      }
      if (
        formData.dniCoincideActividad === "no" &&
        !formData.domicilioActividad.trim()
      ) {
        alert("Ingrese el domicilio donde realiza la actividad.");
        return;
      }
      console.log("Datos Paso 15:", {
        otraJ: formData.aportaOtraJurisdiccion,
        donde: formData.jurisdiccionDonde,
        cual: formData.jurisdiccionCual,
        coincideDni: formData.dniCoincideActividad,
        domAct: formData.domicilioActividad,
      });
      // Después del paso 15, ahora vamos al paso de adjuntar archivos
      setCurrentStep(16);
    } else if (
      currentStep === 16 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      // Validamos que se hayan cargado todos los documentos
      if (
        !formData.frontDniFile ||
        !formData.backDniFile ||
        !formData.selfieFile
      ) {
        alert(
          "Por favor, cargue todas las imágenes requeridas (frente del DNI, dorso del DNI y selfie)."
        );
        return;
      }
      // Avanzamos al resumen
      setCurrentStep(17);
    } else if (
      currentStep === 17 &&
      serviciosFlujoAlta.includes(selectedService)
    ) {
      // Aquí finalizaríamos el proceso y enviaríamos los datos al backend
      console.log("Completando registro con ID de transacción:", transactionId);

      // Primero subimos los archivos
      const uploadFiles = async () => {
        const formDataFiles = new FormData();
        formDataFiles.append("transactionId", transactionId);

        if (formData.frontDniFile) {
          formDataFiles.append("frontDni", formData.frontDniFile);
        }
        if (formData.backDniFile) {
          formDataFiles.append("backDni", formData.backDniFile);
        }
        if (formData.selfieFile) {
          formDataFiles.append("selfie", formData.selfieFile);
        }

        try {
          const API_BASE_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
          const response = await fetch(`${API_BASE_URL}/upload-documents`, {
            method: "POST",
            body: formDataFiles,
          });
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.message || "Error al subir los archivos");
          }
          return true;
        } catch (error) {
          console.error("Error al subir archivos:", error);
          alert("Error al subir los archivos: " + error.message);
          return false;
        }
      };

      // Luego enviamos los datos del formulario
      const submitFormData = async () => {
        try {
          const API_BASE_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
          const response = await fetch(`${API_BASE_URL}/submit-form`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              formData: {
                ...formData,
                servicio: selectedService,
                // Excluimos los archivos del formData porque ya los enviamos
                frontDniFile: undefined,
                backDniFile: undefined,
                selfieFile: undefined,
              },
              transactionId,
            }),
          });

          const result = await response.json();
          if (!result.success) {
            throw new Error(result.message || "Error al enviar el formulario");
          }
          return true;
        } catch (error) {
          console.error("Error al enviar formulario:", error);
          alert("Error al enviar el formulario: " + error.message);
          return false;
        }
      };

      // Ejecutar las funciones en secuencia
      alert("Enviando información... por favor espere.");
      uploadFiles().then((filesUploaded) => {
        if (filesUploaded) {
          submitFormData().then((formSubmitted) => {
            if (formSubmitted) {
              // Determinar si es una suscripción basado en el tipo de servicio
              const isSubscription = [
                "plan_base",
                "plan_full",
                "plan_premium",
              ].includes(selectedService);

              // Ajustar precios según el tipo de servicio
              let precio;
              // Precios para planes semestrales (con API de suscripción)
              if (selectedService === "plan_base") {
                precio = 150000;
              } else if (selectedService === "plan_full") {
                precio = 180000;
              } else if (selectedService === "plan_premium") {
                precio = 240000;
              }
              // Precios para servicios únicos (con API de checkout)
              else if (selectedService === "alta") {
                precio = 75000;
              } else if (selectedService === "baja") {
                precio = 75000;
              } else if (selectedService === "recategorizacion") {
                precio = 50000;
              } else if (selectedService === "factura_adicional") {
                precio = 2000;
              } else {
                precio = 75000; // Precio predeterminado por si acaso
              }

              // Redirigir a la página de pago
              router.push(
                `/payment?service=${selectedService}&price=${precio}&transactionId=${transactionId}${
                  isSubscription ? "&isSubscription=true" : ""
                }`
              );
            }
          });
        }
      });
    }
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 10) {
      // Ahora retrocedemos al paso de datos personales
      setCurrentStep(2);
    } else if (currentStep === 11) {
      setCurrentStep(10);
    } else if (currentStep === 12) {
      setCurrentStep(11);
    } else if (currentStep === 13) {
      setCurrentStep(12);
    } else if (currentStep === 14) {
      setCurrentStep(13);
    } else if (currentStep === 15) {
      if (formData.aporteJubilacion === "activo") {
        setCurrentStep(14);
      } else {
        setCurrentStep(12);
      }
    } else if (currentStep === 16) {
      setCurrentStep(15);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Selecciona el Servicio
      </h1>
      <div className="space-y-3 mb-8">
        {servicios.map((servicio) => (
          <label
            key={servicio.id}
            className={`flex items-center p-2 border rounded-lg cursor-pointer text-sm transition-colors ${
              selectedService === servicio.id
                ? "bg-blue-100 border-blue-500 ring-2 ring-blue-300"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="servicio"
              value={servicio.id}
              checked={selectedService === servicio.id}
              onChange={() => setSelectedService(servicio.id)}
              className="sr-only"
            />
            <span className="font-medium text-gray-700">{servicio.nombre}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedService}
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            selectedService
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
        Completa tus Datos Personales
      </h1>
      <p className="text-center text-gray-600 mb-6 text-sm">
        Servicio:{" "}
        <span className="font-semibold">
          {servicios.find((s) => s.id === selectedService)?.nombre}
        </span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="apellido"
            className="block text-xs font-medium text-gray-600 mb-1"
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="nombre"
            className="block text-xs font-medium text-gray-600 mb-1"
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="dni"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            DNI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Sin puntos ni guiones"
          />
        </div>

        <div>
          <label
            htmlFor="claveFiscal"
            className="block text-xs font-medium text-gray-600 mb-1"
          >
            Clave Fiscal <span className="text-red-500">*</span>
            <a
              href="https://www.afip.gob.ar/clavefiscal/ayuda/obtener-clave-fiscal.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline ml-1"
            >
              (?)
            </a>
          </label>
          <input
            type="password"
            id="claveFiscal"
            name="claveFiscal"
            value={formData.claveFiscal}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {serviciosFlujoCorto.includes(selectedService) && (
          <div className="md:col-span-2">
            <label
              htmlFor="mensaje"
              className="block text-xs font-medium text-gray-600 mb-1"
            >
              Mensaje (Opcional)
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="3"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Aclaraciones adicionales..."
            ></textarea>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            !formData.apellido ||
            !formData.nombre ||
            !formData.dni ||
            !formData.claveFiscal
          }
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.apellido &&
            formData.nombre &&
            formData.dni &&
            formData.claveFiscal
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderAltaStep10 = () => (
    <motion.div
      key="step10"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ¿Cómo vas a trabajar?
      </h1>

      <div className="space-y-4 mb-8">
        {opcionesTipoTrabajo.map((opcion) => (
          <label
            key={opcion.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
              formData.tipoTrabajo === opcion.id
                ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="tipoTrabajo"
                value={opcion.id}
                checked={formData.tipoTrabajo === opcion.id}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 text-sm w-full">
                {" "}
                {/* Añadido w-full */}
                <span className="font-medium text-gray-900">
                  {opcion.label}
                </span>
                <p className="text-gray-500 mt-1">{opcion.descripcion}</p>
                {/* Input CUIT Cooperativa Condicional */}
                <AnimatePresence>
                  {opcion.id === "cooperativa" &&
                    formData.tipoTrabajo === "cooperativa" && (
                      <motion.div
                        key="cuitCooperativaInput"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          marginTop: "0.75rem",
                        }} // mt-3
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full" // Asegura que ocupe el ancho
                      >
                        <label
                          htmlFor="cuitCooperativa"
                          className="block text-xs font-medium text-gray-700 mb-1"
                        >
                          CUIT de la Cooperativa{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cuitCooperativa"
                          name="cuitCooperativa"
                          value={formData.cuitCooperativa}
                          onClick={(e) => e.stopPropagation()} // Evita que el click en el input cambie el radio
                          onChange={handleChange}
                          required={formData.tipoTrabajo === "cooperativa"}
                          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="Ingrese el CUIT sin guiones"
                        />
                      </motion.div>
                    )}
                </AnimatePresence>
                {opcion.link && (
                  <a
                    href={opcion.link.url}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    {opcion.link.text}
                  </a>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            !formData.tipoTrabajo ||
            // Añadir validación de CUIT cooperativa a la condición disabled
            (formData.tipoTrabajo === "cooperativa" &&
              !formData.cuitCooperativa.trim())
          }
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.tipoTrabajo &&
            !(
              formData.tipoTrabajo === "cooperativa" &&
              !formData.cuitCooperativa.trim()
            ) // Actualizar lógica
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderAltaStep11 = () => (
    <motion.div
      key="step11"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Detalles de Actividad
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="w-full">
          <label
            htmlFor="mesInicio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mes de Inicio <span className="text-red-500">*</span>
          </label>
          <div className="w-full">
            <DatePicker
              selected={formData.mesInicio}
              onChange={handleDateChange}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholderText="Seleccione mes y año"
              wrapperClassName="w-full"
            />
          </div>
        </div>

        <div className="w-full">
          <label
            htmlFor="facturacionAnualEstimada"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Facturación Anual <span className="text-red-500">*</span>
          </label>
          <select
            id="facturacionAnualEstimada"
            name="facturacionAnualEstimada"
            value={formData.facturacionAnualEstimada}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {opcionesFacturacion.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="actividadesDesarrolladas"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Actividades Desarrolladas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="actividadesDesarrolladas"
            name="actividadesDesarrolladas"
            value={formData.actividadesDesarrolladas}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej: Venta de ropa, Servicios de consultoría"
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe brevemente a qué te dedicas.
          </p>
        </div>
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tenés o usás LOCAL/OFICINA/ESTABLECIMIENTO para el desarrollo de tus
          actividades?
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tieneLocal"
              value="si"
              checked={formData.tieneLocal === "si"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Sí</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="tieneLocal"
              value="no"
              checked={formData.tieneLocal === "no"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>

      {formData.tieneLocal === "si" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <label
            htmlFor="domicilioLocal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Domicilio del Local/Oficina/Establecimiento{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="domicilioLocal"
            name="domicilioLocal"
            value={formData.domicilioLocal}
            onChange={handleChange}
            required={formData.tieneLocal === "si"}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Calle, Número, Piso, Depto, Localidad, Provincia"
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa la dirección completa.
          </p>

          {/* Nuevos campos si tieneLocal es 'si' */}
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* ¿Es alquilado? */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Es alquilado?
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="esAlquilado"
                    value="si"
                    checked={formData.esAlquilado === "si"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Sí</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="esAlquilado"
                    value="no"
                    checked={formData.esAlquilado === "no"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Monto Alquiler Anual (Condicional) */}
            <AnimatePresence>
              {formData.esAlquilado === "si" && (
                <motion.div
                  key="montoAlquilerInput"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <label
                    htmlFor="montoAlquilerAnual"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Monto Anual de Alquiler
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="montoAlquilerAnual"
                      id="montoAlquilerAnual"
                      value={formData.montoAlquilerAnual}
                      onChange={(e) => {
                        // Solo permitir números en este campo
                        if (/^\d*$/.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      required={formData.esAlquilado === "si"}
                      className="block w-full rounded-md border-gray-300 pl-7 pr-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Superficie Afectada -> Botón + Modal */}
            <div className="mb-4">
              <label
                htmlFor="superficieBtn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Superficie Afectada (m²)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <button
                type="button"
                id="superficieBtn"
                onClick={openSuperficieModal}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {formData.superficieAfectada || (
                  <span className="text-gray-500">Seleccionar...</span>
                )}
              </button>
            </div>

            {/* Consumo Energía Anual -> Botón + Modal */}
            <div>
              <label
                htmlFor="consumoBtn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Consumo Energía Anual (Kw)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <button
                type="button"
                id="consumoBtn"
                onClick={openConsumoModal}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {formData.consumoEnergiaAnual || (
                  <span className="text-gray-500">Seleccionar...</span>
                )}
              </button>
            </div>
          </div>
          {/* Fin nuevos campos */}
        </motion.div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            !formData.mesInicio ||
            !formData.facturacionAnualEstimada ||
            !formData.actividadesDesarrolladas.trim() ||
            formData.tieneLocal === null ||
            (formData.tieneLocal === "si" && !formData.domicilioLocal.trim()) ||
            // Añadir validación de campos de local a disabled
            (formData.tieneLocal === "si" &&
              (formData.esAlquilado === null ||
                (formData.esAlquilado === "si" &&
                  !formData.montoAlquilerAnual.trim()) ||
                !formData.superficieAfectada.trim() ||
                !formData.consumoEnergiaAnual))
          }
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            // Lógica actualizada
            formData.mesInicio &&
            formData.facturacionAnualEstimada &&
            formData.actividadesDesarrolladas.trim() &&
            formData.tieneLocal !== null &&
            !(
              formData.tieneLocal === "si" && !formData.domicilioLocal.trim()
            ) && // Domicilio local
            !(
              formData.tieneLocal === "si" && // Detalles adicionales del local
              (formData.esAlquilado === null ||
                (formData.esAlquilado === "si" &&
                  !formData.montoAlquilerAnual.trim()) ||
                !formData.superficieAfectada.trim() ||
                !formData.consumoEnergiaAnual)
            )
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderAltaStep12 = () => (
    <motion.div
      key="step12"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Aportes de jubilación
        </h1>
        <p className="text-xs text-gray-600">
          Parte de tu pago mensual como Monotributista es un aporte...
        </p>
      </div>
      <div className="space-y-3 mb-4">
        {opcionesAportes.map((opcion) => (
          <label
            key={opcion.id}
            className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
              formData.aporteJubilacion === opcion.id
                ? "bg-blue-50 border-blue-400 ring-1 ring-blue-300"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="aporteJubilacion"
                value={opcion.id}
                checked={formData.aporteJubilacion === opcion.id}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 text-sm">
                <span className="font-medium text-gray-800">
                  {opcion.label}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  {opcion.descripcion}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>
      <AnimatePresence>
        {formData.aporteJubilacion === "dependencia" && (
          <motion.div
            key="cuitEmpleadorInput"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <label
              htmlFor="cuitEmpleador"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CUIT del Empleador <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cuitEmpleador"
              name="cuitEmpleador"
              value={formData.cuitEmpleador}
              onChange={handleChange}
              required={formData.aporteJubilacion === "dependencia"}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ingrese el CUIT sin guiones"
            />
          </motion.div>
        )}
        {formData.aporteJubilacion === "caja_provincial" && (
          <motion.div
            key="cuitCajaInput"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "0.75rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <label
              htmlFor="cuitCajaPrevisional"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CUIT de la Caja Previsional{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cuitCajaPrevisional"
              name="cuitCajaPrevisional"
              value={formData.cuitCajaPrevisional}
              onChange={handleChange}
              required={formData.aporteJubilacion === "caja_provincial"}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ingrese el CUIT sin guiones"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            !formData.aporteJubilacion ||
            (formData.aporteJubilacion === "dependencia" &&
              !formData.cuitEmpleador.trim()) ||
            (formData.aporteJubilacion === "caja_provincial" &&
              !formData.cuitCajaPrevisional.trim())
          }
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            formData.aporteJubilacion &&
            !(
              formData.aporteJubilacion === "dependencia" &&
              !formData.cuitEmpleador.trim()
            ) &&
            !(
              formData.aporteJubilacion === "caja_provincial" &&
              !formData.cuitCajaPrevisional.trim()
            )
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderAltaStep13 = () => {
    const filteredOpciones = opcionesObraSocial.filter((os) => {
      const searchTerm = obraSocialSearchTerm.toLowerCase();
      const denominacion = os.denominacion.toLowerCase();
      const rnos = String(os.rnos);
      return denominacion.includes(searchTerm) || rnos.includes(searchTerm);
    });

    return (
      <motion.div
        key="step13"
        custom={direction}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Obra Social</h1>
          <p className="text-xs text-gray-600">
            El monotributo incluye aportes a una obra social de tu elección...
          </p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Seleccioná tu Obra Social
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Recordá que vas a tener que acercarte a una oficina...
          </p>
          <label
            htmlFor="obraSocialBtn"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Obra social <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            id="obraSocialBtn"
            onClick={openObraSocialModal}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white text-left text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {formData.obraSocialSeleccionada || (
              <span className="text-gray-500">Seleccionar...</span>
            )}
          </button>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!formData.obraSocialSeleccionada}
            className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              formData.obraSocialSeleccionada
                ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {" "}
            Siguiente <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <AnimatePresence>
          {isObraSocialModalOpen && (
            <motion.div
              key="osModalOverlay"
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeObraSocialModal}
            >
              <motion.div
                key="osModalContent"
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">
                    Seleccionar Obra Social
                  </h3>
                  <button
                    onClick={closeObraSocialModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-3 border-b border-gray-200">
                  <input
                    type="text"
                    value={obraSocialSearchTerm}
                    onChange={(e) => setObraSocialSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o código..."
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="p-3 overflow-y-auto">
                  <div className="space-y-1">
                    {filteredOpciones.length > 0 ? (
                      filteredOpciones.map((os) => {
                        const osValue = `${os.rnos} - ${os.denominacion}`;
                        const isSelected =
                          formData.obraSocialSeleccionada === osValue;
                        return (
                          <button
                            key={os.rnos}
                            type="button"
                            onClick={() => handleSelectObraSocial(osValue)}
                            className={`w-full text-left p-1.5 rounded text-sm transition-colors ${
                              isSelected
                                ? "bg-blue-100 text-blue-700 font-semibold"
                                : "hover:bg-blue-50"
                            }`}
                          >
                            {osValue}
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No se encontraron obras sociales.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderAltaStep14 = () => (
    <motion.div
      key="step14"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {formData.aporteJubilacion === "activo" && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            ¿Querés sumar tus aportes a los de tu cónyuge?
          </h2>
          <p className="text-xs text-gray-600 mb-3">
            Si tu pareja trabaja y brinda aportes a una obra social, podés sumar
            esos aportes para el grupo familiar. Recordá que ambos tienen que
            optar por la misma obra social.
          </p>
          <div className="flex items-center space-x-4 mb-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sumarAportesConyuge"
                value="si"
                checked={formData.sumarAportesConyuge === "si"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Sí</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sumarAportesConyuge"
                value="no"
                checked={formData.sumarAportesConyuge === "no"}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>

          <AnimatePresence>
            {formData.sumarAportesConyuge === "si" && (
              <motion.div
                key="cuitConyugeInput"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label
                  htmlFor="cuitConyuge"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Ingresá el N° de CUIT/CUIL de tu cónyuge{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="cuitConyuge"
                  name="cuitConyuge"
                  value={formData.cuitConyuge}
                  onChange={handleChange}
                  required={formData.sumarAportesConyuge === "si"}
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="CUIT/CUIL sin guiones"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {formData.aporteJubilacion === "activo" && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Agregá miembros de tu familia a tu obra social
          </h2>
          <p className="text-xs text-gray-600 mb-1">
            Se te cobrará un aporte adicional por cada miembro que sumes a tu
            obra social.
          </p>
          {formData.sumarAportesConyuge === "si" && (
            <p className="text-xs text-gray-500 mb-3">
              Si optaste por sumar los aportes con tu cónyuge, no tenés que
              agregarlo dentro de tu grupo familiar.
            </p>
          )}

          <div className="flex items-end space-x-2 mb-3">
            <div className="flex-grow">
              <label
                htmlFor="cuilFamiliarActual"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Ingresá el N° de CUIL de tu familiar
              </label>
              <input
                type="text"
                id="cuilFamiliarActual"
                value={cuilFamiliarActual}
                onChange={(e) => setCuilFamiliarActual(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="CUIL sin guiones"
              />
            </div>
            <button
              type="button"
              onClick={handleAddFamiliar}
              className="flex-shrink-0 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Agregar
            </button>
          </div>

          {formData.familiaresCuil.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-gray-600">
                Familiares agregados:
              </p>
              <ul className="list-none space-y-1">
                {formData.familiaresCuil.map((cuil, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-1.5 rounded text-sm"
                  >
                    <span className="text-gray-700">{cuil}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFamiliar(cuil)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            formData.aporteJubilacion === "activo" &&
            (formData.sumarAportesConyuge === null ||
              (formData.sumarAportesConyuge === "si" &&
                !formData.cuitConyuge.trim()))
          }
          className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !(
              formData.aporteJubilacion === "activo" &&
              (formData.sumarAportesConyuge === null ||
                (formData.sumarAportesConyuge === "si" &&
                  !formData.cuitConyuge.trim()))
            )
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderJurisdiccionDniStep15 = () => (
    <motion.div
      key="step15"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">
        Información Adicional
      </h1>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tenés alguna actividad por la que realices aportes en otra
          jurisdicción?
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center space-x-4 mb-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aportaOtraJurisdiccion"
              value="si"
              checked={formData.aportaOtraJurisdiccion === "si"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Sí</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="aportaOtraJurisdiccion"
              value="no"
              checked={formData.aportaOtraJurisdiccion === "no"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">No</span>
          </label>
        </div>
        <AnimatePresence>
          {formData.aportaOtraJurisdiccion === "si" && (
            <motion.div
              key="inputsJuris"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3"
            >
              <div>
                <label
                  htmlFor="jurisdiccionDonde"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Describa la actividad reaizada:
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jurisdiccionDonde"
                  name="jurisdiccionDonde"
                  value={formData.jurisdiccionDonde}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="jurisdiccionCual"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Indique el domicilio donde factura:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jurisdiccionCual"
                  name="jurisdiccionCual"
                  value={formData.jurisdiccionCual}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md text-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿El domicilio de tu DNI coincide con el de tu actividad?
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex items-center space-x-4 mb-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dniCoincideActividad"
              value="si"
              checked={formData.dniCoincideActividad === "si"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">Sí</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="dniCoincideActividad"
              value="no"
              checked={formData.dniCoincideActividad === "no"}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">No</span>
          </label>
        </div>
        <AnimatePresence>
          {formData.dniCoincideActividad === "no" && (
            <motion.div
              key="inputDomActividad"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3"
            >
              <label
                htmlFor="domicilioActividad"
                className="block text-xs font-medium text-gray-600 mb-1"
              >
                ¿Cuál es el domicilio donde realizas la actividad?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="domicilioActividad"
                name="domicilioActividad"
                value={formData.domicilioActividad}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md text-sm"
                placeholder="Calle, Número, Localidad..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 border rounded-md text-sm"
        >
          {" "}
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior{" "}
        </button>
        <button
          onClick={handleNext}
          disabled={
            formData.aportaOtraJurisdiccion === null ||
            (formData.aportaOtraJurisdiccion === "si" &&
              (!formData.jurisdiccionDonde.trim() ||
                !formData.jurisdiccionCual.trim())) ||
            formData.dniCoincideActividad === null ||
            (formData.dniCoincideActividad === "no" &&
              !formData.domicilioActividad.trim())
          }
          className={`flex items-center px-4 py-2 border rounded-md text-sm text-white ${
            formData.aportaOtraJurisdiccion !== null &&
            !(
              formData.aportaOtraJurisdiccion === "si" &&
              (!formData.jurisdiccionDonde.trim() ||
                !formData.jurisdiccionCual.trim())
            ) &&
            formData.dniCoincideActividad !== null &&
            !(
              formData.dniCoincideActividad === "no" &&
              !formData.domicilioActividad.trim()
            )
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderDocumentosStep16 = () => (
    <motion.div
      key="step16"
      custom={direction}
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h1 className="text-lg font-bold text-gray-900 mb-4 text-center">
        Documentación Requerida
      </h1>
      <p className="text-xs text-gray-600 mb-3">
        Para completar el trámite de alta, por favor suba las siguientes
        fotografías:
      </p>

      <div className="space-y-3">
        {/* Frente del DNI */}
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            Frente del DNI <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label
                htmlFor="frontDni"
                className={`flex items-center justify-center p-2 border border-dashed rounded-md cursor-pointer ${
                  formData.frontDniFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <div className="text-center">
                  <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">
                    {formData.frontDniFile
                      ? formData.frontDniFile.name
                      : "Subir frente del DNI"}
                  </span>
                </div>
                <input
                  id="frontDni"
                  name="frontDni"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {formData.frontDniFile && (
              <button
                type="button"
                onClick={() => handleRemoveFile("frontDni")}
                className="ml-2 p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dorso del DNI */}
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            Dorso del DNI <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label
                htmlFor="backDni"
                className={`flex items-center justify-center p-2 border border-dashed rounded-md cursor-pointer ${
                  formData.backDniFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <div className="text-center">
                  <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">
                    {formData.backDniFile
                      ? formData.backDniFile.name
                      : "Subir dorso del DNI"}
                  </span>
                </div>
                <input
                  id="backDni"
                  name="backDni"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {formData.backDniFile && (
              <button
                type="button"
                onClick={() => handleRemoveFile("backDni")}
                className="ml-2 p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selfie */}
        <div className="border rounded-md p-3">
          <h3 className="text-sm font-medium text-gray-800 mb-1">
            Selfie <span className="text-red-500">*</span>
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label
                htmlFor="selfie"
                className={`flex items-center justify-center p-2 border border-dashed rounded-md cursor-pointer ${
                  formData.selfieFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <div className="text-center">
                  <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                  <span className="text-xs text-gray-500">
                    {formData.selfieFile
                      ? formData.selfieFile.name
                      : "Subir selfie"}
                  </span>
                </div>
                <input
                  id="selfie"
                  name="selfie"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {formData.selfieFile && (
              <button
                type="button"
                onClick={() => handleRemoveFile("selfie")}
                className="ml-2 p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-3 mb-4">
        <p>Las imágenes deben ser claras y legibles.</p>
        <p>La selfie debe mostrar claramente tu rostro.</p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center px-3 py-1.5 border rounded-md text-xs"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={
            !formData.frontDniFile ||
            !formData.backDniFile ||
            !formData.selfieFile
          }
          className={`flex items-center px-3 py-1.5 border rounded-md text-xs text-white ${
            formData.frontDniFile && formData.backDniFile && formData.selfieFile
              ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Siguiente <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </motion.div>
  );

  const renderResumenStep17 = () => {
    const displayValue = (value) =>
      value === "si" ? "Sí" : value === "no" ? "No" : value || "-";

    const formatDate = (date) =>
      date
        ? new Intl.DateTimeFormat("es-AR", {
            year: "numeric",
            month: "long",
          }).format(date)
        : "-";

    const getServiceName = (id) =>
      servicios.find((s) => s.id === id)?.nombre || "No especificado";

    const getAporteName = (id) =>
      opcionesAportes.find((a) => a.id === id)?.label || "-";

    // Verificamos si el servicio seleccionado es uno de los servicios de alta
    const isAlta = serviciosFlujoAlta.includes(selectedService);

    return (
      <motion.div
        key="step17"
        custom={direction}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Resumen del trámite
        </h1>

        <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
          <div className="font-medium mb-1 text-gray-900">Servicio:</div>
          <div>{getServiceName(selectedService)}</div>
        </div>

        <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
          <div className="font-medium mb-1 text-gray-900">Datos personales</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>
              <span className="text-gray-600">Nombre: </span>
              {displayValue(formData.nombre)}
            </div>
            <div>
              <span className="text-gray-600">Apellido: </span>
              {displayValue(formData.apellido)}
            </div>
            <div>
              <span className="text-gray-600">DNI: </span>
              {displayValue(formData.dni)}
            </div>
            <div>
              <span className="text-gray-600">Clave Fiscal: </span>
              {displayValue(formData.claveFiscal)}
            </div>
          </div>
        </div>

        {isAlta && (
          <>
            <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
              <div className="font-medium mb-1 text-gray-900">
                Información laboral
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-gray-600">Modalidad: </span>
                  {formData.tipoTrabajo === "independiente"
                    ? "Independiente"
                    : formData.tipoTrabajo === "cooperativa"
                    ? "Cooperativa"
                    : formData.tipoTrabajo === "promovido"
                    ? "Promovido"
                    : formData.tipoTrabajo === "locador"
                    ? "Locación"
                    : "-"}
                </div>
                {formData.tipoTrabajo === "cooperativa" && (
                  <div>
                    <span className="text-gray-600">CUIT Cooperativa: </span>
                    {displayValue(formData.cuitCooperativa)}
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Mes de inicio: </span>
                  {formatDate(formData.mesInicio)}
                </div>
                <div>
                  <span className="text-gray-600">Facturación anual: </span>$
                  {displayValue(formData.facturacionAnualEstimada)}
                </div>
              </div>
              <div className="mt-1">
                <span className="text-gray-600">Actividades: </span>
                {displayValue(formData.actividadesDesarrolladas)}
              </div>
            </div>

            <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
              <div className="font-medium mb-1 text-gray-900">
                Información del local
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-gray-600">Tiene local: </span>
                  {displayValue(formData.tieneLocal)}
                </div>
                {formData.tieneLocal === "si" && (
                  <>
                    <div>
                      <span className="text-gray-600">Domicilio: </span>
                      {displayValue(formData.domicilioLocal)}
                    </div>
                    <div>
                      <span className="text-gray-600">Es alquilado: </span>
                      {displayValue(formData.esAlquilado)}
                    </div>
                    {formData.esAlquilado === "si" && (
                      <div>
                        <span className="text-gray-600">Alquiler anual: $</span>
                        {displayValue(formData.montoAlquilerAnual)}
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">
                        Superficie afectada:{" "}
                      </span>
                      {displayValue(formData.superficieAfectada)}
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Consumo de energía:{" "}
                      </span>
                      {displayValue(formData.consumoEnergiaAnual)}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
              <div className="font-medium mb-1 text-gray-900">
                Aportes jubilatorios
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-gray-600">Situación: </span>
                  {getAporteName(formData.aporteJubilacion)}
                </div>
                {formData.aporteJubilacion === "dependencia" && (
                  <div>
                    <span className="text-gray-600">DNI Empleador: </span>
                    {displayValue(formData.cuitEmpleador)}
                  </div>
                )}
                {formData.aporteJubilacion === "caja_provincial" && (
                  <div>
                    <span className="text-gray-600">
                      DNI Caja Previsional:{" "}
                    </span>
                    {displayValue(formData.cuitCajaPrevisional)}
                  </div>
                )}
                {formData.aporteJubilacion === "activo" && (
                  <>
                    <div>
                      <span className="text-gray-600">Obra Social: </span>
                      {displayValue(formData.obraSocialSeleccionada)}
                    </div>
                    <div>
                      <span className="text-gray-600">
                        Aportes del cónyuge:{" "}
                      </span>
                      {displayValue(formData.sumarAportesConyuge)}
                    </div>
                    {formData.sumarAportesConyuge === "si" && (
                      <div>
                        <span className="text-gray-600">DNI Cónyuge: </span>
                        {displayValue(formData.cuitConyuge)}
                      </div>
                    )}
                    {formData.familiaresCuil.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-600">
                          Familiares a cargo:{" "}
                        </span>
                        <ul className="list-disc list-inside pl-2 text-xs">
                          {formData.familiaresCuil.map((cuil, index) => (
                            <li key={index}>{cuil}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
              <div className="font-medium mb-1 text-gray-900">
                Información adicional
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>
                  <span className="text-gray-600">
                    Aporta en otra jurisdicción:{" "}
                  </span>
                  {displayValue(formData.aportaOtraJurisdiccion)}
                </div>
                {formData.aportaOtraJurisdiccion === "si" && (
                  <>
                    <div>
                      <span className="text-gray-600">Actividad: </span>
                      {displayValue(formData.jurisdiccionDonde)}
                    </div>
                    <div>
                      <span className="text-gray-600">Domicilio: </span>
                      {displayValue(formData.jurisdiccionCual)}
                    </div>
                  </>
                )}
                <div>
                  <span className="text-gray-600">
                    DNI coincide con actividad:{" "}
                  </span>
                  {displayValue(formData.dniCoincideActividad)}
                </div>
                {formData.dniCoincideActividad === "no" && (
                  <div>
                    <span className="text-gray-600">
                      Domicilio de actividad:{" "}
                    </span>
                    {displayValue(formData.domicilioActividad)}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 text-xs text-gray-700 pb-3">
              <div className="font-medium mb-1 text-gray-900">
                Documentación adjunta
              </div>
              <ul className="list-disc list-inside">
                <li>
                  Frente del DNI:{" "}
                  {formData.frontDniFile ? formData.frontDniFile.name : "-"}
                </li>
                <li>
                  Dorso del DNI:{" "}
                  {formData.backDniFile ? formData.backDniFile.name : "-"}
                </li>
                <li>
                  Selfie: {formData.selfieFile ? formData.selfieFile.name : "-"}
                </li>
              </ul>
            </div>
          </>
        )}

        {!isAlta && formData.mensaje && (
          <div className="mb-3 text-sm text-gray-700 border-b border-gray-200 pb-3">
            <div className="font-medium mb-1 text-gray-900">Mensaje:</div>
            <div>{displayValue(formData.mensaje)}</div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 mb-4">
          Al confirmar esta solicitud, autoriza a nuestro equipo a realizar los
          trámites correspondientes en su nombre.
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="flex items-center px-3 py-1.5 border rounded-md text-xs"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Anterior
          </button>
          <button
            onClick={handleNext}
            className="flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Confirmar Solicitud
          </button>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        // El paso 2 ahora es para todos los servicios
        return renderStep2();
      case 10:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderAltaStep10();
        }
        console.warn("Invalid state");
        return <p>Invalid config.</p>;
      case 11:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderAltaStep11();
        }
        console.warn("Invalid state");
        return <p>Invalid config.</p>;
      case 12:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderAltaStep12();
        }
        console.warn("Invalid state");
        return <p>Invalid config.</p>;
      case 13:
        if (
          serviciosFlujoAlta.includes(selectedService) &&
          formData.aporteJubilacion === "activo"
        ) {
          return renderAltaStep13();
        }
        console.warn("Invalid state for step 13");
        return <p>Invalid config.</p>;
      case 14:
        if (
          serviciosFlujoAlta.includes(selectedService) &&
          formData.aporteJubilacion === "activo"
        ) {
          return renderAltaStep14();
        }
        console.warn("Invalid state for step 14");
        return <p>Invalid config.</p>;
      case 15:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderJurisdiccionDniStep15();
        }
        console.warn("Invalid state for step 15");
        return <p>Invalid config.</p>;
      case 16:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderDocumentosStep16();
        }
        console.warn("Invalid state for step 16");
        return <p>Invalid config.</p>;
      case 17:
        if (serviciosFlujoAlta.includes(selectedService)) {
          return renderResumenStep17();
        }
        console.warn("Invalid state for step 17");
        return <p>Invalid config.</p>;
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 md:p-8 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* --- Modales para selección --- */}
      <AnimatePresence>
        {/* Modal Obra Social */}
        {isObraSocialModalOpen && (
          <motion.div
            key="osModalOverlay"
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeObraSocialModal}
          >
            <motion.div
              key="osModalContent"
              className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-md font-medium text-gray-900">
                  Seleccionar Obra Social
                </h3>
                <button
                  onClick={closeObraSocialModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 border-b border-gray-200">
                <input
                  type="text"
                  value={obraSocialSearchTerm}
                  onChange={(e) => setObraSocialSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o código..."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="p-3 overflow-y-auto">
                <div className="space-y-1">
                  {opcionesObraSocial
                    .filter((os) => {
                      const searchTerm = obraSocialSearchTerm.toLowerCase();
                      const denominacion = os.denominacion.toLowerCase();
                      const rnos = String(os.rnos);
                      return (
                        denominacion.includes(searchTerm) ||
                        rnos.includes(searchTerm)
                      );
                    })
                    .map((os) => {
                      const osValue = `${os.rnos} - ${os.denominacion}`;
                      const isSelected =
                        formData.obraSocialSeleccionada === osValue;
                      return (
                        <button
                          key={os.rnos}
                          type="button"
                          onClick={() => handleSelectObraSocial(osValue)}
                          className={`w-full text-left p-1.5 rounded text-sm transition-colors ${
                            isSelected
                              ? "bg-blue-100 text-blue-700 font-semibold"
                              : "hover:bg-blue-50"
                          }`}
                        >
                          {osValue}
                        </button>
                      );
                    })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Superficie */}
        {isSuperficieModalOpen && (
          <motion.div
            key="superficieModalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeSuperficieModal}
          >
            <motion.div
              key="superficieModalContent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-md font-medium text-gray-900">
                  Seleccionar Superficie Afectada
                </h3>
                <button
                  onClick={closeSuperficieModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto">
                <div className="space-y-1">
                  {opcionesSuperficie.map((opcion, index) => {
                    const isSelected = formData.superficieAfectada === opcion;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSuperficie(opcion)}
                        className={`w-full text-left p-1.5 rounded text-sm transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal Consumo Energía */}
        {isConsumoModalOpen && (
          <motion.div
            key="consumoModalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeConsumoModal}
          >
            <motion.div
              key="consumoModalContent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="text-md font-medium text-gray-900">
                  Seleccionar Consumo Anual de Energía
                </h3>
                <button
                  onClick={closeConsumoModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 overflow-y-auto">
                <div className="space-y-1">
                  {opcionesConsumoEnergia.map((opcion, index) => {
                    const isSelected = formData.consumoEnergiaAnual === opcion;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectConsumo(opcion)}
                        className={`w-full text-left p-1.5 rounded text-sm transition-colors ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 font-semibold"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- Fin Modales --- */}
    </div>
  );
}
