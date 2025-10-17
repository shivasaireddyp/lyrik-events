import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../services/api";
import { useParams } from "react-router-dom";

const CheckinPage = () => {
  const { id: eventId } = useParams();
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!isScanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { qrbox: { width: 300, height: 300 }, fps: 10 },
      false
    );

    const onScanSuccess = async (decodedText) => {
      if (isScanning) {
        setIsScanning(false);
        scanner.clear();

        try {
          const response = await api.post("/bookings/verify-qr", {
            qrCodeData: decodedText,
            eventId: eventId,
          });
          setResult({ message: response.data.message, type: "success" });
        } catch (err) {
          setResult({
            message: err.response?.data?.message || "Verification Failed",
            type: "error",
          });
        }
      }
    };

    const onScanFailure = () => {};
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Scanner clear failed", error));
    };
  }, [isScanning]);

  const handleRescan = () => {
    setResult(null);
    setIsScanning(true);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-900 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-6 text-center tracking-tight">
        Event Check-In
      </h1>
      <p className="text-slate-400 text-center mb-10 max-w-md">
        Please scan the attendee's QR code to verify their booking.
      </p>

      <div
        id="qr-reader"
        className={`relative p-4 rounded-2xl shadow-lg bg-slate-800 border-2 border-slate-700 transition-all duration-300 ${
          !isScanning ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      ></div>

      {/* overlay for result */}
      {result && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-opacity-90 backdrop-blur-sm transition-all duration-500 ${
            result.type === "success" ? "bg-green-500/90" : "bg-red-500/90"
          }`}
        >
          <div className="text-center text-white animate-pop">
            <p className="text-6xl mb-4">
              {result.type === "success" ? "✅" : "❌"}
            </p>
            <p className="text-3xl font-bold mb-2">
              {result.type === "success"
                ? "Check-in Successful!"
                : "Verification Failed"}
            </p>
            <p className="text-xl">{result.message}</p>
            <button
              onClick={handleRescan}
              className="mt-6 px-6 py-3 bg-white text-slate-800 font-semibold rounded-full hover:bg-slate-100 transition-all duration-300"
            >
              Rescan QR
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CheckinPage;
