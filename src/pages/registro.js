import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  UserRound,
  MapPin,
  Phone,
  Mail,
  Users,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/router";

function Registro() {
  const [provinces, setProvinces] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localityInput, setLocalityInput] = useState("");
  const [formData, setFormData] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    genero: "",
  });

  const [localitiesCache, setLocalitiesCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [existingUser, setExistingUser] = useState(null);
  const [errors, setErrors] = useState({
    apellido: "",
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
    provincia: "",
    localidad: "",
    genero: "",
  });

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const router = useRouter();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchWithRetry = async (url, retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 429) {
          await delay(delayMs);
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await delay(delayMs);
      }
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithRetry(
          "https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre"
        );

        if (data.provincias && data.provincias.length > 0) {
          setProvinces(
            data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre))
          );
        }
      } catch (error) {
        console.error("Error al cargar las provincias:", error);
        alert("Error al cargar las provincias. Por favor, recargue la página.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvince || isLoading) return;

    const fetchLocalities = async () => {
      try {
        setIsLoading(true);

        if (localitiesCache[selectedProvince]) {
          setLocalities(localitiesCache[selectedProvince]);
          return;
        }

        const data = await fetchWithRetry(
          `https://apis.datos.gob.ar/georef/api/localidades?provincia=${selectedProvince}&campos=nombre,departamento&max=1000`
        );

        if (data.localidades && data.localidades.length > 0) {
          const localitiesSet = new Set(
            data.localidades.map((locality) => {
              const department = locality.departamento?.nombre || "";
              return department
                ? `${locality.nombre} (${department})`
                : locality.nombre;
            })
          );

          const sortedLocalities = [...localitiesSet].sort();

          setLocalitiesCache((prev) => ({
            ...prev,
            [selectedProvince]: sortedLocalities,
          }));

          setLocalities(sortedLocalities);
        }
      } catch (error) {
        console.error("Error al cargar las localidades:", error);
        alert(
          "Error al cargar las localidades. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalities();
  }, [selectedProvince, isLoading]);

  useEffect(() => {
    const storedDni = localStorage.getItem("tempDni");
    if (storedDni) {
      setFormData((prev) => ({ ...prev, dni: storedDni }));
    } else {
      router.push("/autenticar");
    }
  }, []);

  useEffect(() => {
    const loadRecaptcha = () => {
      if (document.querySelector('script[src*="recaptcha"]')) {
        return;
      }

      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        console.error("Error loading reCAPTCHA script");
      };

      document.head.appendChild(script);
    };
    
    loadRecaptcha();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/;
    return regex.test(name);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    switch (id) {
      case "telefono":
        if (value === "" || /^[0-9]*$/.test(value)) {
          setFormData({ ...formData, [id]: value });
        }
        break;

      case "apellido":
      case "nombre":
        if (value === "" || validateName(value)) {
          setFormData({ ...formData, [id]: value.toUpperCase() });
        }
        break;

      case "dni":
        if (value === "" || /^[0-9]*$/.test(value)) {
          setFormData({ ...formData, [id]: value });
        }
        break;

      default:
        setFormData({ ...formData, [id]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!window.grecaptcha) {
        setErrors((prev) => ({
          ...prev,
          captcha: "Error: reCAPTCHA no está disponible",
        }));
        return;
      }

      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        {
          action: "submit",
        }
      );

      setErrors({});
      let hasErrors = false;
      let newErrors = {};

      if (!validateName(formData.apellido)) {
        newErrors.apellido =
          "El apellido solo puede contener letras, espacios y guiones";
        hasErrors = true;
      }
      if (!validateName(formData.nombre)) {
        newErrors.nombre =
          "El nombre solo puede contener letras, espacios y guiones";
        hasErrors = true;
      }
      if (!/^[0-9]{7,8}$/.test(formData.dni)) {
        newErrors.dni = "El DNI debe contener entre 7 y 8 números";
        hasErrors = true;
      }
      if (!validateEmail(formData.email)) {
        newErrors.email = "Por favor ingrese un email válido";
        hasErrors = true;
      }
      if (!validatePhone(formData.telefono)) {
        newErrors.telefono = "El teléfono debe contener 10 números";
        hasErrors = true;
      }
      if (!selectedProvince) {
        newErrors.provincia = "Seleccione una provincia";
        hasErrors = true;
      }
      if (!localityInput) {
        newErrors.localidad = "Seleccione una localidad";
        hasErrors = true;
      }
      if (!formData.genero) {
        newErrors.genero = "Seleccione un género";
        hasErrors = true;
      }

      if (hasErrors) {
        setErrors(newErrors);
        return;
      }

      const formFields = {
        ...formData,
        provincia: selectedProvince,
        localidad: localityInput,
        recaptchaToken: token,
      };

      if (Object.values(formFields).some((field) => field === "")) {
        alert("Por favor complete todos los campos");
        return;
      }

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem("tempDni");
        localStorage.setItem("registroExitoso", "true");
        window.location.href = "/output";
      } else if (response.status === 409) {
        setExistingUser({ email: data.email });
      } else {
        throw new Error(data.message || "Error al enviar el formulario");
      }
    } catch (error) {
      console.error("Error en reCAPTCHA:", error);
      setErrors((prev) => ({
        ...prev,
        captcha: `Error en reCAPTCHA: ${error.message}`,
      }));
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

  // Agregar estos estilos al inicio del componente, fuera del return
  const recaptchaStyles = `
    .grecaptcha-badge {
      visibility: hidden;
      right: 0 !important;
      bottom: 0 !important;
    }
  `;

  return (
    <>
      {/* Agregar los estilos inline */}
      <style>{recaptchaStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-[#072a30] to-[#43d685]/90 relative overflow-hidden">
        {/* Background blur circles */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#43d685]/30 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#072a30]/30 blur-[120px]" />

        <div className="relative z-10 container mx-auto px-4 py-12 md:w-2/3">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
              {!existingUser ? (
                <>
                  <h2 className="text-3xl font-bold mb-6 text-white text-center">
                    Formulario de Registro
                  </h2>

                  <p className="text-[#43d685] text-sm mb-6 text-center">
                    * Todos los campos son obligatorios
                  </p>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <UserRound className="w-4 h-4" />
                          DNI
                        </div>
                      </label>
                      <input
                        type="text"
                        id="dni"
                        required
                        value={formData.dni}
                        readOnly
                        className="w-full bg-white/20 border border-white/10 rounded-lg px-4 py-2.5 text-gray-300 placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors cursor-not-allowed"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          <div className="flex items-center gap-2">
                            <UserRound className="w-4 h-4" />
                            Nombre
                          </div>
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          required
                          value={formData.nombre}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className={`w-full bg-white/5 border ${
                            errors.nombre ? "border-red-500" : "border-white/10"
                          } rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors`}
                          placeholder="Ingrese su nombre"
                        />
                        {errors.nombre && (
                          <p className="flex items-center gap-2 text-red-100 bg-red-900/20 px-3 py-1 rounded-md mt-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {errors.nombre}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          <div className="flex items-center gap-2">
                            <UserRound className="w-4 h-4" />
                            Apellido
                          </div>
                        </label>
                        <input
                          type="text"
                          id="apellido"
                          required
                          value={formData.apellido}
                          onChange={handleInputChange}
                          autoComplete="off"
                          className={`w-full bg-white/5 border ${
                            errors.apellido ? "border-red-500" : "border-white/10"
                          } rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors`}
                          placeholder="Ingrese su apellido"
                        />
                        {errors.apellido && (
                          <p className="flex items-center gap-2 text-red-100 bg-red-900/20 px-3 py-1 rounded-md mt-2 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            {errors.apellido}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Provincia
                          </div>
                        </label>
                        <select
                          id="provincia"
                          required
                          value={selectedProvince}
                          onChange={(e) => setSelectedProvince(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors [&>option]:bg-[#072a30] [&>option]:text-white"
                        >
                          <option value="">Seleccione una provincia</option>
                          {provinces.map((province) => (
                            <option key={province.id} value={province.id}>
                              {province.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedProvince && (
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Localidad
                            </div>
                          </label>
                          <select
                            id="localidad"
                            required
                            value={localityInput}
                            onChange={(e) => setLocalityInput(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors [&>option]:bg-[#072a30] [&>option]:text-white"
                          >
                            <option value="">Seleccione una localidad</option>
                            {localities.map((locality, index) => (
                              <option key={index} value={locality}>
                                {locality}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Género
                        </div>
                      </label>
                      <select
                        id="genero"
                        required
                        value={formData.genero}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors [&>option]:bg-[#072a30] [&>option]:text-white"
                      >
                        <option value="">Seleccione un género</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                        <option value="OTRO">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </div>
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${
                          errors.email ? "border-red-500" : "border-white/10"
                        } rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors`}
                        placeholder="ejemplo@correo.com"
                      />
                      {errors.email && (
                        <p className="flex items-center gap-2 text-red-100 bg-red-900/20 px-3 py-1 rounded-md mt-2 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Teléfono
                        </div>
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className={`w-full bg-white/5 border ${
                          errors.telefono ? "border-red-500" : "border-white/10"
                        } rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:border-[#43d685] focus:ring-1 focus:ring-[#43d685] transition-colors`}
                        placeholder="Ej: 1112345678"
                      />
                      {errors.telefono && (
                        <p className="flex items-center gap-2 text-red-100 bg-red-900/20 px-3 py-1 rounded-md mt-2 text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          {errors.telefono}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div id="recaptcha"></div>
                      
                      {/* Agregar texto de términos de reCAPTCHA */}
                      <p className="text-white/60 text-xs text-center">
                        Este sitio está protegido por reCAPTCHA y aplican las {' '}
                        <a 
                          href="https://policies.google.com/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#43d685] hover:underline"
                        >
                          Políticas de Privacidad
                        </a> {' '}
                        y {' '}
                        <a 
                          href="https://policies.google.com/terms" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#43d685] hover:underline"
                        >
                          Términos de Servicio
                        </a> {' '}
                        de Google.
                      </p>
                      
                      {errors.captcha && (
                        <p className="flex items-center gap-2 text-red-100 bg-red-900/20 px-3 py-1 rounded-md text-sm font-medium">
                          <AlertCircle className="w-4 h-4" />
                          {errors.captcha}
                        </p>
                      )}
                      
                      <button
                        type="submit"
                        className="w-full bg-[#43d685] text-white rounded-lg py-3 px-4 font-medium hover:bg-[#43d685]/90 focus:outline-none focus:ring-2 focus:ring-[#43d685] focus:ring-offset-2 focus:ring-offset-[#072a30] transition-colors flex items-center justify-center gap-2 group"
                      >
                        Enviar
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </>
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
                      {maskEmail(existingUser.email)}
                    </p>
                  </div>

                  <button
                    onClick={() => (window.location.href = "/")}
                    className="bg-[#43d685] text-white rounded-lg py-3 px-6 font-medium hover:bg-[#43d685]/90 focus:outline-none focus:ring-2 focus:ring-[#43d685] focus:ring-offset-2 focus:ring-offset-[#072a30] transition-colors"
                  >
                    Volver al inicio
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registro;
