const express = require('express');
const router = express.Router();
const soap = require('soap');

const PROFILE_WSDL = process.env.WSDL_PROFILE;
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

// GET /api/profile/:custId
router.get('/:custId', async (req, res) => {
    const custId = req.params.custId;

    try {
        const client = await soap.createClientAsync(PROFILE_WSDL, soapOptions);
        client.setSecurity(new soap.BasicAuthSecurity(SAP_USER, SAP_PASS));

        const args = { IV_CUST_ID: custId };
        const [result] = await client.ZFM_CUST_PROFILE_901927Async(args);

        console.log("SAP Profile Raw Result:", result);

        // Access the nested ES_PROFILE object
        const sapData = result.ES_PROFILE || {};

        res.json({
            customerId: custId,
            name: sapData.NAME || "Unknown Customer",
            email: sapData.EMAIL || "not-available@sap.com", // Providing default since it's missing
            phone: sapData.PHONE || "No phone record",
            address: sapData.STREET || "Address not maintained",
            city: sapData.CITY || "N/A",
            country: sapData.COUNTRY || "IN",
            credit_limit: parseFloat(sapData.KLIMK || 0),
            currency: sapData.WAERS || ""
        });
    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({ error: 'SOAP call failed' });
    }
});

module.exports = router;