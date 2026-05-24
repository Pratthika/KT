const axios = require('axios');
const xml2js = require('xml2js');

const callSapSoap = async (url, soapActionBody, errorMsg) => {
    const soapEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:urn="urn:sap-com:document:sap:rfc:functions">
            <soapenv:Header/>
            <soapenv:Body>
                ${soapActionBody}
            </soapenv:Body>
        </soapenv:Envelope>`;

    try {
        const response = await axios.post(url, soapEnvelope, {
            headers: { 
                'Content-Type': 'text/xml;charset=UTF-8',
                // Adding SOAPAction (sometimes required by SAP NetWeaver)
                'SOAPAction': '' 
            },
            auth: {
                username: process.env.SAP_USERNAME,
                password: process.env.SAP_PASSWORD
            }
        });

        return await xml2js.parseStringPromise(response.data);
    } catch (error) {
        // Detailed logging to find the root cause
        if (error.response) {
            console.error("--- SAP ERROR RESPONSE ---");
            console.error(error.response.data); 
            console.error("Status Code:", error.response.status);
        } else {
            console.error("Axios Error:", error.message);
        }
        throw new Error(errorMsg);
    }
};

module.exports = callSapSoap;