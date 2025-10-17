// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import QRCode from "react-qr-code";
// import ConfirmationModal from "../components/ConfirmationModal";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";


// const MyBookingsPage = () => {
//   const { bookings, loading, updateBookingStatus } = useAuth();
//   // const [bookings, setBookings] = useState([]);
//   // const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [visibleQrId, setVisibleQrId] = useState(null);
//   const [bookingToCancel, setBookingToCancel] = useState(null);

//   // useEffect(() => {
//   //   const fetchBookings = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const res = await api.get("/bookings/my-bookings");
//   //       setBookings(res.data);
//   //     } catch (err) {
//   //       setError("Failed to fetch bookings. Please try again.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchBookings();
//   // }, []);

//   const handleConfirmCancel = async () => {
//     if (!bookingToCancel) return;
//     try {
//       await api.put(`/bookings/${bookingToCancel._id}/cancel`);
//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === bookingToCancel._id ? { ...b, status: "cancelled" } : b
//         )
//       );
//     } catch (err) {
//       console.error("Failed to cancel booking:", err);
//     } finally {
//       setBookingToCancel(null);
//     }
//   };

//   const handleQrToggle = (id) => {
//     setVisibleQrId((prev) => (prev === id ? null : id));
//   };

//   const filteredBookings = bookings.filter((b) =>
//     activeFilter === "all" ? true : b.status === activeFilter
//   );

//   if (loading)
//     return <p className="text-white text-center mt-20 animate-pulse">Loading bookings...</p>;
//   if (error)
//     return <p className="text-red-500 text-center mt-20 font-semibold">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto text-white px-4 py-10">
//       <ConfirmationModal
//         isOpen={!!bookingToCancel}
//         onClose={() => setBookingToCancel(null)}
//         onConfirm={handleConfirmCancel}
//         title="Confirm Cancellation"
//         message={`Are you sure you want to cancel your booking for "${bookingToCancel?.event.title}"?`}
//       />

//       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
//         <h1 className="text-3xl sm:text-4xl font-extrabold">My Bookings</h1>
//         <div className="flex space-x-2 bg-slate-800/60 p-1 rounded-xl border border-slate-700">
//           {["all", "confirmed", "cancelled"].map((filter) => (
//             <button
//               key={filter}
//               onClick={() => setActiveFilter(filter)}
//               className={`px-4 py-2 text-sm font-semibold rounded-lg ${
//                 activeFilter === filter
//                   ? "bg-sky-500 text-white shadow-lg"
//                   : "text-slate-400 hover:bg-slate-700 hover:text-white"
//               }`}
//             >
//               {filter.charAt(0).toUpperCase() + filter.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {filteredBookings.length > 0 ? (
//         <div className="space-y-6">
//           {filteredBookings.map((booking) => (
//             <div
//               key={booking._id}
//               className="bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg p-6"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <Link
//                     to={`/events/${booking.event._id}`}
//                     className="text-2xl font-bold text-sky-400 hover:underline"
//                   >
//                     {booking.event.title}
//                   </Link>
//                   <p className="text-slate-400 text-sm">
//                     Booked on: {new Date(booking.createdAt).toLocaleString("en-IN")}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-4 py-1 text-sm font-semibold rounded-full ${
//                     booking.status === "confirmed"
//                       ? "bg-green-500/20 text-green-400"
//                       : "bg-red-500/20 text-red-400"
//                   }`}
//                 >
//                   {booking.status}
//                 </span>
//               </div>

//               <div className="mt-4 flex justify-end gap-3">
//                 {booking.status === "confirmed" && (
//                   <>
//                     <button
//                       onClick={() => handleQrToggle(booking._id)}
//                       className="bg-slate-700 hover:bg-slate-600 py-2 px-4 rounded-lg"
//                     >
//                       {visibleQrId === booking._id ? "Hide QR" : "Show QR"}
//                     </button>
//                     <button
//                       onClick={() => setBookingToCancel(booking)}
//                       className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 )}
//               </div>

//               {visibleQrId === booking._id && (
//                 <div className="mt-6 p-6 bg-white rounded-xl flex justify-center">
//                   <QRCode value={booking.qrCodeData} size={220} />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-slate-400 text-center py-10">
//           No {activeFilter !== "all" ? `${activeFilter} ` : ""}bookings found.
//         </p>
//       )}
//     </div>
//   );
// };

// export default MyBookingsPage;







import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

const MyBookingsPage = () => {
  // 1. Get bookings and loading state from the global context
  const { bookings, loading } = useAuth();

  // 2. Remove all state and logic related to cancellation
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleQrId, setVisibleQrId] = useState(null);

  const handleQrToggle = (id) => {
    setVisibleQrId((prev) => (prev === id ? null : id));
  };

  const filteredBookings = bookings.filter((b) =>
    activeFilter === "all" ? true : b.status === activeFilter
  );

  if (loading)
    return <p className="text-white text-center mt-20 animate-pulse">Loading bookings...</p>;

  return (
    <div className="max-w-4xl mx-auto text-white px-4 py-10">
      {/* 3. The ConfirmationModal is completely removed from this page */}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold">My Bookings</h1>
        <div className="flex space-x-2 bg-slate-800/60 p-1 rounded-xl border border-slate-700">
          {["all", "confirmed", "cancelled"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeFilter === filter
                  ? "bg-sky-500 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-slate-900/70 border border-slate-700 rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={`/events/${booking.event._id}`}
                    className="text-2xl font-bold text-sky-400 hover:underline"
                  >
                    {booking.event.title}
                  </Link>
                  <p className="text-slate-400 text-sm">
                    Booked on: {new Date(booking.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <span
                  className={`px-4 py-1 text-sm font-semibold rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {booking.status === "confirmed" && (
                  <>
                    <button
                      onClick={() => handleQrToggle(booking._id)}
                      className="bg-slate-700 hover:bg-slate-600 py-2 px-4 rounded-lg"
                    >
                      {visibleQrId === booking._id ? "Hide QR" : "Show QR"}
                    </button>
                    {/* 4. The "Cancel" button is now a Link to the event page */}
                    <Link
                      to={`/events/${booking.event._id}`}
                      className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-lg"
                    >
                      Manage
                    </Link>
                  </>
                )}
              </div>

              {visibleQrId === booking._id && (
                <div className="mt-6 p-6 bg-white rounded-xl flex justify-center">
                  <QRCode value={booking.qrCodeData} size={220} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-center py-10">
          No {activeFilter !== "all" ? `${activeFilter} ` : ""}bookings found.
        </p>
      )}
    </div>
  );
};

export default MyBookingsPage;