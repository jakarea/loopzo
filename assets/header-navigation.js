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

// Language Switcher Functions
function getCurrentLanguage() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Local preview: check pathname or search params
    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
    if (isLocal) {
        if (pathname.startsWith('/de/') || pathname === '/de' || window.location.search.includes('lang=de')) {
            return 'de';
        }
        return 'nl';
    }

    // Production: check hostname domain
    if (hostname.includes('loopzo.de')) {
        return 'de';
    }
    return 'nl'; // default to Dutch
}

function updateLanguageUI() {
    const currentLang = getCurrentLanguage();

    // Update pill buttons (desktop)
    const nlPillBtn = document.getElementById('lang-nl-pill');
    const dePillBtn = document.getElementById('lang-de-pill');

    if (nlPillBtn) {
        if (currentLang === 'nl') {
            nlPillBtn.classList.add('bg-white', 'text-slate-800');
            nlPillBtn.classList.remove('text-white', 'hover:bg-slate-600');
        } else {
            nlPillBtn.classList.remove('bg-white', 'text-slate-800');
            nlPillBtn.classList.add('text-white', 'hover:bg-slate-600');
        }
    }

    if (dePillBtn) {
        if (currentLang === 'de') {
            dePillBtn.classList.add('bg-white', 'text-slate-800');
            dePillBtn.classList.remove('text-white', 'hover:bg-slate-600');
        } else {
            dePillBtn.classList.remove('bg-white', 'text-slate-800');
            dePillBtn.classList.add('text-white', 'hover:bg-slate-600');
        }
    }

    // Update mobile button states
    const mobileNlBtn = document.getElementById('mobile-lang-nl');
    const mobilDeBtn = document.getElementById('mobile-lang-de');

    if (mobileNlBtn) {
        mobileNlBtn.classList.remove('bg-slate-700');
        mobileNlBtn.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-slate-700');

        if (currentLang === 'nl') {
            mobileNlBtn.classList.add('bg-slate-700');
            mobileNlBtn.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-slate-700');
            mobileNlBtn.classList.add('text-white');
        }
    }

    if (mobilDeBtn) {
        mobilDeBtn.classList.remove('bg-slate-700');
        mobilDeBtn.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-slate-700');

        if (currentLang === 'de') {
            mobilDeBtn.classList.add('bg-slate-700');
            mobilDeBtn.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-slate-700');
            mobilDeBtn.classList.add('text-white');
        }
    }
}

function switchLanguage(lang) {
    const hostname = window.location.hostname;
    let pathname = window.location.pathname;
    const search = window.location.search;
    const protocol = window.location.protocol;

    const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');

    // Clean current path from existing German language prefix
    if (pathname.startsWith('/de/')) {
        pathname = pathname.substring(3); // Keep path after /de
    } else if (pathname === '/de') {
        pathname = '/';
    }

    let targetDomain = '';
    let targetPath = pathname;

    if (isLocal) {
        // Local switching using path prefixes
        targetDomain = hostname;
        if (lang === 'de') {
            targetPath = '/de' + (pathname === '/' ? '' : pathname);
        } else {
            targetPath = pathname;
        }
    } else {
        // Production switching using separate domains (no /de in URL)
        if (lang === 'de') {
            targetDomain = 'loopzo.de';
        } else {
            targetDomain = 'loopzo.nl';
        }
        targetPath = pathname;
    }

    // Build target URL
    const targetUrl = `${protocol}//${targetDomain}${targetPath}${search}`;

    console.log('Language Switch:', lang, '-> Redirecting to:', targetUrl);
    window.location.href = targetUrl;
}

// Initialize language UI on page load
document.addEventListener('DOMContentLoaded', function() {
    updateLanguageUI();
});

// Also update immediately in case DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLanguageUI);
} else {
    updateLanguageUI();
}

// Make functions globally available
window.toggleMenu = toggleMenu;
window.toggleMobileMenu = toggleMobileMenu;
window.getCurrentLanguage = getCurrentLanguage;
window.updateLanguageUI = updateLanguageUI;
window.switchLanguage = switchLanguage;
