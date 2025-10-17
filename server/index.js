const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const venueRoutes = require('./routes/venueRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

dotenv.config();
connectDB();
const app = express();

const clientURL = process.env.FRONTEND_URL

app.use(cors({
  origin: clientURL,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/feedback', feedbackRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the College Fest API!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});