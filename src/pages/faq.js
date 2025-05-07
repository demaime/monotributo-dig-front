import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("servicios");
  const [searchTerm, setSearchTerm] = useState("");
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = [
    { id: "servicios", name: "Servicios y Planes" },
    { id: "pagos", name: "Pagos y Facturación" },
    { id: "monotributo", name: "Monotributo" },
    { id: "cuenta", name: "Mi Cuenta" },
  ];

  const questionsData = [
    {
      id: 1,
      category: "servicios",
      question: "¿Cuáles son los planes disponibles?",
      answer: (
        <div className="space-y-3">
          <p>Ofrecemos los siguientes planes semestrales:</p>
          <ul className="space-y-3">
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Plan Base ($150.000/semestre):
              </span>{" "}
              Incluye alta de monotributo, 4 consultas profesionales mensuales
              con contador matriculado y recategorización semestral.
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Plan Full ($180.000/semestre):
              </span>{" "}
              Incluye alta de monotributo, recategorización, 8 consultas
              profesionales mensuales con contador matriculado y emisión de 4
              facturas mensuales.
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Plan Premium ($240.000/semestre):
              </span>{" "}
              Incluye alta de monotributo, recategorización, consultas mensuales
              ilimitadas con contador matriculado y emisión de hasta 10 facturas
              mensuales.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 2,
      category: "servicios",
      question: "¿Cuánto cuestan los servicios individuales?",
      answer: (
        <div className="space-y-3">
          <ul className="space-y-3">
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Alta de Monotributo:
              </span>{" "}
              $75.000
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Baja de Monotributo:
              </span>{" "}
              $75.000
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Recategorización:
              </span>{" "}
              $50.000
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              <span className="font-semibold text-blue-700">
                Factura Adicional:
              </span>{" "}
              $2.000 cada una (para planes que ya completaron su cupo mensual)
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 3,
      category: "servicios",
      question: "¿Los planes tienen un período mínimo?",
      answer: (
        <p>
          Sí, todos nuestros planes se contratan por semestre. La facturación se
          realiza cada 6 meses.
        </p>
      ),
    },
    {
      id: 4,
      category: "pagos",
      question: "¿Cómo se pagan los servicios?",
      answer: (
        <div className="space-y-3">
          <p>
            Todos nuestros servicios se pueden pagar a través de MercadoPago,
            que ofrece múltiples opciones como tarjetas de crédito y débito,
            transferencias bancarias y otros métodos disponibles en la
            plataforma.
          </p>
          <p>
            Para los planes de suscripción, el pago se procesa automáticamente
            cada seis meses mediante el método de pago que hayas seleccionado al
            suscribirte.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      category: "pagos",
      question: "¿Emiten factura por los servicios?",
      answer: (
        <p>
          Sí, emitimos factura electrónica por todos los servicios contratados.
        </p>
      ),
    },
    {
      id: 6,
      category: "monotributo",
      question:
        "¿Qué documentación necesito para darme de alta en monotributo?",
      answer: (
        <div className="space-y-3">
          <p>Para darte de alta en monotributo necesitas:</p>
          <ul className="space-y-3">
            <li className="pl-4 border-l-2 border-blue-500">
              DNI (frente y dorso)
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              Clave fiscal (nivel 2 o superior)
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              Datos de domicilio fiscal
            </li>
            <li className="pl-4 border-l-2 border-blue-500">
              Información sobre tu actividad económica
            </li>
          </ul>
          <p>
            Nuestro equipo te guiará en todo el proceso para que no tengas que
            preocuparte.
          </p>
        </div>
      ),
    },
    {
      id: 7,
      category: "monotributo",
      question: "¿Cuánto tiempo tarda el trámite de alta?",
      answer: (
        <p>
          Una vez que nos envías toda la documentación requerida, el trámite de
          alta en monotributo suele completarse en 24-48 horas hábiles.
        </p>
      ),
    },
    {
      id: 8,
      category: "cuenta",
      question: "¿Cómo puedo cancelar mi suscripción?",
      answer: (
        <p>
          Puedes cancelar tu suscripción en cualquier momento desde la sección
          "Mi Cuenta" o contactándonos directamente por WhatsApp o correo
          electrónico. La cancelación se hará efectiva al finalizar el período
          ya pagado.
        </p>
      ),
    },
    {
      id: 9,
      category: "cuenta",
      question: "¿Puedo cambiar de plan?",
      answer: (
        <p>
          Sí, puedes cambiar de plan en cualquier momento. Si cambias a un plan
          superior, se aplicará un prorrateo por el tiempo restante de tu
          suscripción actual. Si cambias a un plan inferior, el cambio se
          aplicará en la próxima renovación.
        </p>
      ),
    },
  ];

  const filteredQuestions = questionsData.filter(
    (q) =>
      (activeCategory === "todos" || q.category === activeCategory) &&
      (q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof q.answer === "string" &&
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleToggleQuestion = (id) => {
    setOpenQuestion(openQuestion === id ? null : id);
  };

  return (
    <>
      <Head>
        <title>Preguntas Frecuentes - Monotributo Digital</title>
        <meta
          name="description"
          content="Respuestas a las consultas más comunes sobre nuestros servicios de gestión de monotributo"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-[#E5F0FF] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-3">
              Preguntas Frecuentes
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Respuestas a las consultas más comunes sobre nuestros servicios
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="Buscar pregunta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === "todos"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveCategory("todos")}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Questions */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  No se encontraron preguntas para tu búsqueda.
                </p>
                <button
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center mx-auto"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("todos");
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ver todas las preguntas
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => handleToggleQuestion(item.id)}
                      className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.question}
                      </h3>
                      <div
                        className={`ml-2 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                          openQuestion === item.id
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        {openQuestion === item.id ? (
                          <ChevronUp
                            className={`h-5 w-5 ${
                              openQuestion === item.id
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence>
                      {openQuestion === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-5 text-gray-600">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-gray-600 mb-6">
              Nuestro equipo está listo para ayudarte con cualquier consulta
              adicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <span className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contactanos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
              <Link href="/">
                <span className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Volver al inicio
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
