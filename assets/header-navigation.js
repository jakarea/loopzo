// Header Navigation JavaScript
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');

    if (!menu || !button) {
        console.error('Mobile menu elements not found');
        return;
    }

    console.log('--- toggleMenu called ---');
    console.log('Before toggle:');
    console.log('  menu.style.display:', menu.style.display);
    console.log('  menu.classList.contains("hidden"):', menu.classList.contains('hidden'));
    console.log('  menu.className:', menu.className);

    // Check current state by inline style first (more reliable), then class
    const isCurrentlyHidden = menu.style.display === 'none' || (menu.style.display === '' && menu.classList.contains('hidden'));
    console.log('  isCurrentlyHidden:', isCurrentlyHidden);

    // Force toggle the hidden class and style
    if (isCurrentlyHidden) {
        menu.classList.remove('hidden');
        menu.style.display = 'block';
        button.setAttribute('aria-expanded', 'true');
        console.log('Action: Opening menu');
    } else {
        menu.classList.add('hidden');
        menu.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        console.log('Action: Closing menu');
    }

    console.log('After toggle:');
    console.log('  menu.style.display:', menu.style.display);
    console.log('  menu.classList.contains("hidden"):', menu.classList.contains('hidden'));
    console.log('  menu.className:', menu.className);
    console.log('  aria-expanded:', button.getAttribute('aria-expanded'));
    console.log('------------------------');
}

function toggleMobileMenu(menuId) {
    const menu = document.getElementById(menuId);
    const icon = document.getElementById(menuId + '-icon');

    if (!menu || !icon) {
        console.error('Menu elements not found for:', menuId);
        return;
    }

    menu.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

// Make functions globally available
window.toggleMenu = toggleMenu;
window.toggleMobileMenu = toggleMobileMenu;
