import Head from "next/head";
import Link from "next/link";

export default function FAQ() {
  return (
    <>
      <Head>
        <title>Preguntas Frecuentes - Monotributo Digital</title>
        <meta
          name="description"
          content="Preguntas frecuentes sobre Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Ayuda
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Preguntas Frecuentes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Respuestas a las consultas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Información sobre servicios y pagos
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ¿Cuáles son los planes disponibles?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <p className="mb-2">
                      Ofrecemos los siguientes planes semestrales:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Plan Base ($150.000/semestre):</strong> Incluye
                        alta de monotributo, 4 consultas profesionales mensuales
                        con contador matriculado y recategorización semestral.
                      </li>
                      <li>
                        <strong>Plan Full ($180.000/semestre):</strong> Incluye
                        alta de monotributo, recategorización, 8 consultas
                        profesionales mensuales con contador matriculado y
                        emisión de 4 facturas mensuales.
                      </li>
                      <li>
                        <strong>Plan Premium ($240.000/semestre):</strong>{" "}
                        Incluye alta de monotributo, recategorización, consultas
                        mensuales ilimitadas con contador matriculado y emisión
                        de hasta 10 facturas mensuales.
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ¿Cuánto cuestan los servicios individuales?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Alta de Monotributo:</strong> $75.000
                      </li>
                      <li>
                        <strong>Baja de Monotributo:</strong> $75.000
                      </li>
                      <li>
                        <strong>Recategorización:</strong> $5.000
                      </li>
                      <li>
                        <strong>Factura Adicional:</strong> $2.000 cada una
                        (para planes que ya completaron su cupo mensual)
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ¿Los planes tienen un período mínimo?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <p>
                      Sí, todos nuestros planes se contratan por semestre. La
                      facturación se realiza de forma semestral (cada 6 meses).
                    </p>
                  </dd>
                </div>

                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ¿Cómo se pagan los servicios?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <p>
                      Todos nuestros servicios se pueden pagar a través de
                      MercadoPago, que ofrece múltiples opciones como tarjetas
                      de crédito y débito, transferencias bancarias y otros
                      métodos disponibles en la plataforma.
                    </p>
                    <p className="mt-2">
                      Para los planes de suscripción, el pago se procesa
                      automáticamente cada mes mediante el método de pago que
                      hayas seleccionado al suscribirte.
                    </p>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    ¿Emiten factura por los servicios?
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <p>
                      Sí, emitimos factura electrónica por todos los servicios
                      contratados. La factura se envía automáticamente al correo
                      electrónico que hayas proporcionado al realizar el pago.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
