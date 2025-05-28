// routes/paymentRoutes.js

import express from 'express';
import razorpayMock from '../utils/razorpayMock.js'; // adjust path
const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpayMock.orders.create({
      amount: amount * 100,  // ₹500 -> 50000 paisa
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error });
  }
});

export default router;
