import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Output() {
  const router = useRouter();

  // Prevenir navegación hacia atrás
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function (event) {
      window.history.pushState(null, "", window.location.href);
      alert(
        "No es posible volver atrás en esta página. El formulario ya ha sido enviado."
      );
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          ¡Gracias por registrarte!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Tu formulario ha sido enviado exitosamente.
        </p>
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-950 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
