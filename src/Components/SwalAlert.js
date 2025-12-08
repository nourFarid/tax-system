// src/Components/SwalAlert.js
import React from "react";

const CustomSwal = ({
  isOpen,
  type = "success",
  title,
  message,
  confirmText = "OK",
  showCancelButton = false,
  cancelText = "Cancel",
  onClose,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    if (onClose) onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
  <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-lg pointer-events-auto">
    <h3 className={`text-lg font-bold mb-2 ${type === "error" ? "text-red-600" : "text-green-600"}`}>
      {title}
    </h3>
    <p className="mb-4">{message}</p>
    <div className="flex justify-end gap-2">
      {showCancelButton && (
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={handleCancel}
        >
          {cancelText}
        </button>
      )}
      <button
        className={`px-4 py-2 rounded ${type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
        onClick={handleConfirm}
      >
        {confirmText}
      </button>
    </div>
  </div>
</div>

  );
};

export default CustomSwal;
