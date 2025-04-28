import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { preapproval_id } = router.query;

  return (
    <>
      <Head>
        <title>Suscripción Exitosa - Monotributo Digital</title>
        <meta
          name="description"
          content="Suscripción exitosa a Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              ¡Suscripción Exitosa!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tu suscripción mensual a Monotributo Digital ha sido procesada
              correctamente.
            </p>
            {preapproval_id && (
              <p className="mt-2 text-xs text-gray-500">
                ID de Suscripción: {preapproval_id}
              </p>
            )}
          </div>

          <div className="mt-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Tu pago se ha procesado correctamente. Recibirás un correo
                    electrónico con los detalles de tu suscripción.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
