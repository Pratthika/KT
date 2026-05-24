require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', require('./routes/login'));
app.use('/profile', require('./routes/profile'));
app.use('/leave', require('./routes/leave'));
app.use('/payslip', require('./routes/payslip'));
app.use('/payslippdf', require('./routes/payslippdf'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});