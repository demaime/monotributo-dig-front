import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const servicios = [
  { id: "alta", label: "Alta de Monotributo" },
  { id: "recategorizacion", label: "Recategorización" },
  { id: "baja", label: "Baja de Monotributo" },
];

export default function Registro() {
  const router = useRouter();
  const { servicio } = router.query;
  const [formData, setFormData] = useState({
    tipoServicio: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  useEffect(() => {
    if (servicio) {
      setFormData(prev => ({
        ...prev,
        tipoServicio: servicio
      }));
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-[#E5F0FF] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#1E293B] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al inicio
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Registro</h1>
          <p className="text-[#6B7280] mb-8">
            Complete el formulario para comenzar con el trámite
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Tipo de Servicio
              </label>
              <select
                name="tipoServicio"
                value={formData.tipoServicio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                required
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.id} value={servicio.id}>
                    {servicio.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Mensaje (opcional)
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-300"
              ></textarea>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#0066FF] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0066FF]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Enviar solicitud
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 