// Mobile Menu Toggle Script
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Enhanced 3 Separate Carousels with Auto-rotation and Manual Control
let carouselStates = {
    testimonial: { currentSlide: 0, totalSlides: 6, autoInterval: null }, // 6 testimoni
    images: { currentSlide: 0, totalSlides: 3, autoInterval: null },      // 3 gambar
    videos: { currentSlide: 0, totalSlides: 4, autoInterval: null }       // 4 video
};

function updateCarousel(type, slideIndex) {
    const track = document.querySelector(`.${type}-track`);
    const indicators = document.querySelectorAll(`.${type}-carousel-container .carousel-indicator`);
    
    if (!track) {
        console.log(`Track not found for ${type}`);
        return;
    }
    
    // Update transform
    const translateX = -slideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // Update state
    carouselStates[type].currentSlide = slideIndex;
    
    console.log(`Updated ${type} carousel to slide ${slideIndex}`);
}

function navigateCarousel(type, direction) {
    const state = carouselStates[type];
    let newSlide = state.currentSlide + direction;
    
    // Loop around
    if (newSlide >= state.totalSlides) {
        newSlide = 0;
    } else if (newSlide < 0) {
        newSlide = state.totalSlides - 1;
    }
    
    updateCarousel(type, newSlide);
    
    // Pause auto-rotation temporarily
    clearAutoRotation(type);
    setTimeout(() => startAutoRotation(type), 5000); // Resume after 5 seconds
}

function goToSlide(type, slideIndex) {
    updateCarousel(type, slideIndex);
    
    // Pause auto-rotation temporarily
    clearAutoRotation(type);
    setTimeout(() => startAutoRotation(type), 5000);
}

function startAutoRotation(type) {
    clearAutoRotation(type); // Clear existing interval
    
    carouselStates[type].autoInterval = setInterval(() => {
        const state = carouselStates[type];
        let nextSlide = state.currentSlide + 1;
        
        if (nextSlide >= state.totalSlides) {
            nextSlide = 0;
        }
        
        updateCarousel(type, nextSlide);
    }, getAutoRotationDelay(type));
}

function clearAutoRotation(type) {
    if (carouselStates[type].autoInterval) {
        clearInterval(carouselStates[type].autoInterval);
        carouselStates[type].autoInterval = null;
    }
}

function getAutoRotationDelay(type) {
    switch(type) {
        case 'testimonial': return 10000; // 10 seconds
        case 'images': return 10000; // 10 seconds
        case 'videos': return 25000; // 25 seconds
        default: return 10000;
    }
}

// Initialize carousels when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing 3 separate carousels');
    
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        // Initialize all carousels
        Object.keys(carouselStates).forEach(type => {
            updateCarousel(type, 0);
            startAutoRotation(type);
        });
        
        // Add hover pause/resume functionality
        const carousels = document.querySelectorAll('.testimonial-carousel-container, .images-carousel-container, .videos-carousel-container');
        
        carousels.forEach(carousel => {
            let carouselType;
            if (carousel.classList.contains('testimonial-carousel-container')) carouselType = 'testimonial';
            else if (carousel.classList.contains('images-carousel-container')) carouselType = 'images';
            else if (carousel.classList.contains('videos-carousel-container')) carouselType = 'videos';
            
            if (carouselType) {
                carousel.addEventListener('mouseenter', () => {
                    clearAutoRotation(carouselType);
                });
                
                carousel.addEventListener('mouseleave', () => {
                    startAutoRotation(carouselType);
                });
            }
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                navigateCarousel('testimonial', -1);
            } else if (e.key === 'ArrowRight') {
                navigateCarousel('testimonial', 1);
            }
        });
        
        console.log('All carousels initialized successfully');
    }, 100);
});

// Make functions globally available for onclick handlers
window.navigateCarousel = navigateCarousel;
window.goToSlide = goToSlide;

