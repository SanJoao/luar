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
let loadingProgress = 0;
let isFirstLoad = true;
let imageLoadStartTime = null;

const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');

// Loading Screen Functions
function updateLoadingProgress(progress) {
    const loadingBarFill = document.getElementById('loading-bar-fill');
    const loadingPercentage = document.getElementById('loading-percentage');
    
    if (loadingBarFill && loadingPercentage) {
        loadingBarFill.style.width = `${progress}%`;
        loadingPercentage.textContent = `${Math.round(progress)}%`;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 800);
    }
}

function animateLoadingToPercentage(targetPercentage, duration) {
    const startProgress = loadingProgress;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        loadingProgress = startProgress + (targetPercentage - startProgress) * progress;
        updateLoadingProgress(loadingProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

function checkFirstIframeImagesLoaded(iframe) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const images = iframeDoc.querySelectorAll('img');
        
        if (images.length === 0) {
            // No images, complete loading
            completeLoading();
            return;
        }
        
        imageLoadStartTime = performance.now();
        console.log(`🖼️ Iniciando carga de ${images.length} imágenes...`);
        
        let loadedImages = 0;
        const totalImages = images.length;
        
        function imageLoaded() {
            loadedImages++;
            const imageProgress = (loadedImages / totalImages) * 20; // 20% range from 80% to 100%
            const totalProgress = 80 + imageProgress;
            
            animateLoadingToPercentage(totalProgress, 200);
            
            if (loadedImages === totalImages) {
                completeLoading();
            }
        }
        
        images.forEach(img => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded); // Count errors as loaded to prevent hanging
            }
        });
        
    } catch (error) {
        console.error('Error accessing iframe content:', error);
        completeLoading(); // Complete anyway if we can't access iframe
    }
}

function completeLoading() {
    if (imageLoadStartTime) {
        const loadTime = performance.now() - imageLoadStartTime;
        console.log(`✅ Todas las imágenes cargadas en ${loadTime.toFixed(2)}ms (${(loadTime / 1000).toFixed(2)}s)`);
    }
    
    animateLoadingToPercentage(100, 300);
    setTimeout(() => {
        hideLoadingScreen();
        isFirstLoad = false;
    }, 500);
}

function loadPages() {
    // Animate quickly to 80%
    animateLoadingToPercentage(80, 800);
    
    const slides = pages.map((page, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        
        const iframe = document.createElement('iframe');
        // Load ALL iframes from the start to prevent reloading
        iframe.src = page;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        // Monitor first iframe load for loading screen
        if (index === 0 && isFirstLoad) {
            iframe.addEventListener('load', () => {
                checkFirstIframeImagesLoaded(iframe);
            });
        }
        
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
