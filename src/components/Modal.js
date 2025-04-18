import React from "react";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  const defaultActions = [
    { text: "Aceptar", onClick: onClose, style: "primary" },
  ];

  const modalActions = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            aria-label="Cerrar modal"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="text-gray-700 mb-6">{children}</div>
        <div className="flex justify-end gap-3 mt-6">
          {modalActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                action.style === "primary"
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
              }`}
            >
              {action.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
