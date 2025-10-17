// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const CreateEventPage = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "Technical",
//     startTime: "",
//     endTime: "",
//     venue: "",
//     capacity: "",
//     deadline: "",
//   });

//   const [selectedDate, setSelectedDate] = useState("");
//   const [availableVenues, setAvailableVenues] = useState([]);
//   const [venueSchedule, setVenueSchedule] = useState(null);
//   const [selectedVenueCapacity, setSelectedVenueCapacity] = useState(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!selectedDate) {
//       setAvailableVenues([]);
//       setVenueSchedule(null);
//       return;
//     }
//     const fetchAvailability = async () => {
//       setLoading(true);
//       try {
//         const response = await api.get(
//           `/venues/availability?date=${selectedDate}`
//         );
//         setAvailableVenues(response.data);
//         if (
//           formData.venue &&
//           !response.data.find((v) => v._id === formData.venue)
//         ) {
//           setFormData((prev) => ({ ...prev, venue: "" }));
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch venue availability.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAvailability();
//   }, [selectedDate]);

//   useEffect(() => {
//     if (formData.venue) {
//       const selectedVenue = availableVenues.find(
//         (v) => v._id === formData.venue
//       );
//       setVenueSchedule(selectedVenue);
//       setSelectedVenueCapacity(selectedVenue?.capacity || null);
//     } else {
//       setVenueSchedule(null);
//       setSelectedVenueCapacity(null);
//     }
//   }, [formData.venue, availableVenues]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateChange = (e) => {
//     setSelectedDate(e.target.value);
//     setFormData((prev) => ({ ...prev, startTime: "", endTime: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.capacity || formData.capacity <= 0) {
//       setError("Please enter a valid, positive capacity.");
//       return;
//     }
//     if (selectedVenueCapacity && formData.capacity > selectedVenueCapacity) {
//       setError(
//         `Capacity cannot exceed the venue's maximum of ${selectedVenueCapacity}.`
//       );
//       return;
//     }

//     if (new Date(formData.deadline) >= new Date(formData.startTime)) {
//       setError("Registration deadline must be before the event start time.");
//       return;
//     }

//     if (new Date(formData.endTime) <= new Date(formData.startTime)) {
//       setError("End time must be after the start time.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await api.post("/events", {
//         ...formData,
//         date: selectedDate,
//       });
//       navigate(`/events/${response.data._id}`);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Failed to create event.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTomorrow = () => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow.toISOString().split("T")[0];
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 text-white">
//       <h1 className="text-4xl font-bold text-center mb-8">
//         Create a New Event
//       </h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
//       >
//         {error && <p className="bg-red-500 text-white p-3 rounded">{error}</p>}

//         {/*Select Date */}
//         <div className="bg-slate-900 p-4 rounded-lg">
//           <h2 className="text-xl font-semibold mb-3 text-sky-400">
//             Step 1: Choose Date
//           </h2>
//           <input
//             type="date"
//             min={getTomorrow()}
//             value={selectedDate}
//             onChange={handleDateChange}
//             required
//             className="w-full p-3 bg-slate-700 rounded"
//           />
//         </div>

//         {/*Select Venue */}
//         {selectedDate && (
//           <div className="bg-slate-900 p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-3 text-sky-400">
//               Step 2: Choose Venue
//             </h2>
//             {loading ? (
//               <p>Loading venues...</p>
//             ) : (
//               <>
//                 <select
//                   name="venue"
//                   value={formData.venue}
//                   onChange={handleChange}
//                   required
//                   className="w-full p-3 bg-slate-700 rounded"
//                 >
//                   <option value="">Select a venue</option>
//                   {availableVenues.map((v) => (
//                     <option key={v._id} value={v._id}>
//                       {v.name} (Capacity: {v.capacity})
//                     </option>
//                   ))}
//                 </select>

