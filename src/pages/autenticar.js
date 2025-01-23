import React, { useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";

function Autenticar({ onDniValidated }) {
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingUser, setExistingUser] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      setDni(value);
      setError("");
    }
  };

  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) +
      "*".repeat(username.length - 2) +
      username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkDni", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dni }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          setExistingUser({
            maskedEmail: maskEmail(data.email),
          });
        } else {
          localStorage.setItem("tempDni", dni);
          router.push("/registro");
        }
      } else {
        setError(data.message || "Error al verificar el DNI");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072a30] to-[#43d685]/90 relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#43d685]/30 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#072a30]/30 blur-[120px]" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">
              Verificación de DNI
            </h2>

            {!existingUser ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ingrese su DNI para continuar
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={handleInputChange}
                    maxLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors"
                    placeholder="Ej: 12345678"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#43d685] text-white rounded-lg py-3 px-4 font-medium hover:bg-[#43d685]/90 focus:outline-none focus:ring-2 focus:ring-[#43d685] focus:ring-offset-2 focus:ring-offset-[#072a30] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    "Verificando..."
                  ) : (
                    <>
                      Verificar
                      <Search className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Usuario ya registrado
                  </h3>
                  <p className="text-white/90 mb-2">
                    Ya existe un registro con este DNI.
                  </p>
                  <p className="text-white/90">
                    Las comunicaciones serán enviadas a:
                  </p>
                  <p className="text-[#43d685] font-mono mt-2 truncate">
                    {existingUser.maskedEmail}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDni("");
                    setExistingUser(null);
                  }}
                  className="bg-white/10 text-white rounded-lg py-3 px-6 font-medium hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#072a30] transition-colors"
                >
                  Verificar otro DNI
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Autenticar;
