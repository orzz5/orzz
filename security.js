// Security Middleware for Website Protection

// Rate limiting to prevent attacks
const rateLimit = require('express-rate-limit');

// DDoS Protection
const ddosProtection = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// API Rate Limiting (stricter)
const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 API requests per windowMs
    message: 'Too many API requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Security Headers
const helmet = require('helmet');

// Content Security Policy
const contentSecurityPolicy = {
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://cdn.jsdelivr.net", "https://www.googletagmanager.com"],
        imgSrc: ["'self'", "data:", "https:", "https://i.imgur.com"],
        connectSrc: ["'self'", "https://api.stripe.com", "https://api.emailjs.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        frameSrc: ["'self'", "https://js.stripe.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
    },
};

// CORS Protection
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://yourdomain.com'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Request validation middleware
const validateRequest = (req, res, next) => {
    // Check for common attack patterns
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /eval\(/i,
        /expression\(/i,
        /@import/i,
        /vbscript:/i
    ];
    
    const checkSuspicious = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                for (let pattern of suspiciousPatterns) {
                    if (pattern.test(obj[key])) {
                        return false;
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                if (!checkSuspicious(obj[key])) {
                    return false;
                }
            }
        }
        return true;
    };
    
    if (!checkSuspicious(req.body) || !checkSuspicious(req.query) || !checkSuspicious(req.params)) {
        return res.status(400).json({ error: 'Invalid request detected' });
    }
    
    next();
};

// IP Blacklist (simple implementation)
const blacklistedIPs = new Set();

const ipBlacklist = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    if (blacklistedIPs.has(clientIP)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Session Security
const sessionConfig = {
    name: 'sessionId',
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
    }
};

module.exports = {
    ddosProtection,
    apiRateLimit,
    helmet,
    contentSecurityPolicy,
    corsOptions,
    validateRequest,
    ipBlacklist,
    sessionConfig,
    blacklistedIPs
};
