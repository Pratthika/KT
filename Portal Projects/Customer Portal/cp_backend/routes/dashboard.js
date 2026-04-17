const express = require('express');
const router = express.Router();
const soap = require('soap');

const DASHBOARD_WSDL = process.env.WSDL_DASHBOARD;
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

// GET /api/dashboard/:custId
router.get('/:custId', async (req, res) => {
    const custId = req.params.custId;
    console.log("Fetching dashboard for ID:", custId);

    try {
        const client = await soap.createClientAsync(DASHBOARD_WSDL, soapOptions);
        client.setSecurity(new soap.BasicAuthSecurity(SAP_USER, SAP_PASS));

        const args = { IV_CUST_ID: custId };
        const [result] = await client.ZFM_CP_DASH_901927Async(args);

        // Extract items safely
        const salesItems = result.ET_SALES?.item || [];
const deliveryItems = result.ET_DELIVERY?.item || [];

res.json({
    // Map Inquiries
    inquiries: salesItems
        .filter(item => item.AUART === 'AF' || item.AUART === 'AG')
        .map(item => ({
            inquiryId: item.VBELN,
            date: item.ERDAT,
            material: "Material " + item.VBELN.slice(-3), // SAP often hides material in other tables, dummying for now
            quantity: parseFloat(item.KWMENG), // Defaulting if not in your SAP log
            status: item.STATUS
        })),

    // Map Sale Orders
    saleOrders: salesItems
        .filter(item => item.AUART === 'TA' || item.AUART === 'OR1')
        .map(item => ({
            orderId: item.VBELN,
            date: item.ERDAT,
            material: "Material " + item.VBELN.slice(-4),
            quantity: parseFloat(item.KWMENG),
            value: parseFloat(item.NETWR),
            currency: item.WAERK,
            status: parseFloat(item.NETWR) > 0 ? 'Confirmed' : 'Pending'
        })),

    // Map Deliveries
    deliveries: deliveryItems.map(item => ({
        deliveryId: item.VBELN,
        //orderId: "See Order", // Delivery records usually link back via VGBEL, but using placeholder
        date: item.WADAT_IST || item.ERDAT,
        material: item.MATNR,
        quantity: parseFloat(item.LFIMG),
        status: item.STATUS
    }))
});
    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ error: 'SOAP call failed' });
    }
});

module.exports = router;