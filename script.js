const pages = [
    'Assets-Collage/collage-edited.html',
    'Assets-Corporate-page/corporate-edited.html',
    'Assets-Cartoon-page/cartoon-edited.html',
    'Assets-Van-Gogh-Style/vangogh-edited.html',
    'Assets-Da-Vinci-Style-page/davinci-edited.html'
];

let currentIndex = 1; // Start at the first real slide
let isTransitioning = false;
let autoSlideInterval;

const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');

function loadPages() {
    const slides = pages.map(page => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        const iframe = document.createElement('iframe');
        iframe.src = page;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        slide.appendChild(iframe);
        return slide;
    });

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    carouselContainer.appendChild(lastClone);
    slides.forEach(slide => carouselContainer.appendChild(slide));
    carouselContainer.appendChild(firstClone);

    updateCarousel(false); // Initial position without transition
}

function updateCarousel(transition = true) {
    if (transition) {
        carouselContainer.style.transition = 'transform 0.5s ease-in-out';
    } else {
        carouselContainer.style.transition = 'none';
    }
    const offset = -currentIndex * 100;
    carouselContainer.style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentIndex += direction;
    updateCarousel();

    // Update header style for the visible slide
    let headerIndex = (currentIndex - 1 + pages.length) % pages.length;
    if (direction === 1 && currentIndex === pages.length + 1) {
        headerIndex = 0;
    } else if (direction === -1 && currentIndex === 0) {
        headerIndex = pages.length - 1;
    }
    updateHeaderStyle(pages[headerIndex]);

}

carouselContainer.addEventListener('transitionend', () => {
    if (currentIndex === 0) {
        currentIndex = pages.length;
        updateCarousel(false);
    } else if (currentIndex === pages.length + 1) {
        currentIndex = 1;
        updateCarousel(false);
    }
    isTransitioning = false;
});

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveSlide(1);
    }, 8000); // Change slide every 8 seconds
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPages();
    startAutoSlide();

    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Initialize header for the first real slide
    // Set the correct initial header style
    if (typeof updateHeaderStyle === 'function') {
        updateHeaderStyle(pages[0]); // pages[0] is the first slide
    }
});