// FAQ Toggle Functionality - Dengan border orange dan padding
function toggleFAQ(faqNumber) {
    const content = document.getElementById(`faq-content-${faqNumber}`);
    const icon = document.getElementById(`faq-icon-${faqNumber}`);
    const container = content.parentElement;
    const button = container.querySelector('button');
    
    if (!content || !icon) return;
    
    const isCurrentlyOpen = !content.classList.contains('hidden');
    
    // Remove active classes from all FAQ items
    for (let i = 1; i <= 15; i++) {
        const otherContent = document.getElementById(`faq-content-${i}`);
        const otherIcon = document.getElementById(`faq-icon-${i}`);
        const otherContainer = document.getElementById(`faq-content-${i}`)?.parentElement;
        
        if (otherContent && otherIcon && otherContainer) {
            // Remove active classes
            otherContainer.classList.remove('faq-active', 'faq-pulse');
            otherIcon.classList.remove('faq-icon-active');
            
            // Close with smooth animation
            if (!otherContent.classList.contains('hidden') && i !== faqNumber) {
                otherContent.style.maxHeight = otherContent.scrollHeight + 'px';
                otherContent.offsetHeight; // Force reflow
                otherContent.style.maxHeight = '0px';
                otherContent.style.opacity = '0';
                
                // Reset icon
                otherIcon.textContent = '+';
                otherIcon.style.transform = 'rotate(0deg)';
                
                // Hide after animation
                setTimeout(() => {
                    otherContent.classList.add('hidden');
                    otherContent.style.maxHeight = '';
                    otherContent.style.opacity = '';
                }, 300);
            }
        }
    }
    
    // Toggle current FAQ
    if (isCurrentlyOpen) {
        // Close current FAQ
        container.classList.remove('faq-active', 'faq-pulse');
        icon.classList.remove('faq-icon-active');
        
        content.style.maxHeight = content.scrollHeight + 'px';
        content.offsetHeight; // Force reflow
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
        
        setTimeout(() => {
            content.classList.add('hidden');
            content.style.maxHeight = '';
            content.style.opacity = '';
        }, 300);
    } else {
        // Open current FAQ dengan border orange dan padding
        container.classList.add('faq-active', 'faq-pulse');
        icon.classList.add('faq-icon-active');
        
        content.classList.remove('hidden');
        content.style.maxHeight = '0px';
        content.style.opacity = '0';
        content.offsetHeight; // Force reflow
        
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
        
        // Clean up after animation
        setTimeout(() => {
            content.style.maxHeight = 'none';
        }, 300);
        
        // Remove pulse class after animation
        setTimeout(() => {
            container.classList.remove('faq-pulse');
        }, 600);
        
        console.log(`FAQ ${faqNumber} opened with enhanced padding`);
    }
}

// Make function globally available
window.toggleFAQ = toggleFAQ;

// Document overlay functionality - Fixed version
function showDocument(fileName) {
    const overlay = document.getElementById('document-overlay');
    const image = document.getElementById('document-image');
    const title = document.getElementById('document-title');
    
    if (!overlay || !image || !title) {
        console.error('Document overlay elements not found');
        return;
    }
    
    // Set image source
    image.src = `images/${fileName}`;
    
    // Set title based on filename
    const titles = {
        'CE-VTMHY2304000667YEA.jpg': 'Sertifikat CE Compliance - SGS',
        'FCC-VTMHY2304000668YEA.jpg': 'Sertifikat FCC Compliance - SGS',
        'SZXEC24000468401SZP24-006976-page-1-page-0001.jpg': 'Sertifikat RoHS Compliance - SGS',
        'Spesifikasi.png': 'Spesifikasi Produk emGuarde™',
        'Carakerja.png': 'Cara Kerja emGuarde™',
        '240710-USM-Test-report-for-emGuarde-page-0001.jpg': 'Laporan Uji USM - emGuarde™'
    };
    
    title.textContent = titles[fileName] || 'Dokumen emGuarde™';
    
    // Reset image properties
    image.style.width = '';
    image.style.height = '';
    image.style.maxWidth = '100%';
    image.style.maxHeight = '100%';
    image.style.objectFit = 'contain';
    
    // Show overlay with fade in effect
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    console.log(`Showing document: ${fileName}`);
}

function closeDocument() {
    const overlay = document.getElementById('document-overlay');
    
    if (!overlay) return;
    
    // Fade out effect
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.style.opacity = '';
    }, 200);
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('Document overlay closed');
}

// Close overlay when clicking outside the document
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('document-overlay');
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            // Only close if clicking on the overlay itself, not the document container
            if (e.target === overlay) {
                closeDocument();
            }
        });
    }
    
    // Close overlay with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
            closeDocument();
        }
    });
});

// Initialize FAQ animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add intersection observer for FAQ animations
    const faqItems = document.querySelectorAll('.space-y-4 > div');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    faqItems.forEach((item, index) => {
        // Initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
        
        observer.observe(item);
    });
    
    // Add smooth scroll behavior for FAQ section
    const faqSection = document.querySelector('.space-y-4');
    if (faqSection) {
        faqSection.style.scrollBehavior = 'smooth';
    }
    
    // Existing document overlay code...
    const overlay = document.getElementById('document-overlay');
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeDocument();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
            closeDocument();
        }
    });
});