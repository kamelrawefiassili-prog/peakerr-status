const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

// ⚠️ إن كنت ستستدعيه من المتصفح مباشرة، قيّد origin بدل *
app.use(cors({ origin: '*' }));

// إعدادات
const API_URL = process.env.PEEKER_API_URL || 'https://peaker.com/api/v2';
const API_KEY = process.env.PEEKER_API_KEY; // ضعه في Render كـ env var

app.get('/', (_, res) => {
  res.json({ ok: true, service: 'peaker-proxy', routes: ['/order'] });
});

// نقطة طلب الحالة
app.post('/order', async (req, res) => {
  try {
    const action = (req.body?.action || 'status').toString();
    const order = (req.body?.order || '').toString().trim();

    if (!order) {
      return res.status(400).json({ error: 'order_required' });
    }
    if (!API_KEY) {
      return res.status(500).json({ error: 'server_misconfigured', detail: 'PEEKER_API_KEY missing' });
    }

    // نبني بيانات x-www-form-urlencoded كما يتوقع Peaker
    const payload = new URLSearchParams();
    payload.append('key', API_KEY);
    payload.append('action', action);
    payload.append('order', order);

    const upstream = await axios.post(API_URL, payload.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000
    });

    res.json(upstream.data);
  } catch (err) {
    const status = err.response?.status || 502;
    const detail = err.response?.data || err.message;
    res.status(status).json({ error: 'upstream_error', detail });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Proxy running on :${PORT}`));
