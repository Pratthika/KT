const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/login', require('./routes/login'));
app.use('/profile', require('./routes/profile'));
app.use('/goods', require('./routes/goods'));
app.use('/rfq', require('./routes/rfq'));
app.use('/po', require('./routes/po'));
app.use('/invoice', require('./routes/invoice'));
app.use('/payage', require('./routes/payage'));
app.use('/memo', require('./routes/memo'));
app.use('/finance', require('./routes/finance'));

// Test route
app.get('/', (req, res) => {
  res.send('Vendor Portal Backend Running 🚀');
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});