const express = require('express');
const router = express.Router();
const axios = require('axios');

const SAP_URL = process.env.SAP_URL;

// helper for leading zeros
function padVendorId(vendorId) {
  return vendorId.padStart(10, '0');
}

// GET /invoice?belnr=90000001&vendorId=100000
router.get('/', async (req, res) => {
  const { belnr, vendorId } = req.query;

  try {
    if (!belnr || !vendorId) {
      return res.status(400).send('belnr and vendorId are required');
    }

    const formattedVendor = padVendorId(vendorId);

    const url = `${SAP_URL}/ZET_VP_INVF_ODSet(Belnr='${belnr}',Lifnr='${formattedVendor}')`;

    const response = await axios.get(url, {
      auth: {
        username: process.env.SAP_USER,
        password: process.env.SAP_PASSWORD
      },
      headers: {
        'Accept': 'application/json'
      }
    });

    const pdfBase64 = response.data.d.PdfOutput;
    // Add this before the Buffer.from line
//console.log('SAP Response Data:', JSON.stringify(response.data, null, 2));

    // Convert base64 → buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Send as PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice_${belnr}.pdf`
    });

    res.send(pdfBuffer);

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Failed to fetch invoice PDF');
  }
});

module.exports = router;