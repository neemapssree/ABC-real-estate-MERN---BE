// app.js
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const paymentRouter = require('./routes/paymentRouter');
const stripeWebHook = require('./controllers/stripeWebhook');

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS (adjust origins as needed)
app.use(cors({
  origin: ['https://abc-real-estate-mern-fe.vercel.app/', 'http://localhost:3000']
}));

// Logging and parsing
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from React build
app.use(express.static(path.join(__dirname, './build')));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', usersRouter);
app.use('/admin', adminRouter);
app.use('/payment', paymentRouter);
app.use('/webhook', stripeWebHook);

// Catch 404 and forward to error handler (JSON)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler (JSON)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
