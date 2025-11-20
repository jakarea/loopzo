// Main JavaScript file for Loopzo Shopify Theme
// This file handles all interactive functionality across the theme

console.log('Loopzo theme loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loopzo theme initialized');

    // Initialize mobile menu
    initializeMobileMenu();

    // Initialize FAQ if it exists
    initializeFAQ();

    // Initialize image sliders if they exist
    initializeSliders();

    // Initialize any other interactive elements
    initializeInteractiveElements();
});

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }
}

// FAQ functionality (moved from inline script)
function initializeFAQ() {
    // Check if FAQ elements exist
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    // Close all FAQs first
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allIcons = document.querySelectorAll('.faq-icon');

    allAnswers.forEach(answer => {
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
    });

    allIcons.forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
    });

    // Open first FAQ by default
    const firstFAQ = document.querySelector('.faq-item .faq-answer');
    const firstIcon = document.querySelector('.faq-item .faq-icon');
    if (firstFAQ && firstIcon) {
        setTimeout(() => {
            firstFAQ.style.maxHeight = firstFAQ.scrollHeight + 50 + 'px';
            firstFAQ.style.overflow = 'visible';
            firstIcon.style.transform = 'rotate(45deg)';
        }, 100);
    }
}

// Toggle FAQ accordion
window.toggleFAQ = function(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');

    // Check if current item is open
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

    // Close all other FAQ items first
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allIcons = document.querySelectorAll('.faq-icon');

    allAnswers.forEach(otherAnswer => {
        otherAnswer.style.maxHeight = '0px';
        otherAnswer.style.overflow = 'hidden';
    });

    allIcons.forEach(otherIcon => {
        otherIcon.style.transform = 'rotate(0deg)';
    });

    // Toggle current item
    if (!isOpen) {
        // Open this item
        answer.style.maxHeight = answer.scrollHeight + 50 + 'px';
        answer.style.overflow = 'visible';
        icon.style.transform = 'rotate(45deg)';
    }
    // If it was already open, it stays closed (all closed state)
};

// Filter FAQ by category
window.filterFAQ = function(category) {

    const faqItems = document.querySelectorAll('.faq-item');
    const faqTabs = document.querySelectorAll('.faq-tab');

    // Update tab styling
    faqTabs.forEach(tab => {
        const tabCategory = tab.getAttribute('data-category');

        if (tabCategory === category) {
            tab.classList.remove('bg-white', 'border-2', 'border-slate-300', 'text-slate-700');
            tab.classList.add('bg-slate-700', 'text-white');
        } else {
            tab.classList.remove('bg-slate-700', 'text-white');
            tab.classList.add('bg-white', 'border-2', 'border-slate-300', 'text-slate-700');
        }
    });

    // Show/hide FAQ items
    let visibleCount = 0;
    faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Reset FAQ state after filtering - close all and optionally open first visible
    resetFAQState();
};

// Reset FAQ state (close all items)
function resetFAQState() {
    const allAnswers = document.querySelectorAll('.faq-answer');
    const allIcons = document.querySelectorAll('.faq-icon');

    allAnswers.forEach(answer => {
        answer.style.maxHeight = '0px';
        answer.style.overflow = 'hidden';
    });

    allIcons.forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
    });
}

// Toggle mobile menu (for mobile navigation dropdowns)
window.toggleMobileMenu = function(menuId) {
    const menu = document.getElementById(menuId);
    const icon = document.getElementById(menuId + '-icon');

    if (menu && icon) {
        menu.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
    }
};

// Image slider functionality
function initializeSliders() {
    const slides = document.querySelectorAll('.slider-image');
    if (slides.length === 0) return;

    // Auto-advance slider functionality
    let currentSlide = 1;
    const totalSlides = slides.length;

    function advanceSlide() {
        showSlide(currentSlide + 1);
        currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
    }

    // Auto-advance every 5 seconds for product showcase
    const productShowcase = document.querySelector('.product_showcase_section');
    if (productShowcase) {
        setInterval(advanceSlide, 5000);
    }
}

// Change slide function for product image galleries
window.changeSlide = function(direction) {
    const slides = document.querySelectorAll('.slider-image');
    const buttons = document.querySelectorAll('.grid button');

    if (slides.length === 0) return;

    let currentSlide = 1;
    slides.forEach((slide, index) => {
        if (slide.style.opacity === '1' || slide.style.opacity === '') {
            currentSlide = index + 1;
        }
    });

    let newSlide = currentSlide + direction;
    if (newSlide > slides.length) newSlide = 1;
    if (newSlide < 1) newSlide = slides.length;

    showSlide(newSlide);
};

// Show specific slide
window.showSlide = function(slideNumber) {
    const slides = document.querySelectorAll('.slider-image');
    const buttons = document.querySelectorAll('.grid button');

    if (slides.length === 0) return;

    slides.forEach((slide, index) => {
        slide.style.opacity = (index + 1 === slideNumber) ? '1' : '0';
    });

    if (buttons.length > 0) {
        buttons.forEach((button, index) => {
            if (button.className.includes('border-2')) {
                button.className = button.className.replace(/border-\w+-\d+/g, (index + 1 === slideNumber) ? 'border-slate-600' : 'border-transparent');
            }
        });
    }
};

// Initialize other interactive elements
function initializeInteractiveElements() {
    // Add any additional interactive functionality here

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Initialize any tooltips or popovers if needed
    initializeTooltips();

    // Initialize form validation if needed
    initializeFormValidation();
}

// Tooltip functionality
function initializeTooltips() {
    // Add tooltip initialization here if needed
}

// Form validation
function initializeFormValidation() {
    // Add form validation logic here if needed
}

// Utility functions
const Utils = {
    // Debounce function for performance optimization
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance optimization
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Make Utils available globally
window.Utils = Utils;

// Handle Shopify cart AJAX if needed
window.ShopifyUtils = {
    // Add to cart function
    addToCart: function(variantId, quantity) {
        const formData = {
            'id': variantId,
            'quantity': quantity
        };

        return fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .catch(error => console.error('Error adding to cart:', error));
    },

    // Get cart contents
    getCart: function() {
        return fetch('/cart.js')
            .then(response => response.json())
            .catch(error => console.error('Error getting cart:', error));
    },

    // Update cart item quantity
    updateCart: function(key, quantity) {
        const formData = {
            'id': key,
            'quantity': quantity
        };

        return fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .catch(error => console.error('Error updating cart:', error));
    }
};

// Handle Web Vitals monitoring if enabled
if (typeof performance !== 'undefined' && performance.getEntriesByType) {
    // Simple Web Vitals monitoring
    window.addEventListener('load', function() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            console.log('Page load time:', loadTime + 'ms');
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Export any functions that might be needed globally
window.LoopzoTheme = {
    toggleFAQ: window.toggleFAQ,
    filterFAQ: window.filterFAQ,
    toggleMobileMenu: window.toggleMobileMenu,
    changeSlide: window.changeSlide,
    showSlide: window.showSlide,
    ShopifyUtils: window.ShopifyUtils,
    Utils: Utils
};