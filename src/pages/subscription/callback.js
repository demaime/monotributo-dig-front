import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SubscriptionCallback() {
  const router = useRouter();
  const { preapproval_id, status } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Process the callback
    const processCallback = async () => {
      try {
        // We would typically update our own database here with the subscription status
        console.log("Procesando callback de suscripción:", {
          preapproval_id,
          status,
        });

        if (status === "authorized") {
          // Subscription was successful, redirect to success page
          router.push(`/subscription/success?preapproval_id=${preapproval_id}`);
        } else {
          // Subscription failed or was pending
          setError(`La suscripción no pudo completarse. Estado: ${status}`);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error en procesamiento de callback:", err);
        setError(`Error al procesar la suscripción: ${err.message}`);
        setLoading(false);
      }
    };

    if (preapproval_id && status) {
      processCallback();
    } else if (router.isReady) {
      setError("Faltan datos necesarios para procesar la suscripción");
      setLoading(false);
    }
  }, [preapproval_id, status, router.isReady, router]);

  return (
    <>
      <Head>
        <title>Procesando Suscripción - Monotributo Digital</title>
        <meta
          name="description"
          content="Procesando suscripción a Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Procesando Suscripción
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Estamos procesando tu suscripción a Monotributo Digital.
            </p>
          </div>

          {loading && (
            <div className="mt-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="mt-8 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Volver al Inicio
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
