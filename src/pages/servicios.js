import { useState } from "react";
import Head from "next/head";
import PaymentSelector from "../components/PaymentSelector";

export default function Servicios() {
  const [selectedService, setSelectedService] = useState("alta");

  return (
    <>
      <Head>
        <title>Servicios - Monotributo Digital</title>
        <meta
          name="description"
          content="Servicios disponibles de Monotributo Digital"
        />
      </Head>

      <div className="min-h-screen bg-[#E5F0FF]">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Servicios
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Monotributo Digital
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Selecciona el servicio que necesitas para gestionar tu monotributo
              de forma sencilla y segura.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col space-y-6">
                <div className="bg-white shadow overflow-hidden rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Servicios de Pago Único
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Servicios que requieren un único pago
                    </p>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-5">
                      <div>
                        <label className="text-base font-medium text-gray-900">
                          Selecciona un servicio
                        </label>
                        <fieldset className="mt-4">
                          <div className="space-y-4">
                            <div className="flex items-center">
                              <input
                                id="alta"
                                name="service-type"
                                type="radio"
                                checked={selectedService === "alta"}
                                onChange={() => setSelectedService("alta")}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <label
                                htmlFor="alta"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Alta de Monotributo
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="recategorizacion"
                                name="service-type"
                                type="radio"
                                checked={selectedService === "recategorizacion"}
                                onChange={() =>
                                  setSelectedService("recategorizacion")
                                }
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <label
                                htmlFor="recategorizacion"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Recategorización
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="baja"
                                name="service-type"
                                type="radio"
                                checked={selectedService === "baja"}
                                onChange={() => setSelectedService("baja")}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <label
                                htmlFor="baja"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Baja de Monotributo
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="mensual"
                                name="service-type"
                                type="radio"
                                checked={selectedService === "mensual"}
                                onChange={() => setSelectedService("mensual")}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                              />
                              <label
                                htmlFor="mensual"
                                className="ml-3 block text-sm font-medium text-gray-700"
                              >
                                Servicio Mensual (Suscripción)
                              </label>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                </div>

                <PaymentSelector selectedService={selectedService} />
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información de MercadoPago
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Sobre nuestros métodos de pago
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Pagos Seguros
                      </h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Todos los pagos son procesados de forma segura a través
                        de MercadoPago, la plataforma líder en pagos en América
                        Latina.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Métodos de Pago Aceptados
                      </h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Aceptamos tarjetas de crédito y débito, transferencias
                        bancarias y otros métodos disponibles en MercadoPago.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900">
                        Facturación
                      </h4>
                      <p className="mt-2 text-sm text-gray-500">
                        Recibirás un comprobante por email de cada pago
                        realizado, además de la factura correspondiente a tu
                        servicio.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <img
                        src="/mercadopago-logo.png"
                        alt="MercadoPago"
                        className="h-8"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <div className="text-sm text-gray-500">
                        Sitio seguro, procesado por MercadoPago
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
