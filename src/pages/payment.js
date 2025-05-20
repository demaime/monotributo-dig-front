import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, AlertTriangle, CheckCircle } from "lucide-react";

// Importar la URL base de API desde utils/api.js o definirla aquí
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY;

export default function Payment() {
  const router = useRouter();
  const { service, price: priceQuery, transactionId } = router.query;

  // Define if this is a semestral plan
  const isSemesterPlan =
    router.isReady && // Ensure router query is available
    (service === "plan_base" ||
      service === "plan_full" ||
      service === "plan_premium");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [formValid, setFormValid] = useState(false);

  const processPayment = async () => {
    setError(null);
    setIsProcessing(true);
    setLoading(true);
    setShowEmailModal(false);

    try {
      console.log("Iniciando proceso de pago...", {
        service,
        price: priceQuery,
        isSemesterPlan,
      });

      if (!service || priceQuery <= 0) {
        throw new Error("Datos de servicio o precio inválidos.");
      }

      // Guardar el email en localStorage
      if (contactEmail) {
        localStorage.setItem("userEmail", contactEmail);
      }

      // Use the calculated boolean for endpoint selection
      const endpoint = isSemesterPlan
        ? `${API_BASE_URL}/payments/create-plan`
        : `${API_BASE_URL}/payments/create-preference`;

      const requestData = {
        title:
          service ||
          (isSemesterPlan ? "Plan Semestral" : "Servicio Monotributo Digital"),
        price: priceQuery,
        description: isSemesterPlan
          ? "Plan semestral Monotributo Digital"
          : `Servicio ${service}`,
        serviceType: service || "general",
        email: email, // User's contact email (initially)
        userName: name,
        transactionId: transactionId,
        installments: true, // Enable installments for all payments
      };

      // Use the calculated boolean for email validation
      if (isSemesterPlan) {
        if (!contactEmail || !/\S+@\S+\.\S+/.test(contactEmail)) {
          throw new Error(
            "Es necesario un email válido para continuar con el plan semestral."
          );
        }
        requestData.email = contactEmail; // Use contact email for semester plans
      }

      console.log("Enviando datos al backend:", endpoint, requestData);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      console.log(
        "Respuesta del backend:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error en respuesta del backend:", errorBody);
        let parsedError = "Error interno del servidor";
        try {
          const jsonError = JSON.parse(errorBody);
          parsedError = jsonError.error || jsonError.message || parsedError;
        } catch (e) {
          /* Ignore parsing error, use default */
        }
        throw new Error(
          `Error ${response.status} al crear ${
            isSemesterPlan ? "plan semestral" : "preferencia de pago"
          }. Detalles: ${parsedError}`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos del backend:", data);

      const initPoint =
        data.init_point ||
        data.sandbox_init_point ||
        data.plan?.init_point ||
        data.plan?.sandbox_init_point;

      if (initPoint) {
        console.log("Redirigiendo a MercadoPago:", initPoint);
        window.location.href = initPoint;
        return;
      } else {
        console.error("Respuesta del backend no contiene init_point:", data);
        setError(
          `No se pudo iniciar el proceso de pago. Falta init_point. Intente nuevamente.`
        );
      }
    } catch (err) {
      console.error("Error en el proceso de pago:", err);
      setError(`Error al procesar el pago: ${err.message}`);
    } finally {
      if (!window.location.href.includes("mercadopago")) {
        setLoading(false);
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    setLoading(true);
    setError(null);

    if (service && priceQuery > 0) {
      // Verificar si es un plan semestral
      const shouldShowEmailModal = isSemesterPlan;

      if (shouldShowEmailModal) {
        const suggestedEmail = localStorage.getItem("userEmail") || "";
        setContactEmail(suggestedEmail);
        setShowEmailModal(true);
        setLoading(false);
      } else {
        processPayment();
      }
    } else {
      console.log("Faltan datos de servicio o precio válidos:", {
        service,
        price: priceQuery,
      });
      setError("Faltan datos necesarios o válidos para procesar el pago");
      setLoading(false);
    }
  }, [router.isReady, service, priceQuery]);

  useEffect(() => {
    // Validar cuando cambian los inputs
    setFormValid(email.includes("@") && name.trim().length > 0);
  }, [email, name]);

  useEffect(() => {
    // Verificar si hay datos de servicio
    if (router.isReady) {
      if (!service || !priceQuery) {
        setError("No se encontraron datos del servicio seleccionado.");
        setLoading(false);
        return;
      }

      // Obtener email guardado previamente
      const savedEmail = localStorage.getItem("userEmail");
      if (savedEmail) {
        setEmail(savedEmail);
      }

      // Obtener nombre guardado previamente
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        setName(savedName);
      }

      setLoading(false);
    }
  }, [router.isReady, service, priceQuery]);

  // Use the component-scoped isSemesterPlan variable here
  const paymentTypeText = isSemesterPlan ? "Plan Semestral" : "Pago Único";

  return (
    <>
      <Head>
        <title>Procesando Pago - Monotributo Digital</title>
        <meta
          name="description"
          content="Procesando pago para servicio de Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center p-4 relative">
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-center mb-4">
                <Image
                  src="/assets/mp-logo.png"
                  alt="Mercado Pago"
                  width={120}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
              <h2 className="text-xl font-bold text-center mb-4">
                Datos para tu Plan Semestral
              </h2>
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email de contacto
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="tu@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este email se usará para contactarte sobre tu plan
                    semestral.
                  </p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    router.push("/");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (contactEmail && contactEmail.includes("@")) {
                      processPayment();
                    } else {
                      setError(
                        "Por favor ingresa un email válido para continuar."
                      );
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {!showEmailModal && (
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Procesando Pago</h1>
              <div className="text-sm text-gray-500">{paymentTypeText}</div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Servicio:
                </span>
                <p className="font-medium">
                  {service === "plan_base" && "Plan Base Semestral"}
                  {service === "plan_full" && "Plan Full Semestral"}
                  {service === "plan_premium" && "Plan Premium Semestral"}
                  {service === "alta" && "Servicio de Alta Monotributo"}
                  {service === "baja" && "Servicio de Baja Monotributo"}
                  {service === "recategorizacion" &&
                    "Servicio de Recategorización"}
                  {service !== "plan_base" &&
                    service !== "plan_full" &&
                    service !== "plan_premium" &&
                    service !== "alta" &&
                    service !== "baja" &&
                    service !== "recategorizacion" &&
                    service}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Precio:
                </span>
                <p className="font-medium">
                  ${new Intl.NumberFormat("es-AR").format(priceQuery || 0)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Método:
                </span>
                <p className="font-medium flex items-center">
                  <img
                    src="/assets/mp-logo.png"
                    alt="Mercado Pago"
                    className="h-5 w-auto mr-2"
                  />
                  Mercado Pago (6 cuotas)
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              {loading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="mt-3 text-sm text-gray-500">
                    {isProcessing
                      ? "Generando preferencia de pago..."
                      : "Cargando..."}
                  </p>
                </div>
              ) : (
                <button
                  onClick={processPayment}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 text-white font-medium rounded-md shadow-sm ${
                    isProcessing
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isProcessing ? "Procesando..." : "Proceder al pago"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
