const asyncHandler = require("express-async-handler");
const axios = require("axios");
require("dotenv").config();

const PAYPAL_API = process.env.PAYPAL_API;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Lấy Access Token từ PayPal
const getAccessToken = async () => {
  try {
    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      "base64"
    );
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      }
    );

    if (response.data && response.data.access_token) {
      console.log("Access Token:", response.data.access_token);
      return response.data.access_token;
    } else {
      console.error("Failed to retrieve access token:", response.data);
      throw new Error("Access token not found");
    }
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
    }
    throw error;
  }
};

// Tạo đơn hàng PayPal
const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  //console.log(response.data);

  return res.status(201).json(response.data);
});

// Xác nhận thanh toán PayPal
const captureOrder = asyncHandler(async (req, res) => {
  const { orderID } = req.body;

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.status(200).json(response.data);
});

// Hoàn tiền đơn hàng PayPal (Refund)
const refundOrder = asyncHandler(async (req, res) => {
  const { captureID } = req.body;

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_API}/v2/payments/captures/${captureID}/refund`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.status(200).json(response.data);
});

module.exports = {
  createOrder,
  captureOrder,
  refundOrder,
};
