const express = require("express");
const axios = require("axios");
const router = express.Router();
require('dotenv').config();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.sandbox.paypal.com'; // Default to sandbox for testing

router.post('/create-order', async (req, res) => {
  let { price } = req.body;

  // Remove any currency symbols from the price
  price = price.replace(/[^0-9.]/g, '');

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ id: response.data.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error.response ? error.response.data : error.message);
    res.status(500).send('Error creating PayPal order');
  }
});

router.post('/capture-order', async (req, res) => {
  const { orderId } = req.body;

  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error capturing PayPal order:", error.response ? error.response.data : error.message);
    res.status(500).send('Error capturing PayPal order');
  }
});

module.exports = router;
