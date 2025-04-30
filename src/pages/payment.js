import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import { Mail, AlertTriangle, CheckCircle } from "lucide-react";

// Importar la URL base de API desde utils/api.js o definirla aquí
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Payment() {
  const router = useRouter();
  const { service, price, isSubscription, minMonths } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMpEmailModal, setShowMpEmailModal] = useState(false);
  const [mpEmail, setMpEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [formValid, setFormValid] = useState(false);

  const processPayment = async () => {
    setError(null);
    setIsProcessing(true);
    setLoading(true);
    setShowMpEmailModal(false);

    // --- Determine if it's a subscription based on service name ---
    const isActuallySubscription =
      service === "plan_base" ||
      service === "plan_full" ||
      service === "plan_premium" ||
      service === "mensual"; // Include legacy 'mensual' if needed
    // --------------------------------------------------------------

    try {
      console.log("Iniciando proceso de pago...", {
        service,
        price,
        isSubscriptionQuery: isSubscription, // Log original query param
        isActuallySubscription: isActuallySubscription, // Log calculated boolean
      });

      if (!service || price <= 0) {
        throw new Error("Datos de servicio o precio inválidos.");
      }

      // Use the calculated boolean for endpoint selection
      const endpoint = isActuallySubscription
        ? `${API_BASE_URL}/payments/create-plan`
        : `${API_BASE_URL}/payments/create-preference`;

      const requestData = {
        title:
          service ||
          (isActuallySubscription // Use calculated boolean
            ? "Suscripción Mensual"
            : "Servicio Monotributo Digital"),
        price: price,
        description: isActuallySubscription // Use calculated boolean
          ? "Suscripción mensual Monotributo Digital"
          : `Servicio ${service}`,
        serviceType: service || "general",
        email: email, // User's contact email (initially)
        userName: name,
        minMonths: Number(minMonths) || 1, // Relevant for subscriptions
      };

      // Use the calculated boolean for MP Email validation
      if (isActuallySubscription) {
        if (!mpEmail || !/\S+@\S+\.\S+/.test(mpEmail)) {
          // This error should now only trigger for actual subscriptions if email is bad
          throw new Error(
            "Por favor, ingresa un email válido para Mercado Pago."
          );
        }
        requestData.email = mpEmail; // Overwrite email with MP email for subscriptions
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
            isActuallySubscription
              ? "plan de suscripción"
              : "preferencia de pago"
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
          `No se pudo iniciar el proceso de pago (${
            isActuallySubscription ? "suscripción" : "pago único"
          }). Falta init_point. Intente nuevamente.`
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

    if (service && price > 0) {
      if (isSubscription === "true") {
        const suggestedEmail = localStorage.getItem("userEmail") || "";
        setMpEmail(suggestedEmail);
        setShowMpEmailModal(true);
        setLoading(false);
      } else {
        processPayment();
      }
    } else {
      console.log("Faltan datos de servicio o precio válidos:", {
        service,
        price,
      });
      setError("Faltan datos necesarios o válidos para procesar el pago");
      setLoading(false);
    }
  }, [router.isReady, service, price, isSubscription]);

  useEffect(() => {
    // Validar cuando cambian los inputs
    setFormValid(email.includes("@") && name.trim().length > 0);
  }, [email, name]);

  useEffect(() => {
    // Verificar si hay datos de servicio
    if (router.isReady) {
      if (!service || !price) {
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
  }, [router.isReady, service, price]);

  const paymentTypeText = isActuallySubscription
    ? "Suscripción Mensual"
    : "Pago Único";

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
        {showMpEmailModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <div className="flex justify-center mb-4">
                <img src="/mp-logo.png" alt="Mercado Pago" className="h-10" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                Confirmación Requerida
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Para continuar, por favor ingresa el email de tu cuenta de
                Mercado Pago.
                <br />
                <span className="font-semibold">
                  Este email debe pertenecer a una cuenta válida desde la cual
                  se descontará la suscripción mensualmente.
                </span>
              </p>
              <div className="relative mb-4">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={mpEmail}
                  onChange={(e) => setMpEmail(e.target.value)}
                  placeholder="tu-email@mercadopago.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
              </div>
              {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => router.back()}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={processPayment}
                  disabled={isProcessing || !mpEmail}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Procesando..." : "Confirmar y Continuar"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {(!showMpEmailModal || isProcessing) && (
          <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Procesando Pago
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {paymentTypeText}
                {service && ` - Servicio: ${service}`}
                {price && ` - Monto: $${price}`}
              </p>
            </div>

            {loading && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-600 self-center">
                  {isProcessing
                    ? "Iniciando conexión con Mercado Pago..."
                    : "Cargando..."}
                </p>
              </div>
            )}

            {error && !showMpEmailModal && (
              <div className="mt-8 text-center bg-red-50 p-4 rounded-md">
                <div className="flex items-center justify-center text-red-600">
                  <p className="font-medium">Error al procesar el pago</p>
                </div>
                <p className="mt-2 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => router.back()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Volver
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
