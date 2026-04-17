const express = require('express');
const router = express.Router();
const soap = require('soap');

const FINANCE_WSDL = process.env.WSDL_FINANCE;
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

// GET /api/finance/:custId
router.get('/:custId', async (req, res) => {
    const custId = req.params.custId;

    try {
        const client = await soap.createClientAsync(FINANCE_WSDL, soapOptions);
        client.setSecurity(new soap.BasicAuthSecurity(SAP_USER, SAP_PASS));

        const args = { IV_CUST_ID: custId };
        const [result] = await client.ZFM_CP_FI_901927Async(args);

        console.log("SAP Finance Raw Result:", result);

        // Extracting data based on your specific SAP Log
        const invoiceItems = result.ET_INVOICE?.item || [];
        const memoItems = result.ET_MEMO?.item || [];
        const paymentItems = result.ET_PAYMENT?.item || [];

        const responseData = {
            // 1. Invoices (from VBRK)
            invoices: (result.ET_INVOICE?.item || []).map(item => ({
                invoiceId: item.VBELN,
                date: item.FKDAT,
                //dueDate: item.NETDT || item.FKDAT,
                amount: parseFloat(item.NETWR || 0),
                currency: item.WAERK,
                // DYNAMIC STATUS LOGIC:
                status: item.RFBSK === 'C' ? 'Cleared' : (item.RFBSK === 'E' ? 'Cancelled' : 'Pending')
            })),

            // 2. Payments & Aging (from BSID + Aging Logic)
            // Note: We combine ET_PAYMENT and ET_AGING since they share the same BELNR
            payments: (result.ET_PAYMENT?.item || []).map((item, index) => {
                const agingInfo = result.ET_AGING?.item?.[index] || {};
                return {
                    paymentId: item.BELNR,
                    //invoiceId: item.REBZG && item.REBZG !== '0000000000' ? item.REBZG : 'Open Item', // BSID doesn't easily show the invoice VBELN without a join
                    billingDate: item.BUDAT,
                    //dueDate: agingInfo.DUE_DATE || '---',   // From your ABAP field: DUE_DATE
                    amount: parseFloat(item.DMBTR || 0),    // From your ABAP field: DMBTR
                    currency: item.WAERS,
                    aging: agingInfo.AGING_DAYS || '0'      // From your ABAP field: AGING_DAYS
                };
            }),

            // 3. Memos (from VBRK where FKART is G2/L2)
            memos: (result.ET_MEMO?.item || []).map(item => ({
                memoId: item.VBELN,
                type: item.FKART === 'G2' ? 'Credit' : 'Debit',
                date: item.FKDAT,
                amount: parseFloat(item.NETWR || 0),
                currency: item.WAERK,
                reason: item.FKART === 'G2' ? 'Credit Memo' : 'Debit Memo'
            })),

            // 4. Overall Sales (from ES_TOTAL)
            overallSales: parseFloat(result.ES_TOTAL?.TOT_SALES || 0),
            // FIX: Capture the new KLIMK field
            creditLimit: parseFloat(result.ES_TOTAL?.KLIMK || 0), 
            currency: result.ES_TOTAL?.WAERK || 'INR'
        };

        res.json(responseData);
    } catch (error) {
        console.error("Finance Data Error:", error);
        res.status(500).json({ error: 'SOAP call failed' });
    }
});

module.exports = router;