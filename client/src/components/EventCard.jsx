import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapPin } from "lucide-react";

const EventCard = ({ event, user, bookings }) => {
  const { isBooked } = useAuth();

  const isBooked2 = isBooked(event._id);

  const daysleft = Math.ceil(
    (new Date(event.startTime) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/events/${event._id}`} className="block group">
      <div className="relative flex flex-col justify-between h-full bg-gradient-to-br from-black to-slate-700 border border-slate-600 rounded-2xl shadow-md group-hover:shadow-sky-500/30 group-hover:border-sky-600 transition-all duration-300 p-6 transform group-hover:-translate-y-1 group-hover:scale-[1.02]">
        <div>
          <h3 className="text-2xl font-extrabold text-sky-400 group-hover:text-sky-300 transition-colors duration-200 mb-3">
            {event.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-3 group-hover:text-slate-300 transition-colors duration-200">
            {event.description}
          </p>
          <p className="text-slate-400 text-sm line-clamp-3 group-hover:text-slate-300 transition-colors duration-200">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 shrink-0" />
              {event.venue.name}
            </span>
          </p>
        </div>

        <div className="mt-6 text-right">
          <p className="text-sky-500 text-xs group-hover:text-slate-300 transition-colors duration-200">
            {new Date(event.startTime).toLocaleDateString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className=" gap-2 bottom-3 left-4">
          {daysleft < 7 && !isBooked2 && (
            <div className="bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md w-fit">
              {`${daysleft} days left`}
            </div>
          )}
          {isBooked2 && (
            <div className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md w-fit">
              Booked
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
