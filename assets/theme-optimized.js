// Performance optimizations for Loopzo theme
(function() {
  'use strict';

  // Lazy load images when they come into viewport
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Defer non-critical CSS loading
  function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  // Preload critical fonts
  function preloadFont(fontFamily, src) {
    const font = new FontFace(fontFamily, `url(${src})`);
    font.load().then(() => {
      document.fonts.add(font);
    });
  }

  // Minimize layout shifts
  function reserveSpaceForImages() {
    document.querySelectorAll('img').forEach(img => {
      if (img.naturalWidth === 0) {
        img.style.aspectRatio = '4/3';
        img.style.backgroundColor = '#f3f4f6';
      }
    });
  }

  // Initialize performance optimizations
  document.addEventListener('DOMContentLoaded', () => {
    reserveSpaceForImages();
  });

})();