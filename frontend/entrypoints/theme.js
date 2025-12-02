import '../styles/theme.css';
import mediumZoom from 'medium-zoom';

// Initialize theme
console.log('Vite + Shopify Theme loaded!');

// Add any custom JavaScript here
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Initialize medium-zoom for article images
    // Selects images inside the article content and the featured image
    const imagesToZoom = document.querySelectorAll('.article-content img, .article-featured-image img');

    if (imagesToZoom.length > 0) {
        mediumZoom(imagesToZoom, {
            margin: 24,
            background: '#ffffff',
            scrollOffset: 0,
        });
    }
});
