// =============================================================================
// LOOPZO - Main JavaScript File
// Shared across index.html and product.html
// =============================================================================

// =============================================================================
// MOBILE MENU
// =============================================================================

// Mobile menu toggle with ARIA support for screen readers
function toggleMenu() {
    var menu = document.getElementById('mobile-menu');
    var button = document.getElementById('mobile-menu-button');

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
    } else {
        menu.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    }
}

// Mobile menu functionality for FAQ/accordion menus
function toggleMobileMenu(menuId) {
    const menu = document.getElementById(menuId);
    const icon = document.getElementById(menuId + '-icon');

    if (menu && icon) {
        if (menu.classList.contains('hidden')) {
            menu.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            menu.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// =============================================================================
// WHATSAPP BUTTON
// =============================================================================

// WhatsApp button scroll visibility with smooth animation
function handleWhatsAppButtonVisibility() {
    const button = document.getElementById('whatsapp-button');
    if (!button) return;

    const heroSection = document.querySelector('[aria-label="Hero section"]');
    const scrollPosition = window.scrollY || window.pageYOffset;

    // For index.html: show after scrolling past hero section
    if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        if (scrollPosition > heroHeight) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.transform = 'translateY(20px)';
        }
    } else {
        // For product.html: show after scrolling 300px
        if (scrollPosition > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
            button.style.transform = 'translateY(20px)';
        }
    }
}

// Listen for scroll events
window.addEventListener('scroll', handleWhatsAppButtonVisibility);
document.addEventListener('DOMContentLoaded', handleWhatsAppButtonVisibility);

// =============================================================================
// PRODUCT IMAGE SLIDER (Index Page)
// =============================================================================

let currentSlide = 1;
let hoverTimeout;

function showSlide(slideNumber) {
    const slides = document.querySelectorAll('.slider-image');
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    // Wrap around
    if (slideNumber > totalSlides) {
        currentSlide = 1;
    } else if (slideNumber < 1) {
        currentSlide = totalSlides;
    } else {
        currentSlide = slideNumber;
    }

    // Hide all slides
    slides.forEach(slide => {
        slide.style.opacity = '0';
    });

    // Show current slide with fade in effect
    slides[currentSlide - 1].style.opacity = '1';
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

// Hover effect to show next image
document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.querySelector('.group');

    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function () {
            // Clear any existing timeout
            clearTimeout(hoverTimeout);

            // Wait a moment, then show next slide
            hoverTimeout = setTimeout(function () {
                const nextSlide = currentSlide + 1;
                const totalSlides = document.querySelectorAll('.slider-image').length;
                showSlide(nextSlide > totalSlides ? 1 : nextSlide);
            }, 300); // 300ms delay before showing next image
        });

        sliderContainer.addEventListener('mouseleave', function () {
            // Clear the timeout if mouse leaves before it triggers
            clearTimeout(hoverTimeout);
        });
    }
});

// =============================================================================
// FAQ ACCORDION (Index Page)
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqItems = document.querySelectorAll('.faq-item');

    // Accordion toggle
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            const isOpen = answer.style.maxHeight;

            // Close all other answers
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.style.maxHeight = null;
            });
            document.querySelectorAll('.faq-icon').forEach(item => {
                item.style.transform = 'rotate(0deg)';
            });

            // Toggle current answer
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            }
        });
    });

    // Category filter
    faqTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            faqTabs.forEach(t => {
                t.classList.remove('active', 'bg-slate-700', 'text-white');
                t.classList.add('bg-white', 'border-2', 'border-slate-300', 'text-slate-700');
            });
            this.classList.add('active', 'bg-slate-700', 'text-white');
            this.classList.remove('bg-white', 'border-2', 'border-slate-300', 'text-slate-700');

            // Filter items
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Close all open answers when switching categories
            document.querySelectorAll('.faq-answer').forEach(answer => {
                answer.style.maxHeight = null;
            });
            document.querySelectorAll('.faq-icon').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
        });
    });
});

// =============================================================================
// PRODUCT PAGE FUNCTIONALITY
// =============================================================================

// Product image gallery
function changeMainImage(button, imageSrc) {
    const mainImage = document.getElementById('main-product-image');
    if (!mainImage) return;

    mainImage.src = imageSrc;

    // Update thumbnail borders
    document.querySelectorAll('.thumbnail-btn').forEach(btn => {
        btn.classList.remove('border-slate-700');
        btn.classList.add('border-slate-200');
    });
    button.classList.remove('border-slate-200');
    button.classList.add('border-slate-700');
}

// Product options selection (color, size, etc.)
function selectOption(button, optionType) {
    const group = button.parentElement;
    group.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('option-selected', 'border-slate-900', 'bg-slate-50');
        if (optionType === 'color') {
            btn.classList.remove('border-slate-900');
            btn.classList.add('border-transparent');
        } else {
            btn.classList.add('border-slate-300');
        }
    });

    button.classList.add('option-selected');
    if (optionType === 'color') {
        button.classList.remove('border-transparent');
        button.classList.add('border-slate-900');
        // Update color name
        const colorName = button.getAttribute('title');
        const colorNameEl = document.getElementById('selected-color-name');
        if (colorNameEl) {
            colorNameEl.textContent = colorName;
        }
    } else {
        button.classList.remove('border-slate-300');
        button.classList.add('border-slate-900', 'bg-slate-50');
    }
}

// Quantity update
function updateQuantity(change) {
    const input = document.getElementById('quantity');
    if (!input) return;

    let value = parseInt(input.value) || 1;
    value = Math.max(1, value + change);
    input.value = value;
}

// Tab switching (fixed deprecated event usage)
function switchTab(tabName, event) {
    // Hide all tabs
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
    });

    // Remove active state from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-active', 'border-slate-900', 'text-slate-900');
        btn.classList.add('border-transparent', 'text-slate-600');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }

    // Add active state to clicked button
    if (event && event.target) {
        event.target.classList.remove('border-transparent', 'text-slate-600');
        event.target.classList.add('tab-active', 'border-slate-900', 'text-slate-900');
    }
}

// Product form submission (Shopify integration point)
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // This is where Shopify's AJAX cart would be integrated
            // For now, we'll show an alert
            alert('Product toegevoegd aan winkelwagen! (Dit zou integreren met Shopify cart)');

            // In Shopify, this would be:
            // fetch('/cart/add.js', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ id: variantId, quantity: quantity })
            // })
        });
    }
});
