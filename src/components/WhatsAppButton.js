import React from "react";
import { motion } from "framer-motion";

const WhatsAppButton = ({ phoneNumber = "549111234567" }) => {
  // Placeholder number
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-300 z-50 flex items-center justify-center"
      aria-label="Chatea con nosotros en WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{
        scale: 1.1,
        rotate: [0, 2, -2, 2, 0],
        transition: {
          rotate: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
        },
      }}
    >
      <img src="/assets/WhatsApp.svg" alt="WhatsApp Icon" className="w-6 h-6" />
    </motion.a>
  );
};

export default WhatsAppButton;
