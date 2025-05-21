import React from "react";
import Link from "next/link";
import Head from "next/head";
import { CheckCircle, MessageSquare, Mail, Home } from "lucide-react";
import WhatsAppButton from "../../components/WhatsAppButton"; // Asumiendo que la ruta es correcta
import { motion } from "framer-motion";

export default function PaymentSuccess() {
  return (
    <>
      <Head>
        <title>Pago Exitoso - Tu Monotributo Digital</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-col justify-center items-center p-6 text-white">
        <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-xl p-8 md:p-12 max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 text-green-300 mx-auto bg-white rounded-full p-2" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Tu pago se procesó correctamente. Pronto serás contactado por
            nuestro equipo.
          </p>

          <div className="space-y-6 mb-10">
            <p className="text-md">
              Si tienes alguna consulta inmediata, puedes contactarnos por:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <WhatsAppButton />
              <Link
                href="/#contacto"
                className="flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 mr-2" /> Correo Electrónico
              </Link>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-xl hover:bg-gray-100 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
          >
            <Home className="w-5 h-5 mr-2" /> Volver al Inicio
          </Link>
        </div>
      </div>
    </>
  );
}

// Necesitamos importar motion para la animación, si no está ya global
// import { motion } from 'framer-motion';
// Si WhatsAppButton no está en esa ruta, ajustarla.
// Considera agregar el componente Layout si tienes uno para la navegación y el footer.
