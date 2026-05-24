const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const callSapSoap = require('../utils/soapClient');

const router = express.Router();

router.get('/:pernr', async (req, res) => {
    const { pernr } = req.params;
    const body = `<urn:ZFM_EP_PSF_683><IV_PERNR>${pernr}</IV_PERNR></urn:ZFM_EP_PSF_683>`;

    try {
        const parsed = await callSapSoap(process.env.SAP_PAYSLIP_PDF_URL, body, 'Payslip PDF SOAP Request Failed');
        
        // Safely navigate the parsed object
        const pdfData = parsed['soap-env:Envelope']?.['soap-env:Body']?.[0]
                        ?.['n0:ZFM_EP_PSF_683Response']?.[0]?.['EV_PDF']?.[0];

        res.json({ pdf: pdfData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;