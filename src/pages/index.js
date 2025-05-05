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
import WhatsAppButton from "../components/WhatsAppButton";
import Link from "next/link";

function App() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const images = ["/1.jpg", "/2.jpeg", "/3.jpeg", "/4.jpeg"];

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    const offset = 100; // Offset de 100px para compensar la navegación
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

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

      {/* Navigation - Make it fixed */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 py-4">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-between items-center">
            <div className="text-[#1E293B] font-bold text-2xl flex items-center gap-2">
              <BarChart2 className="w-8 h-8 text-[#0066FF]" />
              Monotributo Digital
            </div>
            <div className="flex gap-6">
              <a
                href="#servicios"
                onClick={(e) => scrollToSection(e, "servicios")}
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Servicios
              </a>
              <a
                href="#asesorate"
                onClick={(e) => scrollToSection(e, "asesorate")}
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Información
              </a>
              <a
                href="#contacto"
                onClick={(e) => scrollToSection(e, "contacto")}
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Contacto
              </a>
              <Link
                href="/faq"
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                Preguntas Frecuentes
              </Link>
            </div>
          </nav>

          {/* Mobile Navigation */}
          <nav className="lg:hidden flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-[#0066FF]"
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
                  className="flex-col gap-4 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl p-8 mb-8 absolute top-20 left-4 right-4 z-50 border border-[#E5F0FF]"
                >
                  <motion.a
                    whileHover={{ x: 10, backgroundColor: "#E5F0FF" }}
                    href="#asesorate"
                    onClick={(e) => scrollToSection(e, "asesorate")}
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-3 px-4 block rounded-xl transition-all duration-300"
                  >
                    Información
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 10, backgroundColor: "#E5F0FF" }}
                    href="#servicios"
                    onClick={(e) => scrollToSection(e, "servicios")}
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-3 px-4 block rounded-xl transition-all duration-300"
                  >
                    Servicios
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 10, backgroundColor: "#E5F0FF" }}
                    href="#contacto"
                    onClick={(e) => scrollToSection(e, "contacto")}
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-3 px-4 block rounded-xl transition-all duration-300"
                  >
                    Contacto
                  </motion.a>
                  <Link
                    href="/faq"
                    className="text-[#6B7280] hover:text-[#1E293B] text-lg py-3 px-4 block rounded-xl transition-all duration-300"
                    style={{
                      display: "block",
                      transformOrigin: "left center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(10px)";
                      e.currentTarget.style.backgroundColor = "#E5F0FF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    Preguntas Frecuentes
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>

      {/* Content container - Add padding top to account for fixed nav */}
      <div className="relative z-10 pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pb-10">
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
                onClick={() => router.push("/registro?servicio=plan_base")}
                className="group flex items-center gap-3 bg-gradient-to-r from-[#0066FF] to-[#0040FF] text-white px-12 py-6 rounded-full font-bold text-3xl hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all duration-300 shadow-lg"
              >
                DATE DE ALTA
                <ArrowRight className="w-8 h-8 inline-block group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative lg:col-span-2"
            >
              <div
                className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#E5F0FF] to-[#F8FAFC]"
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/registro?servicio=plan_base")}
                className="group flex items-center justify-center w-full bg-gradient-to-r from-[#0066FF] to-[#0040FF] text-white px-8 py-6 rounded-full font-bold text-2xl hover:shadow-[0_0_30px_rgba(0,102,255,0.3)] transition-all duration-300 shadow-lg"
              >
                DATE DE ALTA
                <ArrowRight className="w-6 h-6 hidden md:inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
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
              className="inline-flex items-center gap-3 bg-white text-[#0066FF] border-2 border-[#0066FF] px-10 py-5 rounded-2xl font-semibold text-xl hover:bg-[#E5F0FF] transition-colors"
            >
              <Calculator className="w-7 h-7" />
              Calculá tu categoría
            </motion.button>
          </motion.div>
        </div>

        {/* Servicios Section */}
        <motion.div
          id="servicios"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-5"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1E293B] mb-4">
                Planes y Precios
              </h2>
              <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
                Elegí el plan que mejor se adapte a tus necesidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan Base */}
              <motion.div
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 40px rgba(0, 102, 255, 0.15)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 flex flex-col cursor-pointer"
              >
                <div className="bg-blue-600 py-6 px-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Plan Base</h3>
                  <p className="opacity-90 text-sm">
                    Para emprendedores que inician su actividad
                  </p>
                </div>
                <div className="p-6 flex-grow">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-900">$25.000</p>
                    <p className="text-gray-500 text-sm">por mes</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Alta de monotributo incluida
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        4 consultas profesionales mensuales
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Recategorización semestral
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Asistencia vía email
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => router.push("/registro?servicio=plan_base")}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    Comenzar
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    * Compromiso mínimo de 6 meses
                  </p>
                </div>
              </motion.div>

              {/* Plan Full */}
              <motion.div
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 40px rgba(0, 102, 255, 0.15)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow-xl rounded-xl overflow-hidden border border-blue-100 flex flex-col relative z-10 transform md:scale-105 cursor-pointer"
              >
                <div className="bg-blue-700 py-6 px-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Plan Full</h3>
                  <p className="opacity-90 text-sm">
                    Para profesionales y comercios establecidos
                  </p>
                </div>
                <div className="p-6 flex-grow">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-900">$30.000</p>
                    <p className="text-gray-500 text-sm">por mes</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Alta de monotributo incluida
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        8 consultas profesionales mensuales
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Recategorización incluida
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Emisión de 4 facturas mensuales
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Asistencia prioritaria
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() => router.push("/registro?servicio=plan_full")}
                    className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg transition-colors shadow-lg text-center"
                  >
                    Comenzar
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    * Compromiso mínimo de 6 meses
                  </p>
                </div>
              </motion.div>

              {/* Plan Premium */}
              <motion.div
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 40px rgba(0, 102, 255, 0.15)",
                }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow-lg rounded-xl overflow-hidden border border-blue-100 flex flex-col cursor-pointer"
              >
                <div className="bg-indigo-800 py-6 px-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Plan Premium</h3>
                  <p className="opacity-90 text-sm">
                    Para negocios con altas necesidades
                  </p>
                </div>
                <div className="p-6 flex-grow">
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-gray-900">$40.000</p>
                    <p className="text-gray-500 text-sm">por mes</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Alta de monotributo incluida
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Consultas ilimitadas con contador
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Recategorización incluida
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Emisión de hasta 10 facturas mensuales
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Soporte prioritario 24/7
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <button
                    onClick={() =>
                      router.push("/registro?servicio=plan_premium")
                    }
                    className="w-full py-3 px-4 bg-indigo-800 hover:bg-indigo-900 text-white font-medium rounded-lg transition-colors text-center"
                  >
                    Comenzar
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    * Compromiso mínimo de 6 meses
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Otros Servicios Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#1E293B] mb-3">
                Otros Servicios
              </h2>
              <p className="text-md text-[#6B7280] max-w-xl mx-auto">
                También ofrecemos servicios individuales para tus necesidades
                específicas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Card Alta */}
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
                }}
                onClick={() => router.push("/registro?servicio=alta")}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
              >
                <FileText className="w-10 h-10 text-[#0066FF] mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                  Alta de Monotributo
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Iniciá tu actividad con nosotros.
                </p>
                <span className="text-blue-600 font-medium text-sm hover:underline">
                  Solicitar por $75.000
                </span>
              </motion.div>

              {/* Card Baja */}
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
                }}
                onClick={() => router.push("/registro?servicio=baja")}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
              >
                <CreditCard className="w-10 h-10 text-[#0066FF] mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                  Baja de Monotributo
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Te ayudamos a dar de baja tu monotributo.
                </p>
                <span className="text-blue-600 font-medium text-sm hover:underline">
                  Solicitar por $75.000
                </span>
              </motion.div>

              {/* Card Recategorización */}
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
                }}
                onClick={() =>
                  router.push("/registro?servicio=recategorizacion")
                }
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-300 cursor-pointer text-center"
              >
                <HelpCircle className="w-10 h-10 text-[#0066FF] mb-4 mx-auto" />
                <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                  Recategorización
                </h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Ajustamos tu categoría según tus ingresos.
                </p>
                <span className="text-blue-600 font-medium text-sm hover:underline">
                  Solicitar por $50.000
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Asesoramiento Section */}
        <motion.div
          id="asesorate"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 bg-[#E5F0FF]"
        >
          <AdvisorySection />
        </motion.div>

        {/* Contacto Section */}
        <motion.div
          id="contacto"
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

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
