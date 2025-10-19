const ServicesPage = () => {
  return (
    <div className="max-w-4xl mx-auto text-white px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center text-sky-400">Our Features</h1>
      <div className="space-y-8">
        {/* Section for Users */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-3 text-green-400">For Attendees</h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Discover all campus events in one place.</li>
            {/* <li>Filter events by category, date, or venue.</li> */}
            <li>Book tickets securely and instantly.</li>
            <li>Get QR code tickets directly in your profile.</li>
            <li>Add event reminders to your Google Calendar with one click.</li>
            <li>Cancel bookings easily if your plans change.</li>
            <li>Provide feedback on events you've attended.</li>
          </ul>
        </div>

        {/* Section for Organizers */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-400">For Organizers</h2>
          <ul className="list-disc list-inside text-slate-300 space-y-2">
            <li>Create and manage your events with ease.</li>
            <li>Select venues and view real-time availability.</li>
            <li>Set custom event capacities (validated against venue limits).</li>
            <li>Recruit and manage volunteers for your events (coming real soon!).</li>
            <li>Scan QR codes at the venue for seamless check-in.</li>
            <li>View live analytics: track registrations and check-ins.</li>
            <li>Get feedback directly from attendees.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;