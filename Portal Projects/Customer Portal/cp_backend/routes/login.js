const express = require('express');
const router = express.Router();
const soap = require('soap');

const LOGIN_WSDL = process.env.WSDL_LOGIN;

// SAP Credentials
const SAP_USER = process.env.SAP_USER;
const SAP_PASS = process.env.SAP_PASS;

const soapOptions = {
    wsdl_options: {
        auth: {
            username: SAP_USER,
            password: SAP_PASS
        }
    }
};

// 🔹 CHANGED TO POST: Because we are sending sensitive data (password)
router.post('/', async (req, res) => {
    // Make sure your frontend sends JSON with these exact keys
    const { customerId, password } = req.body;

    // Basic validation to prevent unnecessary SOAP calls
    if (!customerId || !password) {
        return res.status(400).json({ error: 'Customer ID and Password are required' });
    }

    try {
        const client = await soap.createClientAsync(LOGIN_WSDL, soapOptions);
        client.setSecurity(new soap.BasicAuthSecurity(SAP_USER, SAP_PASS));

        // Ensure these keys (IV_CUST_ID, IV_PASSWORD) match your SAP Function Module exactly
        const args = { 
            IV_CUST_ID: customerId, 
            IV_PASSWORD: password 
        };

        const [result] = await client.ZFM_CUST_LOGIN_901927Async(args);

        console.log("SAP Result:", result);
        if (result.EV_STATUS === 'SUCCESS') { // Check your SAP success flag
            res.json({
                success: true,
                token: "dummy-token-for-now", // Or your actual JWT
                customerId: result.EV_CUST_ID || result.IV_CUST_ID || customerId, 
                message: "Login successful"
            });
        } else {
            res.status(401).json({ error: 'Invalid Credentials' });
        }
        

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ 
            error: 'Authentication service unavailable',
            details: error.message 
        });
    }
});

module.exports = router;