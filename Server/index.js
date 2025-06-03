import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import Razorpay from 'razorpay';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import errorMiddleware from './middlewares/error.middleware.js';
import courseRoutes from './routes/course.Routes.js';
import miscRoutes from './routes/miscellanous.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import userRoutes from './routes/user.Routes.js';

config();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  'https://learning-management-system-roan.vercel.app',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  })
);

// ✅ Preflight requests
app.options('*', cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get("/", (req, res) => {
  res.send("🚀 LMS Backend is Running Successfully!");
});

// Ensure uploads folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

// Razorpay mock config (replace with real keys in .env)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Test route
app.use('/ping', (_req, res) => {
  res.send('Pong');
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscRoutes);

// Custom signup route for testing (with file upload)
app.post('/api/auth/signup', upload.single('avatar'), (req, res) => {
  const { fullName, email, password } = req.body;
  const avatar = req.file;

  if (!fullName || !email || !password || !avatar) {
    return res.status(400).json({ success: false, message: 'Please fill all details' });
  }

  console.log('Signup Data:', { fullName, email, password, avatarPath: avatar.path });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      fullName,
      email,
      avatarUrl: `${req.protocol}://${req.get('host')}/${avatar.path}`
    }
  });
});

// Razorpay payment mock route
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const options = {
      amount: 50000,
      currency: 'INR',
      receipt: 'receipt_order_74394'
    };
    const order = await razorpayInstance.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      status: 'Success (Mocked)'
    });
  } catch (error) {
    res.status(500).send('Payment error');
  }
});

// 404 fallback
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

// Error handler middleware
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
