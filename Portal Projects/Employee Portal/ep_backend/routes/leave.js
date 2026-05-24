const express = require('express');
const router = express.Router();
const callSapSoap = require('../utils/soapClient');

router.get('/:pernr', async (req, res) => {
    const { pernr } = req.params;
    
    // Using the specific FM name from your JSON response
    const body = `
        <urn:ZFM_EP_LEAVE_683>
            <IV_PERNR>${pernr}</IV_PERNR>
        </urn:ZFM_EP_LEAVE_683>`;

    try {
        const rawData = await callSapSoap(
            process.env.SAP_LEAVE_URL, 
            body, 
            'Leave SOAP Request Failed'
        );

        // 1. Navigate the structure based on your JSON output
        const rawItems = rawData['soap-env:Envelope']?.['soap-env:Body']?.[0]
                        ?.['n0:ZFM_EP_LEAVE_683Response']?.[0]
                        ?.['EV_LEAVE']?.[0]
                        ?.['item'] || [];

        // 2. Flatten and parse numeric values
        const leave = rawItems.map(item => ({
            AWART: item.AWART?.[0] || '',
            ATEXT: item.ATEXT?.[0] || 'Unknown',
            SUBTY: item.SUBTY?.[0] || '',
            BEGDA: item.BEGDA?.[0] || '',
            ENDDA: item.ENDDA?.[0] || '',
            // Convert strings like "4.0" to actual numbers for Angular
            ABWTG: parseFloat(item.ABWTG?.[0] || 0), 
            STDAZ: parseFloat(item.STDAZ?.[0] || 0),
            UNAME: item.UNAME?.[0] || '',
            AEDTM: item.AEDTM?.[0] || '',
            ANZHL: parseFloat(item.ANZHL?.[0] || 0)
        }));

        // 3. Send clean JSON to Angular
        res.json({ leave });
        
    } catch (error) {
        console.error("Backend Leave Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;