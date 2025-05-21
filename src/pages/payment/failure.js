import React from "react";
import Link from "next/link";
import Head from "next/head";
import { XCircle, AlertTriangle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentFailure() {
  return (
    <>
      <Head>
        <title>Error en el Pago - Tu Monotributo Digital</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-yellow-500 flex flex-col justify-center items-center p-6 text-white">
        <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-xl p-8 md:p-12 max-w-lg w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
            className="mb-6"
          >
            <XCircle className="w-20 h-20 text-red-300 mx-auto bg-white rounded-full p-2" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <AlertTriangle className="inline-block w-10 h-10 mr-2 -mt-1" />{" "}
            Ups... Algo salió mal
          </h1>
          <p className="text-lg md:text-xl mb-10">
            El proceso no pudo ser completado y el pago no fue procesado. Por
            favor, intenta nuevamente.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-lg shadow-xl hover:bg-gray-100 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
          >
            <Home className="w-5 h-5 mr-2" /> Volver al Inicio
          </Link>
        </div>
      </div>
    </>
  );
}
