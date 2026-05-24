const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const callSapSoap = require('../utils/soapClient');

const router = express.Router();

// Change router.get to router.post
router.post('/', async (req, res) => {
    // Change req.params to req.body
    const { pernr, password } = req.body; 
    
    const body = `
        <urn:ZFM_EP_ELOGIN>
            <IV_PERNR>${pernr}</IV_PERNR>
            <IV_PASSWORD>${password}</IV_PASSWORD>
        </urn:ZFM_EP_ELOGIN>`;

    try {
        const data = await callSapSoap(process.env.SAP_LOGIN_URL, body, 'Login SOAP Request Failed');
        console.log('SAP Response:', data); 
        res.json({
            status: data.EV_STATUS || 'S', // Force it to match what the frontend expects
            message: data.EV_MESSAGE || 'Success',
            pernr: pernr
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;