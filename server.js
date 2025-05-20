
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// FINAL CORS FIX — allow all origins + handle preflight
app.use(cors());
app.options('*', cors());

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: { name: item.product },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://storied-frangipane-10d78c.netlify.app/success/',
      cancel_url: 'https://storied-frangipane-10d78c.netlify.app/cart/',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
