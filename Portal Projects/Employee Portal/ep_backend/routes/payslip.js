const express = require('express');
const router = express.Router();
const callSapSoap = require('../utils/soapClient');

router.get('/:pernr', async (req, res) => {
    const { pernr } = req.params;
    
    // Using the specific FM name from your JSON response
    const body = `
        <urn:ZFM_EP_PS_683>
            <IV_PERNR>${pernr}</IV_PERNR>
        </urn:ZFM_EP_PS_683>`;

    try {
        const rawData = await callSapSoap(
            process.env.SAP_PAYSLIP_URL, 
            body, 
            'Payslip SOAP Request Failed'
        );

        // 1. Navigate the structure based on your JSON output
        const rawItems = rawData['soap-env:Envelope']?.['soap-env:Body']?.[0]
                        ?.['n0:ZFM_EP_PS_683Response']?.[0]
                        ?.['EV_PAYSLIP']?.[0]
                        ?.['item'] || [];

        // 2. Flatten values and parse numbers for the dashboard
        const payslip = rawItems.map(item => ({
            ENDDA: item.ENDDA?.[0] || '',
            BEGDA: item.BEGDA?.[0] || '',
            PLANS: item.PLANS?.[0] || '00000000',
            // Basic Pay
            BET01: parseFloat(item.BET01?.[0] || 0), 
            LGA01: item.LGA01?.[0] || '',
            LGTXT: item.LGTXT?.[0] || '',
            // Working details
            ARBST: parseFloat(item.ARBST?.[0] || 0),
            WKWDY: parseFloat(item.WKWDY?.[0] || 0),
            // Bank details
            BANKL: item.BANKL?.[0] || '',
            BANKN: item.BANKN?.[0] || '',
            BANKS: item.BANKS?.[0] || '',
            // Calculations
            TOTAL_EARNINGS: parseFloat(item.TOTAL_EARNINGS?.[0] || 0),
            TOTAL_DEDUCTIONS: parseFloat(item.TOTAL_DEDUCTIONS?.[0] || 0),
            NET_SALARY: parseFloat(item.NET_SALARY?.[0] || 0)
        }));

        // 3. Send clean JSON to Angular
        res.json({ payslip });
        
    } catch (error) {
        console.error("Backend Payslip Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;