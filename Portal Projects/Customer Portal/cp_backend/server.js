require('dotenv').config();
const express = require('express');
const cors = require('cors');


// Import Routes
const dashboardRoute = require('./routes/dashboard');
const profileRoute = require('./routes/profile'); // You'll add these later
const financeRoute = require('./routes/finance');
const loginRoute = require('./routes/login');
const invoiceRoute = require('./routes/invoice');

const app = express();
app.use(express.json());
app.use(cors());

// Home route
app.get('/', (req, res) => {
  res.send('Customer Portal Backend Running 🚀');
});

// Use Routes
// This means every route in dashboard.js starts with /api/dashboard
app.use('/api/dashboard', dashboardRoute);
app.use('/api/profile', profileRoute);
app.use('/api/finance', financeRoute);
app.use('/api/login', loginRoute);
app.use('/api/invoice', invoiceRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});