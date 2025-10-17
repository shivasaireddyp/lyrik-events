const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl text-white max-w-sm mx-auto">
        <h2 className="text-2xl font-bold mb-4">Are you sure?</h2>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Go Back
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
