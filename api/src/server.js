require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/', require('./routes/screens.routes'));
app.use('/api/tickets', require('./routes/tickets.routes'));
app.use('/webhook', require('./routes/webhook.routes'));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API Server running on port ${PORT}`));

module.exports = app; // for testing