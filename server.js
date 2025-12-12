const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const session = require('express-session');
const { 
    ddosProtection, 
    apiRateLimit, 
    contentSecurityPolicy, 
    corsOptions, 
    validateRequest, 
    ipBlacklist, 
    sessionConfig 
} = require('./security.js');
const { serveProtectedCode, antiDebugCode, cspNonce } = require('./obfuscate.js');

const app = express();

// Security Middleware (full protection)
app.use(helmet({
    contentSecurityPolicy: contentSecurityPolicy,
    crossOriginEmbedderPolicy: false
}));

app.use(ddosProtection);
app.use(cors(corsOptions));
app.use(ipBlacklist);
app.use(validateRequest);

// Session Security
app.use(session(sessionConfig));

// Body parser with security
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Disable X-Powered-By header
app.disable('x-powered-by');

// Prevent caching of sensitive routes
const noCache = (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '-1');
    next();
};

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent with API rate limiting
app.post('/api/create-payment-intent', apiRateLimit, noCache, async (req, res) => {
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
            }
        });
        
        res.json({
            clientSecret: paymentIntent.client_secret,
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment webhook
app.post('/api/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        if (!webhookSecret) {
            return res.status(400).send('Webhook secret not configured');
        }
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Payment succeeded
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            // Payment failed
            break;
        default:
            // Unhandled event type
    }
    
    res.send();
});

// Define routes BEFORE static middleware to avoid conflicts
app.get('/', (req, res) => {
    res.redirect('/index');
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'adm-orrzz.html'));
});

app.get('/adm-orrzz', (req, res) => {
    res.sendFile(path.join(__dirname, 'adm-orrzz.html'));
});

// Serve static files explicitly
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', apiRateLimit, (req, res) => {
    serveProtectedCode(req, res, path.join(__dirname, 'script.js'));
});

// Remove static middleware to avoid conflicts

// Add anti-debugging to HTML responses
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        res.locals.antiDebugCode = antiDebugCode;
        res.locals.cspNonce = cspNonce();
    }
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // Server started
});

// Export for Vercel
module.exports = app;
