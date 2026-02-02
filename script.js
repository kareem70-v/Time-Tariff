// ===================================
// TIME TARIFF - INTERACTIVE FEATURES
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ===================================
    // NAVBAR SCROLL EFFECT
    // ===================================
    const navbar = document.getElementById('navbar');
    const amenitiesSection = document.getElementById('amenities');
    function updateNavbar() {
        const currentScroll = window.scrollY;

        // Calculate trigger point based on amenities section position
        // This ensures the color changes exactly when leaving the home section/entering amenities
        let triggerPoint = window.innerHeight; // Default fallback

        if (amenitiesSection) {
            // Trigger 100px before the amenities section hits the top of the viewport
            // effectively when the user has scrolled past most of the home section
            triggerPoint = amenitiesSection.offsetTop - 100;
        }

        // Add scrolled class when reaching the trigger point
        if (currentScroll >= triggerPoint) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // Initial check
    // Initial check
    updateNavbar();

    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.navbar-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('is-active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        // Note: navLinks are selected in the next section, but we can add a listener here specifically for closing
        // Or better yet, rely on the general click listener we add below for smooth scroll to also close it? 
        // Let's add specific closing logic here for robustness.
        const links = navMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('is-active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ===================================
    // SMOOTH SCROLL FOR NAVIGATION LINKS
    // ===================================
    const navLinks = document.querySelectorAll('.navbar-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===================================
    // HERO VERTICAL SCROLL (CSS ONLY)
    // ===================================
    // The hero image scroll is now handled entirely by CSS keyframes.
    // No JS is needed for the infinite vertical loop.

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // ===================================
    // ACTIVE NAVIGATION HIGHLIGHT
    // ===================================
    function highlightActiveSection() {
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // ===================================
    // LAZY LOADING FOR IMAGES
    // ===================================
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease-in-out';

                // Fade in when loaded
                img.addEventListener('load', function () {
                    img.style.opacity = '1';
                });

                // If already loaded (cached)
                if (img.complete) {
                    img.style.opacity = '1';
                }

                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ===================================
    // PARALLAX EFFECT REMOVED
    // ===================================
    // Parallax logic has been removed to prevent section overlap issues on mobile.

    // ===================================
    // HOVER EFFECTS FOR STORY IMAGE
    // ===================================
    const storyImage = document.querySelector('.story-image-container');

    if (storyImage) {
        storyImage.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.02) rotate(1deg)';
        });

        storyImage.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // ===================================
    // GALLERY IMAGE ZOOM ON CLICK
    // ===================================
    const galleryImage = document.querySelector('.gallery-image-container');

    if (galleryImage) {
        galleryImage.addEventListener('click', function () {
            this.classList.toggle('zoomed');

            if (this.classList.contains('zoomed')) {
                this.style.position = 'fixed';
                this.style.top = '50%';
                this.style.left = '50%';
                this.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.style.zIndex = '9999';
                this.style.maxWidth = '95vw';
                this.style.maxHeight = '95vh';
                this.style.cursor = 'zoom-out';

                // Create overlay
                const overlay = document.createElement('div');
                overlay.id = 'image-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                overlay.style.zIndex = '9998';
                document.body.appendChild(overlay);

                // Close on overlay click
                overlay.addEventListener('click', () => {
                    this.click();
                });
            } else {
                this.style.position = 'relative';
                this.style.top = 'auto';
                this.style.left = 'auto';
                this.style.transform = 'scale(1)';
                this.style.zIndex = 'auto';
                this.style.maxWidth = '100%';
                this.style.maxHeight = 'none';
                this.style.cursor = 'zoom-in';

                // Remove overlay
                const overlay = document.getElementById('image-overlay');
                if (overlay) {
                    overlay.remove();
                }
            }
        });

        // Add cursor pointer
        galleryImage.style.cursor = 'zoom-in';
    }

    // ===================================
    // SOCIAL MEDIA LINK TRACKING
    // ===================================
    const socialLinks = document.querySelectorAll('.social-icon');

    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const platform = this.getAttribute('aria-label');
            console.log(`User clicked on ${platform}`);

            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = '100%';
            ripple.style.height = '100%';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================

    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions
    window.addEventListener('scroll', debounce(highlightActiveSection, 100));

    // ===================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===================================

    // Add keyboard navigation for social links
    socialLinks.forEach(link => {
        link.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Add focus visible styles
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function () {
        document.body.classList.remove('keyboard-navigation');
    });

    // ===================================
    // CONSOLE WELCOME MESSAGE
    // ===================================
    console.log('%c🕐 Welcome to Time Tariff! 🕐', 'font-size: 20px; font-weight: bold; color: #FF6B35;');
    console.log('%cWe charge for time, not food!', 'font-size: 14px; color: #F7B731;');
    console.log('%cVisit us at Bandra West | Call: +91 90820 54243', 'font-size: 12px; color: #4ECDC4;');
});
