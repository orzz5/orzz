# COMPLETE GUIDE: Publish Your Website with All Features

## **STEP 1: SET UP EMAIL NOTIFICATIONS**

### 1A. Create EmailJS Account (Free)
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for free account
3. Click "Add Email Service" → choose "Gmail"
4. Connect your Gmail: orzz4237@gmail.com
5. Verify your email (check spam folder)

### 1B. Create Email Template
1. In EmailJS dashboard, click "Email Templates"
2. Click "Create New Template"
3. Template Name: "Portfolio Notification"
4. Subject: `{{subject}}`
5. Content:
```
New {{type}} from {{sender_name}}

Email: {{sender_email}}
Message: {{message}}

Time: {{timestamp}}
```

### 1C. Get Your Credentials
- **Service ID**: From Email Service page
- **Template ID**: From Email Templates page  
- **Public Key**: From Integration → API Keys

### 1D. Update Your JavaScript
Replace in script.js:
```javascript
emailjs.init("YOUR_PUBLIC_KEY");
emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
```

---

## **STEP 2: SET UP STRIPE PAYMENTS**

### 2A. Create Stripe Account
1. Go to [Stripe.com](https://stripe.com)
2. Sign up (individual account is fine)
3. Complete verification (takes 1-2 days)
4. Get your API keys (Publishable & Secret)

### 2B. Add Stripe to Your Website
Add to index.html:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### 2C. Create Checkout Page
Create new file: `checkout.html`
```html
<!DOCTYPE html>
<html>
<head>
    <title>Checkout - orzz</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="checkout-container">
        <h1>Complete Your Purchase</h1>
        <div id="cart-summary"></div>
        <button id="checkout-btn">Pay with Card</button>
    </div>
    <script>
        const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
        
        document.getElementById('checkout-btn').addEventListener('click', async () => {
            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({items: getCartItems()})
            });
            
            const session = await response.json();
            stripe.redirectToCheckout({sessionId: session.id});
        });
    </script>
</body>
</html>
```

### 2D. Create Backend Server
Create `server.js` (Node.js):
```javascript
const express = require('express');
const Stripe = require('stripe');
const app = express();

const stripe = Stripe('YOUR_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: req.body.items,
        mode: 'payment',
        success_url: 'https://yoursite.com/success',
        cancel_url: 'https://yoursite.com/cancel',
    });
    
    res.json({id: session.id});
});

app.listen(4242, () => console.log('Server running'));
```

---

## **STEP 3: PUBLISH TO GITHUB PAGES**

### 3A. Install Git
1. Download Git from [git-scm.com](https://git-scm.com)
2. Install with default settings
3. Open Command Prompt/PowerShell

### 3B. Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3C. Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `orzz-portfolio`
4. Description: "Professional portfolio website"
5. Set to "Public"
6. Click "Create repository"

### 3D. Upload Your Files
```bash
# Navigate to your project folder
cd "C:\Users\ik012982i11\Desktop\Web personal"

# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/orzz-portfolio.git

# Push to GitHub
git push -u origin main
```

### 3E. Enable GitHub Pages
1. In your GitHub repository, go to "Settings"
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main" and folder "/ (root)"
5. Click "Save"

### 3F. Get Your Live URL
- Wait 1-2 minutes
- Your site is live at: `https://YOUR_USERNAME.github.io/orzz-portfolio`

---

## **STEP 4: AUTOMATIC UPDATES**

### 4A. Set Up Automatic Deployment
Your GitHub Pages site automatically updates when you push changes!

### 4B. Update Workflow
Whenever you modify files:
```bash
git add .
git commit -m "Update website"
git push origin main
```
Your site updates automatically within 1-2 minutes.

---

## **STEP 5: CUSTOM DOMAIN (OPTIONAL)**

### 5A. Buy Domain
- Go to [Namecheap](https://www.namecheap.com) or [GoDaddy](https://www.godaddy.com)
- Buy domain for ~$10-15/year

### 5B. Connect to GitHub Pages
1. In GitHub repository "Settings" → "Pages"
2. Under "Custom domain", enter your domain
3. Follow DNS instructions provided

---

## **STEP 6: TEST EVERYTHING**

### 6A. Test Email Notifications
1. Submit a suggestion on your live site
2. Check orzz4237@gmail.com inbox (and spam)

### 6B. Test Payments
1. Add items to cart
2. Go to checkout
3. Use Stripe test card: 4242 4242 4242 4242

### 6C. Test Admin Dashboard
1. Go to `your-site.com/admin-dashboard.html`
2. Login with password: admin123
3. Check suggestions/orders appear

---

## **STEP 7: MAINTENANCE**

### Weekly Tasks:
- Check email for new suggestions/orders
- Review admin dashboard
- Update portfolio if needed
- Backup your code (Git does this automatically)

### Monthly Tasks:
- Review Stripe payments
- Update pricing if needed
- Check website performance

---

## **IMPORTANT NOTES**

### Security:
- Never share your Stripe secret key
- Keep admin password secure
- Regular backups via Git

### Legal:
- Add Privacy Policy to your site
- Add Terms of Service
- Comply with data protection laws

### Performance:
- Optimize images before uploading
- Monitor site speed
- Test on mobile devices

---

## **QUICK START CHECKLIST**

□ Create EmailJS account
□ Connect Gmail to EmailJS
□ Create Stripe account
□ Set up GitHub repository
□ Upload files to GitHub
□ Enable GitHub Pages
□ Test email notifications
□ Test payment system
□ Test admin dashboard
□ Share your live website!

---

## **SUPPORT**

If you need help:
- GitHub Pages documentation
- Stripe documentation
- EmailJS documentation
- Stack Overflow for coding issues

Your professional website will be live and ready for business!
