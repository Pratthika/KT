const express = require('express');
const router = express.Router();
const soap = require('soap');

const INVOICE_URL = process.env.WSDL_INVOICE; // paste your SAP WSDL
const SAP_USER = process.env.SAP_USER;
const SAP_PASS = process.env.SAP_PASS;

// SAP Credentials (Ideally move these to .env later)
const soapOptions = {
    wsdl_options: {
        auth: {
            username: SAP_USER,
            password: SAP_PASS
        }
    }
};

router.get('/:kunnr/:vbeln', async (req, res) => {
  const { kunnr, vbeln } = req.params;

  try {
    const client = await soap.createClientAsync(INVOICE_URL, soapOptions);
    client.setSecurity(new soap.BasicAuthSecurity(SAP_USER, SAP_PASS));

    const args = {
      IV_CUST_NO: kunnr,
      IV_DOC_NO: vbeln
    };

    const [result] = await client.ZFM_CP_INVPDF_683Async(args);

    const response = result?.EV_PDF;

    if (!response) {
      return res.status(500).json({ error: 'No PDF returned from SAP' });
    }

    const pdfBuffer = Buffer.from(response, 'base64');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${vbeln}.pdf`
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'SAP SOAP error' });
  }
});

module.exports = router;