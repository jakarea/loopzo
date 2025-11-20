// Enhanced accessibility features
(function() {
  'use strict';

  // Focus trap for mobile menu
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Enhanced keyboard navigation
  document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        const toggleBtn = document.getElementById('mobile-menu-button');
        if (toggleBtn) {
          toggleBtn.click();
        }
      }
    }
  });

  // Add live region for dynamic content announcements
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Enhanced color contrast checker
  function validateColorContrast() {
    const elements = document.querySelectorAll('.text-primary, .text-secondary');
    elements.forEach(el => {
      const styles = window.getComputedStyle(el);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      // Simple contrast ratio calculation would go here
    });
  }

  // Initialize accessibility features
  document.addEventListener('DOMContentLoaded', () => {
    // Focus trap for mobile menu when opened
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          trapFocus(mobileMenu);
        }
      });
    }
  });

})();