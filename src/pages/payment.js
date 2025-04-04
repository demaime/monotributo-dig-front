import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Payment() {
  const router = useRouter();
  const { service, price } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const createPaymentPreference = async () => {
      try {
        console.log('Iniciando proceso de pago...', { service, price });
        
        const response = await fetch('http://localhost:5000/api/payments/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: service || 'Servicio de Monotributo Digital',
            price: price || 0,
          }),
        });

        console.log('Respuesta del servidor:', response);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);

        if (data.initPoint) {
          console.log('Redirigiendo a MercadoPago:', data.initPoint);
          window.location.href = data.initPoint;
        } else {
          setError('No se pudo crear el pago. Por favor, intente nuevamente.');
        }
      } catch (err) {
        console.error('Error en el proceso de pago:', err);
        setError(`Error al procesar el pago: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (service && price) {
      createPaymentPreference();
    } else {
      console.log('Faltan datos de servicio o precio:', { service, price });
      setError('Faltan datos necesarios para procesar el pago');
      setLoading(false);
    }
  }, [service, price]);

  return (
    <>
      <Head>
        <title>Procesando Pago - Monotributo Digital</title>
        <meta name="description" content="Procesando pago para servicio de Monotributo Digital" />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Procesando Pago
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {service && `Servicio: ${service}`}
              {price && ` - Monto: $${price}`}
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