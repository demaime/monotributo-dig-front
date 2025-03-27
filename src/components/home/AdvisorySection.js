import React, { useState } from "react";
import { FileText, CheckCircle2, CreditCard, Key } from "lucide-react";
import Modal from "../ui/Modal";

const advisoryCards = [
  {
    title: "¿Qué es el Monotributo?",
    shortDescription:
      "El Monotributo es un régimen simplificado para pequeños contribuyentes que permite regularizar tu actividad comercial, profesional o de servicios...",
    fullDescription: (
      <div className="space-y-4">
        <p>
          El Monotributo es un régimen simplificado para pequeños contribuyentes
          que permite regularizar tu actividad comercial, profesional o de
          servicios. Es ideal para emprendedores y pequeños negocios.
        </p>
        <p>Este régimen especial de tributación simplificada incluye:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Un componente impositivo (IVA e Impuesto a las Ganancias)</li>
          <li>
            Un componente previsional (aportes jubilatorios y obra social)
          </li>
          <li>Un componente de Ingresos Brutos</li>
        </ul>
        <p>
          La ventaja principal es que todos estos componentes se pagan en una
          única cuota mensual, simplificando significativamente la gestión
          tributaria.
        </p>
      </div>
    ),
    icon: FileText,
  },
  {
    title: "Requisitos para inscribirme",
    shortDescription:
      "Para inscribirte en el Monotributo necesitas: ser mayor de 18 años, tener un domicilio fiscal, no superar los límites de facturación...",
    fullDescription: (
      <div className="space-y-4">
        <p>
          Para inscribirte en el Monotributo necesitas cumplir con los
          siguientes requisitos:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Ser mayor de 18 años</li>
          <li>Tener un domicilio fiscal</li>
          <li>No superar los límites de facturación establecidos</li>
          <li>Cumplir con los requisitos específicos de tu actividad</li>
          <li>No ser titular de otros regímenes impositivos</li>
          <li>No ser empleador (con algunas excepciones)</li>
        </ul>
        <p>
          Es importante destacar que los límites de facturación se actualizan
          periódicamente por la AFIP, por lo que es fundamental mantenerse
          informado sobre los valores vigentes.
        </p>
      </div>
    ),
    icon: CheckCircle2,
  },
  {
    title: "¿Debo pagar Ingresos Brutos?",
    shortDescription:
      "El Monotributo incluye el pago de Ingresos Brutos. Es un componente del monotributo que se paga mensualmente junto con el componente impositivo...",
    fullDescription: (
      <div className="space-y-4">
        <p>
          El Monotributo incluye el pago de Ingresos Brutos como parte de su
          composición. Este componente se paga mensualmente junto con el
          componente impositivo y previsional.
        </p>
        <p>
          Características importantes sobre el componente de Ingresos Brutos:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Se encuentra incluido en la cuota mensual del monotributo</li>
          <li>No requiere declaración jurada adicional</li>
          <li>El monto varía según la categoría del monotributo</li>
          <li>Se actualiza automáticamente cuando cambia la categoría</li>
        </ul>
        <p>
          Esta inclusión en el monotributo simplifica significativamente la
          gestión tributaria, ya que no necesitas realizar trámites adicionales
          para el pago de Ingresos Brutos.
        </p>
      </div>
    ),
    icon: CreditCard,
  },
  {
    title: "CUIT y Clave Fiscal",
    shortDescription:
      "El CUIT y la Clave Fiscal son esenciales. El CUIT lo obtienes al inscribirte en AFIP, y la Clave Fiscal es tu contraseña para acceder a los servicios online...",
    fullDescription: (
      <div className="space-y-4">
        <p>
          El CUIT (Código Único de Identificación Tributaria) y la Clave Fiscal
          son elementos fundamentales para cualquier contribuyente. Te
          explicamos cómo obtenerlos:
        </p>
        <h3 className="text-xl font-semibold text-white mt-6">
          Obtención del CUIT:
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Inscríbete en AFIP a través de su sitio web</li>
          <li>Presenta la documentación requerida</li>
          <li>El CUIT se te asignará automáticamente</li>
          <li>Recibirás el comprobante por correo electrónico</li>
        </ul>
        <h3 className="text-xl font-semibold text-white mt-6">
          Obtención de la Clave Fiscal:
        </h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Regístrate en el sistema de AFIP</li>
          <li>Elige una clave segura</li>
          <li>Configura preguntas de seguridad</li>
          <li>Activa la autenticación de dos factores (recomendado)</li>
        </ul>
        <p className="mt-4">
          Te guiamos paso a paso en todo el proceso de obtención de estos
          elementos esenciales para tu actividad comercial.
        </p>
      </div>
    ),
    icon: Key,
  },
];

const AdvisorySection = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Asesorate sobre el Monotributo
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más frecuentes sobre el
            Monotributo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisoryCards.map((card, index) => (
            <div
              key={index}
              onClick={() => setSelectedCard(card)}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              <card.icon className="w-12 h-12 text-[#43d685] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-white/70">{card.shortDescription}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title}
      >
        {selectedCard?.fullDescription}
      </Modal>
    </section>
  );
};

export default AdvisorySection;
