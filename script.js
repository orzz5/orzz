// Interactive JavaScript for Portfolio

// Global notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Email notification function
function sendEmail(type, data) {
    const templateParams = {
        type: type,
        to_email: 'orzz4237@gmail.com',
        ...data
    };

    // Add delay to avoid rate limiting
    setTimeout(() => {
        emailjs.send('service_22m6rq4', 'template_xr1auon', templateParams)
            .then(function(response) {
                console.log('Email sent successfully!', response.status);
            }, function(error) {
                console.log('Failed to send email:', error);
            });
    }, 1000);
}

// Initialize EmailJS
(function() {
    emailjs.init("JCx0Y4IfVKzT6E55e");
})();

// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations and interactions
    initScrollReveal();
    initNavbarScroll();
    initSkillBars();
    initParticles();
    initMouseEffects();
    initTypingEffect();
    initServiceCards();
    initForms();
});

// Form Handling
function initForms() {
    // Anonymous checkbox functionality
    const anonymousCheckbox = document.getElementById('anonymous-suggestion');
    const nameGroup = document.getElementById('name-group');
    const nameInput = document.getElementById('suggestion-name');
    
    if (anonymousCheckbox && nameGroup) {
        anonymousCheckbox.addEventListener('change', function() {
            if (this.checked) {
                nameGroup.style.display = 'none';
                nameInput.removeAttribute('required');
                nameInput.value = ''; // Clear the name field
            } else {
                nameGroup.style.display = 'flex';
                nameInput.setAttribute('required', '');
            }
        });
    }
    
    // Suggestion Form
    const suggestionForm = document.getElementById('suggestionForm');
    const suggestionSuccess = document.getElementById('suggestion-success');
    
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('suggestion-name').value,
                email: document.getElementById('suggestion-email').value || 'not_provided@suggestion.com',
                type: document.getElementById('suggestion-type').value,
                message: document.getElementById('suggestion-message').value,
                anonymous: document.getElementById('anonymous-suggestion').checked,
                timestamp: Date.now()
            };

            // Save to localStorage
            const key = `suggestion_${Date.now()}`;
            localStorage.setItem(key, JSON.stringify(formData));

            // Send email notification
            sendEmail('suggestion', {
                subject: `New ${formData.type} Suggestion from ${formData.anonymous ? 'Anonymous' : formData.name}`,
                message: formData.message,
                sender_name: formData.anonymous ? 'Anonymous' : formData.name,
                sender_email: formData.email
            });

            // Show success message
            showNotification('Suggestion submitted successfully! We\'ll review it soon.', 'success');
            
            // Hide form and show success message
            suggestionForm.style.display = 'none';
            suggestionSuccess.style.display = 'block';
            
            // Reset form after delay
            setTimeout(() => {
                suggestionForm.reset();
                suggestionForm.style.display = 'flex';
                suggestionSuccess.style.display = 'none';
            }, 5000);
        });
    }
    
    // Custom Order Form
    const customOrderForm = document.getElementById('customOrderForm');
    const orderSuccess = document.getElementById('order-success');
    
    if (customOrderForm) {
        customOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const orderData = {
                name: document.getElementById('order-name').value,
                email: document.getElementById('order-email').value,
                type: document.getElementById('order-service').value,
                details: document.getElementById('order-description').value,
                budget: document.getElementById('order-budget').value,
                timeline: document.getElementById('order-deadline').value,
                timestamp: Date.now()
            };
            
            // Store order
            console.log('Custom order submitted:', orderData);
            const key = `order_${Date.now()}`;
            localStorage.setItem(key, JSON.stringify(orderData));

            // Send email notification
            sendEmail('custom order', {
                subject: `New ${orderData.type} Order from ${orderData.name}`,
                name: orderData.name,
                email: orderData.email,
                type: orderData.type,
                details: orderData.details,
                budget: orderData.budget,
                timeline: orderData.timeline,
                timestamp: new Date(orderData.timestamp).toLocaleString()
            });
            
            // Show success message
            showNotification('Custom order submitted successfully! We\'ll review it soon.', 'success');
            customOrderForm.style.display = 'none';
            orderSuccess.style.display = 'block';
            
            // Reset form after delay
            setTimeout(() => {
                customOrderForm.reset();
                customOrderForm.style.display = 'flex';
                orderSuccess.style.display = 'none';
            }, 5000);
        });
    }
    
    // Add input validation feedback
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.validity.valid) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === '#ef4444' && this.validity.valid) {
                this.style.borderColor = '';
            }
        });
    });
}

// Service Cards Modal
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    console.log('Found service cards:', serviceCards.length);
    
    if (serviceCards.length === 0) {
        console.error('No service cards found!');
        return;
    }
    
    // Services are now always open, no need for expand functionality
    console.log('Service cards initialized - services are always visible');
}

// Scroll reveal animation
function initScrollReveal() {
    const elements = document.querySelectorAll('.skill-card, .stat-item, .about-text, .contact-card');
    
    const revealOnScroll = () => {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('scroll-reveal', 'active');
            }
        });
    };
    
    // Initial check
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 255, 136, 0.1)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animate skill bars when they come into view
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (barTop < windowHeight - 100) {
                const width = bar.style.getPropertyValue('--skill-level');
                bar.style.width = width;
            }
        });
    };
    
    // Set initial width to 0
    skillBars.forEach(bar => {
        bar.style.width = '0';
    });
    
    // Start animation when visible
    window.addEventListener('scroll', animateSkillBars);
    animateSkillBars(); // Initial check
}

