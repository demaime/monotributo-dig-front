import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1E293B]/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-8 mx-4 shadow-xl"
          >
            <div className="flex justify-between items-start mb-6 sticky top-0 py-2 -mt-2 -mx-2 px-2 rounded-t-xl bg-white">
              <h2 className="text-2xl font-bold text-[#1E293B]">{title}</h2>
              <button
                onClick={onClose}
                className="text-[#6B7280] hover:text-[#1E293B] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-[#6B7280] space-y-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
