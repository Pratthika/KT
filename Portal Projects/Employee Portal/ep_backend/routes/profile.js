const express = require('express');
const router = express.Router();
const callSapSoap = require('../utils/soapClient');

router.get('/:pernr', async (req, res) => {
    const { pernr } = req.params;
    
    // The XML body matches your SAP Function Module name
    const body = `
        <urn:ZFM_EP_PROFILE_683>
            <IV_PERNR>${pernr}</IV_PERNR>
        </urn:ZFM_EP_PROFILE_683>`;

    try {
        const rawData = await callSapSoap(
            process.env.SAP_PROFILE_URL, 
            body, 
            'Profile SOAP Request Failed'
        );

        // 1. Navigate the deep SOAP structure from your JSON response
        const rawItems = rawData['soap-env:Envelope']?.['soap-env:Body']?.[0]
                        ?.['n0:ZFM_EP_PROFILE_683Response']?.[0]
                        ?.['EV_PROFILE']?.[0]
                        ?.['item'] || [];

        // 2. Map and Flatten: Convert SAP arrays like ["Value"] into just "Value"
        const profile = rawItems.map(item => ({
            PERNR: item.PERNR?.[0] || '',
            VORNA: item.VORNA?.[0] || '',
            NACHN: item.NACHN?.[0] || '',
            GESCH: item.GESCH?.[0] || '',
            NATIO: item.NATIO?.[0] || '',
            SPRSL: item.SPRSL?.[0] || '',
            GBTAG: item.GBTAG?.[0] || '',
            BEGDA: item.BEGDA?.[0] || '',
            ENDDA: item.ENDDA?.[0] || '',
            ORT01: item.ORT01?.[0] || '',
            PSTLZ: item.PSTLZ?.[0] || '',
            LAND1: item.LAND1?.[0] || '',
            LOCAT: item.LOCAT?.[0] || ''
        }));

        // 3. Send the clean JSON to the frontend
        res.json({ profile });
        
    } catch (error) {
        console.error("Backend Profile Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;