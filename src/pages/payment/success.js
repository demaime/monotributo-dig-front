import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#E5F0FF] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-[#6B7280] mb-8">
          Tu registro se ha completado y tu pago ha sido procesado
          correctamente. Recibirás un correo electrónico con los detalles de tu
          trámite en breve.
        </p>
        <p className="text-sm text-[#6B7280]">
          Serás redirigido al inicio en unos segundos...
        </p>
      </motion.div>
    </div>
  );
}
