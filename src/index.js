const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// // ✅ Configure CORS
// const allowedOrigins = [
//   'https://facial-recog-poc-client-3-3720pi1tu-chethiyas-projects-5b0f6d7e.vercel.app',
//   'http://localhost:4200',
// ];

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
app.use('/api/visitors', require('./routes/visitor.routes'));

// ✅ Listen on all interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
