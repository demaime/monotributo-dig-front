import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  BarChart2,
  Calculator,
  PieChart,
  CheckCircle2,
  CreditCard,
  FileText,
  HelpCircle,
} from "lucide-react";
import { useRouter } from "next/router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import AdvisorySection from "../components/home/AdvisorySection";

function App() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const images = ["/1.jpg", "/2.jpeg", "/3.jpeg", "/4.jpeg"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E5F0FF] blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#0066FF]/10 blur-[120px]" />

      {/* Content container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-10">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-between items-center mb-20">
            <div className="text-[#1E293B] font-bold text-2xl flex items-center gap-2">
              <BarChart2 className="w-8 h-8 text-[#0066FF]" />
              Monotributo Digital
            </div>
            <div className="flex gap-6">
              <a
                href="#servicios"
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Servicios
              </a>
              <a
                href="#precios"
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Precios
              </a>
              <a
                href="#contacto"
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Contacto
              </a>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <nav className="lg:hidden flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-20"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </motion.button>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[#1E293B] font-bold text-2xl flex items-center gap-2"
                >
                  <BarChart2 className="w-8 h-8 text-[#0066FF]" />
                  Monotributo Digital
                </motion.div>
              </div>
            </motion.div>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-col gap-4 bg-white shadow-lg rounded-xl p-6 mb-8 absolute top-20 left-4 right-4 z-50"
                >
                  <motion.a
                    whileHover={{ x: 10 }}
                    href="#servicios"
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-2 block"
                  >
                    Servicios
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 10 }}
                    href="#precios"
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-2 block"
                  >
                    Precios
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 10 }}
                    href="#contacto"
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-2 block"
                  >
                    Contacto
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Desktop Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:grid lg:grid-cols-3 gap-12 items-center bg-[#E5F0FF] rounded-2xl"
          >
            <div className="space-y-8 pl-14 lg:col-span-1">
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl lg:text-6xl font-bold text-[#1E293B] leading-tight"
              >
                Simplifica tu monotributo
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-[#6B7280] flex flex-col"
              >
                Gestioná tu monotributo de forma digital y eficiente.{" "}
                <strong>Sin complicaciones.</strong>
              </motion.h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 bg-[#0066FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#0066FF]/90 transition-all duration-300"
              >
                Registrate
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative lg:col-span-2"
            >
              <div
                className="relative h-[400px] w-full overflow-hidden rounded-2xl"
                style={{
                  clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                }}
              >
                {images.map((img, index) => (
                  <motion.div
                    key={img}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentImage === index ? 1 : 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: `url(/assets${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4 absolute -bottom-20 right-4"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-blue-100 shadow-lg rounded-xl p-4"
                >
                  <FileText className="w-6 h-6 text-[#0066FF] mb-2" />
                  <h3 className="text-[#1E293B] font-semibold text-sm">
                    Gestión Digital
                  </h3>
                  <p className="text-[#6B7280] text-xs">
                    Todo tu monotributo en un solo lugar
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-blue-100 shadow-lg rounded-xl p-4"
                >
                  <CreditCard className="w-6 h-6 text-[#0066FF] mb-2" />
                  <h3 className="text-[#1E293B] font-semibold text-sm">
                    Pagos Online
                  </h3>
                  <p className="text-[#6B7280] text-xs">
                    Paga tus impuestos de forma segura
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Mobile Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden grid gap-12 items-center bg-[#E5F0FF] rounded-2xl"
          >
            <div className="space-y-8 px-8 pt-8">
              <h1 className="text-4xl font-bold text-[#1E293B] leading-tight">
                Simplifica tu monotributo
              </h1>
              <p className="text-xl text-[#6B7280] flex flex-col">
                Gestioná tu monotributo de forma digital y eficiente.{" "}
                <strong>Sin complicaciones.</strong>
              </p>
              <button className="group flex items-center gap-2 bg-[#0066FF] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#0066FF]/90 transition-all duration-300">
                Comenzar ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative">
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                {images.map((img, index) => (
                  <div
                    key={img}
                    className="absolute inset-0 w-full h-full transition-opacity duration-1000"
                    style={{
                      opacity: currentImage === index ? 1 : 0,
                      backgroundImage: `url(/assets${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 absolute -bottom-20 mx-4 w-[calc(100%-2rem)]">
                <div className="bg-white shadow-lg rounded-xl p-4">
                  <FileText className="w-6 h-6 text-[#0066FF] mb-2" />
                  <h3 className="text-[#1E293B] font-semibold text-sm">
                    Gestión Digital
                  </h3>
                  <p className="text-[#6B7280] text-xs">
                    Todo tu monotributo en un solo lugar
                  </p>
                </div>
                <div className="bg-white shadow-lg rounded-xl p-4">
                  <CreditCard className="w-6 h-6 text-[#0066FF] mb-2" />
                  <h3 className="text-[#1E293B] font-semibold text-sm">
                    Pagos Online
                  </h3>
                  <p className="text-[#6B7280] text-xs">
                    Paga tus impuestos de forma segura
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Botón Calcula tu categoría */}
        <div className="py-8 text-center mt-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/calcular-categoria")}
              className="inline-flex items-center gap-3 bg-[#0066FF] text-white px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-[#0066FF]/90 transition-colors shadow-lg"
            >
              <Calculator className="w-8 h-8" />
              Calculá tu categoría
            </motion.button>
          </motion.div>
        </div>

        {/* Servicios Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-10"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
                Nuestros Servicios
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                Todo lo que necesitas para gestionar tu monotributo de forma
                eficiente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <FileText className="w-12 h-12 text-[#0066FF] mb-4" />
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3">
                  Gestión Digital
                </h3>
                <p className="text-[#6B7280]">
                  Gestiona todos tus trámites de monotributo de forma digital y
                  sin complicaciones.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <CreditCard className="w-12 h-12 text-[#0066FF] mb-4" />
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3">
                  Pagos Online
                </h3>
                <p className="text-[#6B7280]">
                  Realiza tus pagos de forma segura y rápida a través de nuestra
                  plataforma.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <HelpCircle className="w-12 h-12 text-[#0066FF] mb-4" />
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3">
                  Asesoramiento
                </h3>
                <p className="text-[#6B7280]">
                  Recibe ayuda y asesoramiento personalizado para todas tus
                  dudas.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Asesoramiento Section */}
        <AdvisorySection />

        {/* Contacto Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-20 bg-gradient-to-br from-[#0066FF] to-[#1E293B] relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0066FF]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <h2 className="text-4xl font-bold text-white mb-4 relative">
                  ¡ CONTACTANOS !
                </h2>
              </motion.div>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Estamos aquí para ayudarte con cualquier duda que tengas
              </p>
            </div>

            <div className="max-w-2xl mx-auto relative">
              <form className="relative bg-gradient-to-br from-[#0066FF]/5 to-transparent rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="w-full px-4 py-3 rounded-lg bg-white border-none text-[#1E293B] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#E5F0FF] focus:border-transparent transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E5F0FF]/50 to-transparent" />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg bg-white border-none text-[#1E293B] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#E5F0FF] focus:border-transparent transition-all duration-300"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E5F0FF]/50 to-transparent" />
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    placeholder="Tu mensaje"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-white border-none text-[#1E293B] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#E5F0FF] focus:border-transparent transition-all duration-300"
                  ></textarea>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E5F0FF]/50 to-transparent" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E5F0FF] to-white text-[#0066FF] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl relative group overflow-hidden"
                >
                  <span className="relative z-10">Enviar mensaje</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-[#E5F0FF] transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
