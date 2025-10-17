import QRCode from "react-qr-code";

const QrCodeModal = ({ qrCodeData, onClose }) => {
  if (!qrCodeData) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Your Event Ticket
        </h2>
        <div className="p-4 border rounded-lg inline-block">
          <QRCode
            value={qrCodeData}
            size={256}
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
        <p className="text-slate-600 mt-4">
          Present this QR code at the venue for check-in.
        </p>
        <button
          onClick={onClose}
          className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QrCodeModal;
