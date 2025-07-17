const styleConfig = {
    'Assets-Collage/collage-edited.html': {
        luarColor: '#14ae5c',
        aiColor: '#ffa723',
        navColor: '#009e75',
        font: 'Poppins'
    },
    'Assets-Corporate-page/corporate-edited.html': {
        luarColor: '#ffffff',
        aiColor: '#7b55f0',
        navColor: '#ffffff',
        font: 'Roboto'
    },
    'Assets-Cartoon-page/cartoon-edited.html': {
        luarColor: '#453850',
        aiColor: '#7572a9',
        navColor: '#453850',
        font: 'Nunito'
    },
    'Assets-Van-Gogh-Style/vangogh-edited.html': {
        luarColor: '#ffffff',
        aiColor: '#ffd483',
        navColor: '#ffffff',
        font: 'Montserrat'
    },
    'Assets-Da-Vinci-Style-page/davinci-edited.html': {
        luarColor: '#423219',
        aiColor: '#072959',
        navColor: '#072959',
        font: 'Libre Baskerville'
    },
    'about': {
        luarColor: '#ffffff',
        aiColor: '#EC4899',
        navColor: '#ffffff',
        font: 'Poppins'
    }
};

function updateHeaderStyle(page) {
    const config = styleConfig[page];
    if (!config) return;

    const luarElement = document.querySelector('.logo-luar');
    const aiElement = document.querySelector('.logo-ai');
    const navElements = document.querySelectorAll('.main-nav a');

    luarElement.style.color = config.luarColor;
    aiElement.style.color = config.aiColor;
    
    luarElement.style.fontFamily = 'Quicksand, sans-serif';
    aiElement.style.fontFamily = 'Orbit, sans-serif';

    navElements.forEach(nav => {
        nav.style.color = config.navColor;
        nav.style.fontFamily = `${config.font}, sans-serif`;
    });
}

function initializeHeader() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');

    if (hamburgerMenu && mainNav) {
        const toggleMenu = (event) => {
            event.preventDefault(); // Prevents both touch and click firing on some devices
            mainNav.classList.toggle('active');
        };

        // Remove old listeners to prevent duplicates
        hamburgerMenu.removeEventListener('click', toggleMenu);
        hamburgerMenu.removeEventListener('touchstart', toggleMenu);

        // Add new listeners
        hamburgerMenu.addEventListener('click', toggleMenu);
        hamburgerMenu.addEventListener('touchstart', toggleMenu);
    }
}

// Initialize header on initial load
document.addEventListener('DOMContentLoaded', initializeHeader);
