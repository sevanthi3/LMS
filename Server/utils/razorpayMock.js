// utils/razorpayMock.js

export default {
  orders: {
    create: async (options) => {
      return {
        id: 'order_dummy_' + Date.now(),
        amount: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: 'created'
      };
    }
  }
};
