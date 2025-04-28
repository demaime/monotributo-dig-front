import { useState } from "react";
import { useRouter } from "next/router";

const SERVICES = {
  alta: {
    name: "Alta de Monotributo",
    description: "Servicio de registro inicial en el régimen de Monotributo",
    price: 5000,
    isSubscription: false,
  },
  recategorizacion: {
    name: "Recategorización",
    description: "Servicio de cambio de categoría en el Monotributo",
    price: 3500,
    isSubscription: false,
  },
  baja: {
    name: "Baja de Monotributo",
    description: "Servicio de cancelación del Monotributo",
    price: 2500,
    isSubscription: false,
  },
  mensual: {
    name: "Servicio Mensual",
    description: "Asesoramiento y gestión continua de tu Monotributo",
    price: 1800,
    isSubscription: true,
  },
};

export default function PaymentSelector({ selectedService = "alta" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const service = SERVICES[selectedService] || SERVICES.alta;

  const handlePayment = () => {
    try {
      setLoading(true);
      setError(null);

      // Store email in localStorage for subscription if available
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail && service.isSubscription) {
        // We could show a modal to collect email here
        localStorage.setItem("userEmail", "usuario@example.com");
      }

      // Navigate to payment page with service details
      router.push({
        pathname: "/payment",
        query: {
          service: selectedService,
          price: service.price,
          isSubscription: service.isSubscription,
        },
      });
    } catch (err) {
      console.error("Error al iniciar el pago:", err);
      setError(
        "Error al iniciar el proceso de pago. Por favor, intente nuevamente."
      );
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {service.name}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{service.description}</p>
        </div>
        <div className="mt-3 text-xl font-bold text-gray-900">
          ${service.price}
          {service.isSubscription && (
            <span className="text-sm font-normal"> /mes</span>
          )}
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={handlePayment}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                {service.isSubscription ? "Suscribirse" : "Pagar"} con
                MercadoPago
              </>
            )}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
