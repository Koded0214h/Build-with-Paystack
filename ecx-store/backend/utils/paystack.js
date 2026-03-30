const fetch = require('node-fetch');

async function callPaystackAPI(endpoint, method = "GET", body=null) {
    const url = `https://api.paystack.co/${endpoint}`;
    const options = {
        method,
        headers: {
            "Authorization": `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    };

    if (body && (method == "POST" || method == "PUT")) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return {status: response.status, ok: response.ok, data, data};
}

module.exports = callPaystackAPI;