const express = require('express');
const router = express.Router();
const axios = require('axios');

const SAP_URL = process.env.SAP_URL;

// Helper for leading zeros
function padVendorId(vendorId) {
  return vendorId.padStart(10, '0');
}

// GET /rfq?vendorId=1000
router.get('/', async (req, res) => {
  const { vendorId } = req.query;

  try {
    let url;

    if (vendorId) {
      const formattedId = padVendorId(vendorId);

      url = `${SAP_URL}/ZET_VP_MEMO_ODSet?$filter=Lifnr eq '${formattedId}'`;
    } else {
      url = `${SAP_URL}/ZET_VP_MEMO_ODSet`;
    }

    const response = await axios.get(url, {
      auth: {
        username: process.env.SAP_USER,
        password: process.env.SAP_PASSWORD
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    res.json(response.data);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to fetch RFQ data');
  }
});

module.exports = router;