document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.style.display = mainNav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Initialize cart count
    updateCartCount();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Testimonial slider functionality
    setupTestimonialSlider();
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            // In a real app, you would send this to your server
            alert(`Thanks for subscribing with ${email}! You'll hear from us soon.`);
            this.reset();
        });
    }
    
    // Category card hover effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Load featured products
function loadFeaturedProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // In a real app, you would fetch this from your API
    const featuredProducts = [
        {
            id: 1,
            name: "Spicy Mango Pickle",
            category: "Vegetarian",
            price: 12.99,
            originalPrice: 15.99,
            image: "images/product1.jpg",
            badge: "Bestseller"
        },
        {
            id: 2,
            name: "Garlic Chicken Pickle",
            category: "Non-Vegetarian",
            price: 14.99,
            image: "images/product2.jpg",
            badge: "New"
        },
        {
            id: 3,
            name: "Mixed Vegetable Pickle",
            category: "Vegetarian",
            price: 11.99,
            image: "images/product3.jpg"
        },
        {
            id: 4,
            name: "Artisan Crackers",
            category: "Snacks",
            price: 8.99,
            image: "images/product4.jpg",
            badge: "Pairing"
        },
        {
            id: 5,
            name: "Spicy Prawn Pickle",
            category: "Non-Vegetarian",
            price: 16.99,
            image: "images/product5.jpg"
        },
        {
            id: 6,
            name: "Lemon Pickle",
            category: "Vegetarian",
            price: 10.99,
            originalPrice: 12.99,
            image: "images/product6.jpg",
            badge: "Sale"
        },
        {
            id: 7,
            name: "Gourmet Pickle Sampler",
            category: "Gift Set",
            price: 29.99,
            image: "images/product7.jpg"
        },
        {
            id: 8,
            name: "Herbed Flatbreads",
            category: "Snacks",
            price: 7.99,
            image: "images/product8.jpg"
        }
    ];
    
    productGrid.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h4 class="product-title">${product.name}</h4>
                <p class="product-category">${product.category}</p>
                <div class="product-price">
                    <div>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-basket"></i>
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Cart functionality
function addToCart(productId) {
    // In a real app, you would add this to your cart system
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Visual feedback
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('added');
    setTimeout(() => {
        cartIcon.classList.remove('added');
    }, 500);
    
    // Create confetti effect
    createConfetti();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function createConfetti() {
    const colors = ['#f4c542', '#245c36', '#6b4f3d', '#ffffff'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 2 + 1 + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(confetti);
        
        // Remove confetti element after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Testimonial slider functionality
function setupTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;
    
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    slider.addEventListener('mousedown', dragStart);
    slider.addEventListener('touchstart', dragStart);
    
    slider.addEventListener('mouseup', dragEnd);
    slider.addEventListener('mouseleave', dragEnd);
    slider.addEventListener('touchend', dragEnd);
    
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchmove', drag);
    
    // Prevent image drag on mobile
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        testimonial.addEventListener('dragstart', (e) => e.preventDefault());
    });
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }
        
        isDragging = true;
        slider.style.cursor = 'grabbing';
        slider.style.scrollBehavior = 'auto';
        
        animationID = requestAnimationFrame(animation);
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }
        
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        slider.style.cursor = 'grab';
        
        // Snap to nearest testimonial
        const testimonialWidth = document.querySelector('.testimonial').offsetWidth;
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -50) {
            // Swipe left
            prevTranslate -= testimonialWidth;
        } else if (movedBy > 50) {
            // Swipe right
            prevTranslate += testimonialWidth;
        }
        
        // Don't go beyond first or last testimonial
        const maxTranslate = 0;
        const minTranslate = -(testimonials.length - 1) * testimonialWidth;
        prevTranslate = Math.max(minTranslate, Math.min(maxTranslate, prevTranslate));
        
        slider.style.transform = `translateX(${prevTranslate}px)`;
        slider.style.scrollBehavior = 'smooth';
    }
    
    function animation() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(animation);
    }
}

// Initialize product quick view modal
function initQuickView() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.add-to-cart')) {
                // In a real app, you would show a modal with product details
                const productId = this.querySelector('.add-to-cart').getAttribute('data-id');
                alert(`Quick view for product ${productId} would open here`);
            }
        });
    });
}