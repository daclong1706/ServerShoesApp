const express = require("express");
const {
  createPaymentIntent,
  createPaymentMethod,
  refundPayment,
} = require("../../controllers/stripeController");

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/create-payment-method", createPaymentMethod);
router.post("/refund-payment", refundPayment);

module.exports = router;
