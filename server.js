const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize Stripe with your secret key
const stripe = Stripe('sk_test_...'); // Replace with your actual secret key

// Create payment intent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { items, customerName, customerEmail, description } = req.body;
        
        // Calculate total amount
        const amount = items.reduce((total, item) => total + (item.price * 100), 0); // Convert to cents
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                customerName: customerName,
                customerEmail: customerEmail,
                description: description,
                items: JSON.stringify(items)
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
        
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment webhook
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = 'whsec_...'; // Replace with your webhook secret
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent);
            
            // Here you can:
            // 1. Send confirmation email
            // 2. Save order to database
            // 3. Notify admin
            // 4. Update order status
            
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.send();
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
