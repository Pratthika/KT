const express = require('express');
const router = express.Router();
const axios = require('axios');

const SAP_URL = process.env.SAP_URL;

router.get('/', async (req, res) => {
  const { vendorId, password } = req.query;

  try {
    const response = await axios.get(
      `${SAP_URL}/ZET_VP_LOGIN_ODSet(Lifnr='${vendorId}',Password='${password}')`,
      {
        // Add this block
        auth: {
          username: process.env.SAP_USER, // Add these to your .env file
          password: process.env.SAP_PASSWORD
        },
        headers: {
          'Accept': 'application/json',
          'x-csrf-token': 'fetch' // Often required by SAP
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Login failed');
  }
});

module.exports = router;   // 🔥 THIS LINE IS CRITICAL