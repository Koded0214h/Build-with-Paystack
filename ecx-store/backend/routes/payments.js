const express = require('express');
const router = express.Router();

const callPaystackAPI = require('../utils/paystack');

router.post('/initialize', async (req, res) => {
    try {
        const {email, items, totalAmount} = req.body;

        // Validate input 
        if (!email || !items || !totalAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reference = "ECX-" + Date.now() + "-" + Math.random().toString(36).substring(7)

        const result = await callPaystackAPI(`transaction/initialize`, "POST", {
            email,
            amount: totalAmount * 100,
            reference,
            callback_url: `${process.env.FRONTEND_URL}/payment-success?reference=${reference}`,

        });

        res.json({
            success: true,
            authorization_url: result.data.data.authorization_url,
            reference
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'Payment failed' });
    }

});

module.exports = router;