//                 {venueSchedule && (
//                   <div className="mt-4 bg-slate-800 p-3 rounded">
//                     <h3 className="text-sky-300 font-semibold mb-2">
//                       Venue Schedule:
//                     </h3>
//                     {venueSchedule.bookedSlots?.length > 0 ? (
//                       <ul className="text-sm text-slate-300">
//                         {venueSchedule.bookedSlots.map((slot, i) => (
//                           <li key={i}>
//                             {new Date(slot.startTime).toLocaleTimeString()} -{" "}
//                             {new Date(slot.endTime).toLocaleTimeString()}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-slate-400">
//                         No bookings for this day 🎉
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}

//         {/*Event Details */}
//         {formData.venue && (
//           <div className="bg-slate-900 p-4 rounded-lg">
//             <h2 className="text-xl font-semibold mb-3 text-sky-400">
//               Step 3: Fill Event Details
//             </h2>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="title"
//                 placeholder="Event Title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 bg-slate-700 rounded"
//               />
//               <textarea
//                 name="description"
//                 placeholder="Event Description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//                 rows="4"
//                 className="w-full p-3 bg-slate-700 rounded"
//               ></textarea>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full p-3 bg-slate-700 rounded"
//                 >
//                   <option>Technical</option>
//                   <option>Cultural</option>
//                   <option>Sports</option>
//                   <option>Workshop</option>
//                 </select>

