const pages = [
    'Assets-Collage/collage-edited.html',
    'Assets-Corporate-page/corporate-edited.html',
    'Assets-Cartoon-page/cartoon-edited.html',
    'Assets-Van-Gogh-Style/vangogh-edited.html',
    'Assets-Da-Vinci-Style-page/davinci-edited.html'
];

let currentIndex = 0;

const carouselContainer = document.querySelector('.carousel-container');

function loadPages() {
    pages.forEach(page => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        const iframe = document.createElement('iframe');
        iframe.src = page;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        slide.appendChild(iframe);
        carouselContainer.appendChild(slide);
    });
    updateCarousel();
}

function updateCarousel() {
    const offset = -currentIndex * 100;
    carouselContainer.style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + pages.length) % pages.length;
    updateCarousel();
    updateHeaderStyle(pages[currentIndex]);
}

document.addEventListener('DOMContentLoaded', loadPages);
