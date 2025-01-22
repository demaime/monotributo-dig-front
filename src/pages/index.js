import React from "react";

import { ArrowRight, BarChart2, LineChart, PieChart } from "lucide-react";
import { useRouter } from "next/router";

function App() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072a30] to-[#43d685]/90 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#43d685]/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#072a30]/30 blur-[120px]" />

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 py-10">
        <nav className="flex justify-between items-center mb-20">
          <div className="text-white font-bold text-2xl flex items-center gap-2">
            <BarChart2 className="w-8 h-8" />
            Encuestas 2025
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Tu opinión tiene poder. Sumate.
            </h1>
            <p className="text-xl text-white/80 flex flex-col">
              Participá en el relevamiento online más grande y significativo del
              país. <strong>Tu opinión cuenta.</strong>
            </p>
            <button
              onClick={() => router.push("/registro")}
              className="group flex items-center gap-2 bg-white text-[#072a30] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#43d685] hover:text-white transition-all duration-300"
            >
              Registrarme
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#43d685]/10 to-transparent blur-2xl rounded-full" />
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 p-6 bg-white/5 rounded-xl">
                  <LineChart className="w-8 h-8 text-[#43d685]" />
                  <div className="flex"></div>

                  <h3 className="text-white font-semibold">
                    Resultados analíticos{" "}
                  </h3>
                  <p className="text-white/70 text-sm">
                    Informese con los resultados de las encuestas.
                  </p>
                </div>
                <div className="space-y-4 p-6 bg-white/5 rounded-xl">
                  <PieChart className="w-8 h-8 text-[#43d685]" />

                  <div className="flex"></div>
                  <h3 className="text-white font-semibold">
                    Posicionamiento político{" "}
                  </h3>
                  <p className="text-white/70 text-sm">
                    Descubra sus estadísticas dentro del total encuestado{" "}
                  </p>
                </div>
              </div>
              <div className="mt-6 p-6 bg-white/5 rounded-xl">
                <img
                  src="/assets/congreso.jpg"
                  alt="Elecciones legislativas 2025"
                  className="rounded-lg w-full h-48 object-cover"
                  style={{ objectPosition: "center 35%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
