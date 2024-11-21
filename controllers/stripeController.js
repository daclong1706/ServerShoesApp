const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51QL13vBGzsBf3YySO5uGowreZ3yaf9qKAXHtJ0mEbg7GTHE2rFkg1XwCTYEiYmcz3TnkhetpHFc2miQ1Qu89VVlF00kdv8WB2D"
);

// Tạo Payment Intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe yêu cầu đơn vị nhỏ nhất (cent)
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPaymentMethod = async (req, res) => {
  const { cardNumber, expMonth, expYear, cvc, cardholderName } = req.body;

  // Kiểm tra nếu thiếu dữ liệu
  if (!cardNumber || !expMonth || !expYear || !cvc || !cardholderName) {
    return res.status(400).json({ error: "Thiếu thông tin thẻ" });
  }

  try {
    // Tạo PaymentMethod sử dụng Stripe API
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
      billing_details: {
        name: cardholderName,
      },
    });

    // Trả về thông tin PaymentMethod nếu tạo thành công
    res.status(200).json({ paymentMethod });
  } catch (error) {
    console.error("Lỗi khi tạo PaymentMethod:", error);
    res.status(500).json({ error: error.message });
  }
};

// Hoàn tiền
exports.refundPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    res
      .status(200)
      .json({ status: refund.status, message: "Refund successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
