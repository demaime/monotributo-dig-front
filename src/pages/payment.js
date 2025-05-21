import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

// Importar la URL base de API desde utils/api.js o definirla aquí
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // Ya no se usará directamente aquí
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
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async () => {
    setError(null);
    setIsProcessing(true);
    setLoading(true);

    try {
      console.log("Iniciando proceso de pago...", {
        service,
        price: priceQuery,
        isSemesterPlan,
      });

      if (!service || priceQuery <= 0) {
        throw new Error("Datos de servicio o precio inválidos.");
      }

      // Use the calculated boolean for endpoint selection
      const endpoint = isSemesterPlan
        ? `/api/payments/create-plan`
        : `/api/payments/create-preference`;

      // Get stored email if available
      const userEmail = localStorage.getItem("userEmail") || "";

      const requestData = {
        title:
          service ||
          (isSemesterPlan ? "Plan Semestral" : "Servicio Monotributo Digital"),
        price: priceQuery,
        description: isSemesterPlan
          ? "Plan semestral Monotributo Digital"
          : `Servicio ${service}`,
        serviceType: service || "general",
        email: userEmail,
        transactionId: transactionId,
        installments: true, // Enable installments for all payments
      };


      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });


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

    if (service && priceQuery > 0) {
      // Process payment directly, no need for email collection step
      processPayment();
    } else {
      console.log("Faltan datos de servicio o precio válidos:", {
        service,
        price: priceQuery,
      });
      setError("Faltan datos necesarios o válidos para procesar el pago");
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
              <span className="text-sm font-medium text-gray-500">Precio:</span>
              <p className="font-medium">
                ${new Intl.NumberFormat("es-AR").format(priceQuery || 0)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Método:</span>
              <p className="font-medium flex items-center">
                <img
                  src="/assets/mp-logo.png"
                  alt="Mercado Pago"
                  className="h-5 w-auto mr-2"
                />
                Mercado Pago
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-col items-center w-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-3 text-sm text-gray-500 text-center">
                {isProcessing
                  ? "Generando preferencia de pago..."
                  : "Redirigiendo a Mercado Pago..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
