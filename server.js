
// server.js
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.product
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://stupendous-puppy-31ef09.netlify.app/success.html',
      cancel_url: 'https://stupendous-puppy-31ef09.netlify.app/cart.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
