import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

// Importar la URL base de API desde utils/api.js o definirla aquí
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Payment() {
  const router = useRouter();
  // Ensure price is treated as number, handle potential multiple values if needed
  const service = Array.isArray(router.query.service)
    ? router.query.service[0]
    : router.query.service;
  const price = router.query.price
    ? Number(
        Array.isArray(router.query.price)
          ? router.query.price[0]
          : router.query.price
      )
    : 0;
  const isSubscription = router.query.isSubscription === "true";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processPayment = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log("Iniciando proceso de pago...", {
        service,
        price,
        isSubscription,
      });

      if (!service || price <= 0) {
        throw new Error("Datos de servicio o precio inválidos.");
      }

      const endpoint = isSubscription
        ? `${API_BASE_URL}/payments/create-plan`
        : `${API_BASE_URL}/payments/create-preference`;

      const requestData = {
        title:
          service ||
          (isSubscription
            ? "Suscripción Mensual"
            : "Servicio Monotributo Digital"),
        price: price,
        description: isSubscription
          ? "Suscripción mensual Monotributo Digital"
          : `Servicio ${service}`,
      };

      if (!isSubscription) {
        requestData.serviceType = service || "general";
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
            isSubscription ? "plan de suscripción" : "preferencia de pago"
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
            isSubscription ? "suscripción" : "pago único"
          }). Falta init_point. Intente nuevamente.`
        );
      }
    } catch (err) {
      console.error("Error en el proceso de pago:", err);
      setError(`Error al procesar el pago: ${err.message}`);
    } finally {
      if (!window.location.href.includes("mercadopago")) {
        setLoading(false);
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
      processPayment();
    } else {
      console.log("Faltan datos de servicio o precio válidos:", {
        service,
        price,
      });
      setError("Faltan datos necesarios o válidos para procesar el pago");
      setLoading(false);
    }
  }, [router.isReady, service, price, isSubscription]);

  const paymentTypeText = isSubscription ? "Suscripción Mensual" : "Pago Único";

  return (
    <>
      <Head>
        <title>Procesando Pago - Monotributo Digital</title>
        <meta
          name="description"
          content="Procesando pago para servicio de Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center p-4">
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
                Iniciando conexión con Mercado Pago...
              </p>
            </div>
          )}

          {error && (
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
      </div>
    </>
  );
}