// Particle background effect
function initParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(hero);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--primary-color);
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        animation: particleFloat 10s linear infinite;
    `;
    
    // Random starting position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 20000);
}

// Add particle animation to CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 0;
            transform: translateY(0px) translateX(0px);
        }
        10% {
            opacity: 0.5;
        }
        90% {
            opacity: 0.5;
        }
        100% {
            opacity: 0;
            transform: translateY(-100vh) translateX(50px);
        }
    }
`;
document.head.appendChild(particleStyle);

// Mouse trail effect
function initMouseEffects() {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Create cursor trail
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        // Update any cursor-following elements here
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// Typing effect for hero subtitle
function initTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    
    let index = 0;
    const typeSpeed = 100;
    
    function typeText() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, typeSpeed);
        }
    }
    
    // Start typing after initial animations
    setTimeout(typeText, 1500);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 0;
            height: 0;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Discord card hover effect
const discordCard = document.querySelector('.discord-card');
if (discordCard) {
    discordCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    discordCard.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe elements for animations
document.querySelectorAll('.skill-card, .stat-item, .about-text, .contact-card').forEach(el => {
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect removed to fix scrolling behavior

// Add dynamic color theme on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Change accent colors based on scroll position
    const hue = (scrollPercent * 1.2) % 360;
    document.documentElement.style.setProperty('--accent-color', `hsl(${hue}, 100%, 50%)`);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['home', 'about', 'skills', 'contact'];
    const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        }
        return null;
    });
    
    let currentIndex = currentSection ? sections.indexOf(currentSection) : 0;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % sections.length;
        document.getElementById(sections[currentIndex]).scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        document.getElementById(sections[currentIndex]).scrollIntoView({ behavior: 'smooth' });
    }
});

// Add contact form interaction (if needed in future)
const contactCard = document.querySelector('.discord-card');
if (contactCard) {
    contactCard.addEventListener('click', function(e) {
        // Add click feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
}

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.init();
    }

    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartUI();
    }

    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
        this.updateCartUI();
    }

    setupEventListeners() {
        // Cart icon click
        document.getElementById('cartIcon').addEventListener('click', () => this.openCart());
        
        // Cart close
        document.getElementById('cartClose').addEventListener('click', () => this.closeCart());
        document.getElementById('cartOverlay').addEventListener('click', () => this.closeCart());
        
        // Clear cart
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        
        // Confirm buy
        document.getElementById('confirmBuy').addEventListener('click', () => this.confirmBuy());
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const service = btn.dataset.service;
                const price = btn.dataset.price;
                this.addToCart(service, price);
            });
        });
        
        // Cart item remove buttons (event delegation)
        document.getElementById('cartItems').addEventListener('click', (e) => {
            if (e.target.closest('.cart-item-remove')) {
                const btn = e.target.closest('.cart-item-remove');
                const id = parseInt(btn.dataset.id);
                this.removeFromCart(id);
            }
        });
    }

    addToCart(service, price) {
        const item = {
            id: Date.now(),
            service: service,
            price: parseInt(price),
            quantity: 1
        };
        
        this.cart.push(item);
        this.saveCart();
        this.showNotification('Added to cart!', 'success');
        
        // Visual feedback for button
        const btn = document.querySelector(`[data-service="${service}"]`);
        if (btn) {
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            }, 1000);
        }
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.showNotification('Removed from cart', 'info');
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.showNotification('Cart cleared', 'info');
        }
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotal = document.getElementById('cartTotal');
        
        // Update count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Update cart items
        if (this.cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.style.display = 'none';
            cartTotal.textContent = '$0';
        } else {
            cartEmpty.style.display = 'none';
            cartItems.style.display = 'flex';
            
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.service}</div>
                        <div class="cart-item-price">$${item.price} ${item.quantity > 1 ? `(${item.quantity}x)` : ''}</div>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
            
            cartTotal.textContent = `$${this.calculateTotal()}`;
        }
    }

    openCart() {
        document.getElementById('cartSidebar').classList.add('active');
        document.getElementById('cartOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        document.getElementById('cartSidebar').classList.remove('active');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    confirmBuy() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }
        
        const total = this.calculateTotal();
        const items = this.cart.map(item => `${item.service} ($${item.price})`).join(', ');
        
        if (confirm(`Confirm purchase of:\n${items}\n\nTotal: $${total}\n\nThis is a demo - no actual payment will be processed.`)) {
            // Save order to localStorage for admin dashboard
            const order = {
                id: Date.now(),
                items: this.cart,
                total: total,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            // Save to orders (for admin dashboard)
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            this.cart = [];
            this.saveCart();
            this.closeCart();
            
            this.showNotification('Order confirmed! (Demo)', 'success');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initForms();
    initServiceCards();
    
    // Initialize shopping cart
    const shoppingCart = new ShoppingCart();
});
