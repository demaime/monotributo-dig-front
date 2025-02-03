import React, { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function Output() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Verificar si viene de un registro exitoso
    const registroExitoso = localStorage.getItem("registroExitoso");
    if (!registroExitoso) {
      window.location.href = "/";
      return;
    }

    // Limpiar el flag después de verificarlo
    localStorage.removeItem("registroExitoso");

    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    const handlePopState = function (event) {
      window.history.pushState(null, "", window.location.href);
      alert(
        "No es posible volver atrás en esta página. El formulario ya ha sido enviado."
      );
    };
    window.onpopstate = handlePopState;

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.onpopstate = null;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072a30] to-[#43d685]/90 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#43d685]/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#072a30]/30 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">
                ¡Gracias por registrarte!
              </h2>

              <p className="text-white/90 text-lg mb-8">
                Tu formulario ha sido enviado exitosamente.
              </p>

              <div className="inline-flex items-center gap-2 text-[#43d685] font-medium mb-6">
                <Timer className="w-5 h-5 animate-pulse" />
                <span>Volviendo al inicio en {countdown} segundos</span>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-[#43d685] text-white rounded-lg py-3 px-6 font-medium hover:bg-[#43d685]/90 focus:outline-none focus:ring-2 focus:ring-[#43d685] focus:ring-offset-2 focus:ring-offset-[#072a30] transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Output;
