import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ManageEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, event);
      setMessage("Event updated successfully!");
    } catch (err) {
      setError("Failed to update event. Try again.");
    }
  };

  const handleCancelEvent = async () => {
    if (!window.confirm("Are you sure you want to cancel this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event cancelled successfully.");
      navigate("/my-events");
    } catch (err) {
      setError("Failed to cancel event.");
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!event) return <p className="text-gray-400 text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-lg p-8 text-white mt-10">
      <h1 className="text-3xl font-bold mb-6 text-sky-400">Manage Event</h1>


      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-slate-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={event.title || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Description</label>
          <textarea
            name="description"
            value={event.description || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            rows={4}
            />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={event.startTime?.slice(0, 16) || ""}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={event.endTime?.slice(0, 16) || ""}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={event.venue.name || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
        </div>
        
        <div>
          <label className="block text-slate-300 mb-1">Capacity</label>
          <input
            type="text"
            name="capacity"
            value={event.capacity || ""}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="submit"
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
            Update Event
          </button>
          {message && <p className="text-green-400 mb-4">{message}</p>}

          <button
            type="button"
            onClick={handleCancelEvent}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
            Cancel Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageEventPage;
