function ConfirmModal({ isOpen, onClose, onConfirm, title, message,product  }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50 transform transition-all duration-300 scale-100">

        <h2 className="text-lg font-bold mb-3">
          {title || "Confirm Action"}
        </h2>

        <p className="text-gray-600 mb-6">
          {message || "Are you sure?"}  
            <span className="font-semibold text-red-600">
            {product?.name}
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmModal;