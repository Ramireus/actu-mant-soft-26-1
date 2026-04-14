const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Session (simple memory store; replace for production)
app.use(session({
	name: 'pelucan.sid',
	secret: process.env.SESSION_SECRET || 'change_this_secret',
	resave: false,
	saveUninitialized: false,
	cookie: { secure: false, maxAge: 1000 * 60 * 60 }
}));

// Auth routes (login/logout)
app.use('/', authRoutes);

// Routes
app.use('/', appointmentRoutes);
app.use('/owners', ownerRoutes);
app.use('/pets', petRoutes);

module.exports = app;
