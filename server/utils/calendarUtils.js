/**
 * Formats a JavaScript Date object into the UTC format required by Google Calendar.
 * Example: 20251028T100000Z
 * @param {Date} date
 * @returns {string} 
 */
const formatGoogleCalendarDate = (date) => {
  // toISOString() returns 'YYYY-MM-DDTHH:mm:ss.sssZ'
  // We need to remove hyphens, colons, and milliseconds.
  return date.toISOString().replace(/-|:|\.\d{3}/g, '');
};

/**
 * Generates a Google Calendar link for an event.
 * @param {object} event - The event object from your database.
 * @returns {string} The full Google Calendar URL.
 */
const generateGoogleCalendarLink = (event) => {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';

  const title = encodeURIComponent(event.title);
  const startTime = formatGoogleCalendarDate(new Date(event.startTime));
  const endTime = formatGoogleCalendarDate(new Date(event.endTime));
  const details = encodeURIComponent(event.description);
  const location = encodeURIComponent(event.venue.name);

  const calendarUrl = `${baseUrl}&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

  return calendarUrl;
};

module.exports = { generateGoogleCalendarLink };