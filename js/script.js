document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLE (DARK MODE BY DEFAULT)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check cached theme preference
    const cachedTheme = localStorage.getItem('theme');
    if (cachedTheme === 'light') {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // ==========================================================================
    // STICKY HEADER SCROLL SHADOW
    // ==========================================================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.3)';
            header.style.backgroundColor = 'var(--bg-secondary)';
            header.style.paddingHeight = '65px';
        } else {
            header.style.boxShadow = 'none';
            header.style.backgroundColor = 'var(--glass-bg)';
            header.style.paddingHeight = 'var(--header-height)';
        }
    });

    // ==========================================================================
    // MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    };

    const closeMenu = () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside header/menu
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // ==========================================================================
    // ACTIVE NAVIGATION LINKS HIGHLIGHT ON SCROLL
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    
    const activeScrollSpy = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // offset for sticky header
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', activeScrollSpy);

    // ==========================================================================
    // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Instantly display all reveal elements
        revealElements.forEach(el => el.classList.add('revealed'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15, // trigger when 15% of the element is visible
            rootMargin: '0px 0px -50px 0px' // offset trigger point slightly
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ==========================================================================
    // CONTACT FORM INTERACTION
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            
            // Basic check
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Success alert (mock integration)
            alert(`Thank you, ${nameInput.value}! Your message has been sent successfully. I will get in touch with you shortly.`);
            
            // Reset form
            contactForm.reset();
        });
    }

    // ==========================================================================
    // VIDEO LIGHTBOX CONTROLLER
    // ==========================================================================
    const videoModal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');
    const videoTriggers = document.querySelectorAll('[data-video-url]');

    const openVideoModal = (videoUrl) => {
        if (!videoModal || !modalIframe || !videoUrl) return;
        modalIframe.src = videoUrl;
        videoModal.classList.add('active');
        videoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
    };

    const closeVideoModal = () => {
        if (!videoModal || !modalIframe) return;
        videoModal.classList.remove('active');
        videoModal.setAttribute('aria-hidden', 'true');
        modalIframe.src = ''; // reset source to stop playback audio
        document.body.style.overflow = ''; // restore scroll
    };

    // Attach click events to triggers
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const videoUrl = trigger.getAttribute('data-video-url');
            openVideoModal(videoUrl);
        });
    });

    // Close actions
    if (modalClose) modalClose.addEventListener('click', closeVideoModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeVideoModal);
    
    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
});