//                 {/* Capacity Input */}
//                 <input
//                   type="number"
//                   name="capacity"
//                   placeholder={`Capacity (Max: ${
//                     selectedVenueCapacity || "..."
//                   })`}
//                   value={formData.capacity}
//                   onChange={handleChange}
//                   required
//                   min="1"
//                   max={selectedVenueCapacity || undefined}
//                   className="w-full p-3 bg-slate-700 rounded"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-slate-400 text-sm mb-1">
//                     Start Time
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="startTime"
//                     value={formData.startTime}
//                     onChange={handleChange}
//                     required
//                     min={`${selectedDate}T00:00`}
//                     max={`${selectedDate}T23:59`}
//                     className="w-full p-3 bg-slate-700 rounded"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-slate-400 text-sm mb-1">
//                     End Time
//                   </label>
//                   <input
//                     type="datetime-local"
//                     name="endTime"
//                     value={formData.endTime}
//                     onChange={handleChange}
//                     required
//                     min={formData.startTime || `${selectedDate}T00:00`}
//                     max={`${selectedDate}T23:59`}
//                     className="w-full p-3 bg-slate-700 rounded"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-slate-400 text-sm mb-1">
//                   Booking Deadline
//                 </label>
//                 <input
//                   type="datetime-local"
//                   name="deadline"
//                   value={formData.deadline}
//                   onChange={handleChange}
//                   required
//                   max={formData.startTime || undefined}
//                   // user can’t select before today
//                   min={`${selectedDate}T00:00`}
//                   className="w-full p-3 bg-slate-700 rounded"
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={loading || !formData.venue}
//           className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded transition disabled:bg-slate-600 disabled:cursor-not-allowed"
//         >
//           {loading ? "Creating..." : "Create Event"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateEventPage;




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    startTime: "",
    endTime: "",
    venue: "",
    capacity: "",
    deadline: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [availableVenues, setAvailableVenues] = useState([]);
  const [venueSchedule, setVenueSchedule] = useState(null);
  const [selectedVenueCapacity, setSelectedVenueCapacity] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch venue availability based on date
  useEffect(() => {
    if (!selectedDate) {
      setAvailableVenues([]);
      setVenueSchedule(null);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/venues/availability?date=${selectedDate}`);
        setAvailableVenues(response.data);

        // If previously selected venue is unavailable now, reset
        if (formData.venue && !response.data.find(v => v._id === formData.venue)) {
          setFormData(prev => ({ ...prev, venue: "" }));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch venue availability.");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [selectedDate]);

  // Update schedule and capacity when venue changes
  useEffect(() => {
    if (formData.venue) {
      const selectedVenue = availableVenues.find(v => v._id === formData.venue);
      setVenueSchedule(selectedVenue);
      setSelectedVenueCapacity(selectedVenue?.capacity || null);
    } else {
      setVenueSchedule(null);
      setSelectedVenueCapacity(null);
    }
  }, [formData.venue, availableVenues]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = e => {
    setSelectedDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      startTime: "",
      endTime: "",
      deadline: "",
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    // Basic checks
    if (!formData.capacity || formData.capacity <= 0) {
      setError("Please enter a valid, positive capacity.");
      return;
    }

    if (selectedVenueCapacity && formData.capacity > selectedVenueCapacity) {
      setError(`Capacity cannot exceed the venue's maximum of ${selectedVenueCapacity}.`);
      return;
    }

    if (!formData.startTime || !formData.endTime || !formData.deadline) {
      setError("Please select all time fields properly.");
      return;
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    const deadline = new Date(formData.deadline);

    if (end <= start) {
      setError("End time must be after the start time.");
      return;
    }

    if (deadline >= start) {
      setError("Registration deadline must be before the event start time.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/events", {
        ...formData,
        date: selectedDate,
      });
      navigate(`/events/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const getTomorrow = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        Create a New Event
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg shadow-lg space-y-6"
      >
        {error && <p className="bg-red-500 text-white p-3 rounded">{error}</p>}

        {/* Step 1: Choose Date */}
        <div className="bg-slate-900 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-sky-400">
            Step 1: Choose Date
          </h2>
          <input
            type="date"
            min={getTomorrow()}
            value={selectedDate}
            onChange={handleDateChange}
            required
            className="w-full p-3 bg-slate-700 rounded"
          />
        </div>

        {/* Step 2: Choose Venue */}
        {selectedDate && (
          <div className="bg-slate-900 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-sky-400">
              Step 2: Choose Venue
            </h2>
            {loading ? (
              <p>Loading venues...</p>
            ) : (
              <>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-700 rounded"
                >
                  <option value="">Select a venue</option>
                  {availableVenues.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.name} (Capacity: {v.capacity})
                    </option>
                  ))}
                </select>

                {venueSchedule && (
                  <div className="mt-4 bg-slate-800 p-3 rounded">
                    <h3 className="text-sky-300 font-semibold mb-2">
                      Venue Schedule:
                    </h3>
                    {venueSchedule.bookedSlots?.length > 0 ? (
                      <ul className="text-sm text-slate-300">
                        {venueSchedule.bookedSlots.map((slot, i) => (
                          <li key={i}>
                            {new Date(slot.startTime).toLocaleTimeString()} -{" "}
                            {new Date(slot.endTime).toLocaleTimeString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400">
                        No bookings for this day 🎉
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 3: Fill Event Details */}
        {formData.venue && (
          <div className="bg-slate-900 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3 text-sky-400">
              Step 3: Fill Event Details
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 bg-slate-700 rounded"
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 bg-slate-700 rounded"
              ></textarea>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-700 rounded"
                >
                  <option>Technical</option>
                  <option>Cultural</option>
                  <option>Sports</option>
                  <option>Workshop</option>
                </select>

                <input
                  type="number"
                  name="capacity"
                  placeholder={`Capacity (Max: ${selectedVenueCapacity || "..."})`}
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  max={selectedVenueCapacity || undefined}
                  className="w-full p-3 bg-slate-700 rounded"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    min={selectedDate ? `${selectedDate}T00:00` : undefined}
                    max={selectedDate ? `${selectedDate}T23:59` : undefined}
                    className="w-full p-3 bg-slate-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    min={formData.startTime || `${selectedDate}T00:00`}
                    max={selectedDate ? `${selectedDate}T23:59` : undefined}
                    className="w-full p-3 bg-slate-700 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  Booking Deadline
                </label>
                <input
                  type="datetime-local"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                  min={selectedDate ? `${selectedDate}T00:00` : undefined}
                  max={`${selectedDate}T00:00` || undefined}
                  className="w-full p-3 bg-slate-700 rounded"
                />
                <p className="text-slate-400 text-sm mt-1">
                  Registrations close before the event starts.
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.venue}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded transition disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
