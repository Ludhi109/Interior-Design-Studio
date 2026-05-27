/* ==========================================================================
   AURA ATELIER - LUXURY INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. CUSTOM TRAILING CURSOR EFFECT
    // ----------------------------------------------------------------------
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    if (cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;     // Current mouse coordinates
        let outlineX = 0, outlineY = 0; // Trailing outline coordinates
        const lerpSpeed = 0.15;          // Smoothness coefficient
        let isMoving = false;
        
        // Show cursor elements on mouse move
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                cursorDot.style.opacity = '1';
                cursorOutline.style.opacity = '1';
                isMoving = true;
            }
            
            // Instantly position the dot
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        });

        // Hide cursor elements when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
            isMoving = false;
        });
        
        // Lerp loop for trailing outline using requestAnimationFrame
        const animateCursorOutline = () => {
            outlineX += (mouseX - outlineX) * lerpSpeed;
            outlineY += (mouseY - outlineY) * lerpSpeed;
            
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursorOutline);
        };
        requestAnimationFrame(animateCursorOutline);
        
        // Add interactive hover listeners for standard buttons/links
        const hoverTargets = document.querySelectorAll('a, button, input[type="submit"], select, .filter-btn, .bullet');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-active');
            });
            target.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-active');
            });
        });
        
        // Add interactive hover listeners for project cards
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-gallery-hover');
            });
            item.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-gallery-hover');
            });
        });
    }

    // ----------------------------------------------------------------------
    // 2. FLOATING STICKY HEADER & SCROLL INDICATOR HIDE
    // ----------------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.getElementById('scrollIndicator');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Sticky Navbar
        if (scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
        
        // Fade out Scroll Indicator
        if (scrollIndicator) {
            if (scrollY > 150) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    });

    // ----------------------------------------------------------------------
    // 3. MOBILE HAMBURGER MENU TOGGLE
    // ----------------------------------------------------------------------
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');
    
    if (hamburgerMenu && navLinks) {
        const toggleMenu = () => {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };
        
        hamburgerMenu.addEventListener('click', toggleMenu);
        
        // Close menu when clicking links
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 4. PARALLAX HERO BACKGROUND
    // ----------------------------------------------------------------------
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            // Move background down slightly slower to produce a parallax effect
            heroBg.style.transform = `scale(1.05) translate3d(0, ${scrollY * 0.4}px, 0)`;
        });
    }

    // ----------------------------------------------------------------------
    // 5. INTERSECTION OBSERVER FOR SCROLL REVEALS & STATS COUNTERS
    // ----------------------------------------------------------------------
    const scrollReveals = document.querySelectorAll('.scroll-reveal');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Config for observers
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);
    
    scrollReveals.forEach(element => {
        revealObserver.observe(element);
    });
    
    // Stats counter animation observer
    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // Animation duration in ms
        const stepTime = 30; // Step refresh time
        const steps = Math.ceil(duration / stepTime);
        const increment = target / steps;
        
        let current = 0;
        let stepCount = 0;
        
        const timer = setInterval(() => {
            current += increment;
            stepCount++;
            
            if (stepCount >= steps) {
                element.innerText = target;
                clearInterval(timer);
            } else {
                element.innerText = Math.floor(current);
            }
        }, stepTime);
    };
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // Count once
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => {
        statsObserver.observe(num);
    });

    // ----------------------------------------------------------------------
    // 6. PORTFOLIO FILTER GALLERY
    // ----------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItemsList = document.querySelectorAll('.project-item');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectItemsList.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Hide with transition, then toggle display class
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    // Force a layout reflow for CSS opacity animation to re-trigger
                    void item.offsetWidth;
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    // Delay setting display class to allow transition to complete
                    setTimeout(() => {
                        if (btn.getAttribute('data-filter') === filterValue) {
                            item.classList.add('hide');
                        }
                    }, 400);
                }
            });
        });
    });

    // ----------------------------------------------------------------------
    // 7. SCROLL-LINKED PROCESS GRID PROGRESS
    // ----------------------------------------------------------------------
    const processContainer = document.querySelector('.process-grid-container');
    const processLineFill = document.getElementById('processLineFill');
    const processItems = document.querySelectorAll('.process-item');
    
    if (processContainer && processLineFill) {
        const updateProcess = () => {
            const rect = processContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Percentage calculation
            // Starts when container top is at 75% viewport height
            const triggerStart = windowHeight * 0.75;
            const scrollDistance = triggerStart - rect.top;
            const totalHeight = rect.height;
            
            let progress = (scrollDistance / totalHeight) * 100;
            progress = Math.min(100, Math.max(0, progress)); // clamp
            
            processLineFill.style.width = `${progress}%`;
            
            // Activate nodes individually as they scroll past trigger threshold
            processItems.forEach((item, idx) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.top + itemRect.height / 3;
                
                if (itemCenter < windowHeight * 0.75) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };
        
        window.addEventListener('scroll', updateProcess);
        window.addEventListener('resize', updateProcess);
        updateProcess(); // Initial run
    }

    // ----------------------------------------------------------------------
    // 8. TESTIMONIALS CAROUSEL SLIDER
    // ----------------------------------------------------------------------
    const slides = document.querySelectorAll('.testimonial-slide');
    const bullets = document.querySelectorAll('.slider-bullets .bullet');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (slides.length > 0) {
        let currentIdx = 0;
        let slideInterval;
        const cycleTime = 6000; // Auto scroll duration
        
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            bullets.forEach(bullet => bullet.classList.remove('active'));
            
            // Loop boundaries
            if (index >= slides.length) currentIdx = 0;
            else if (index < 0) currentIdx = slides.length - 1;
            else currentIdx = index;
            
            slides[currentIdx].classList.add('active');
            if (bullets[currentIdx]) bullets[currentIdx].classList.add('active');
        };
        
        const nextSlide = () => showSlide(currentIdx + 1);
        const prevSlide = () => showSlide(currentIdx - 1);
        
        const startAutoCycle = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, cycleTime);
        };
        
        // Navigation button listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoCycle();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoCycle();
            });
        }
        
        // Bullet click listeners
        bullets.forEach(bullet => {
            bullet.addEventListener('click', () => {
                const targetIdx = parseInt(bullet.getAttribute('data-index'));
                showSlide(targetIdx);
                startAutoCycle();
            });
        });
        
        // Initiate carousel
        showSlide(0);
        startAutoCycle();
    }

    // ----------------------------------------------------------------------
    // 9. ELEGANT FORM SUBMISSIONS & VALIDATIONS
    // ----------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    
    if (contactForm && formFeedback) {
         contactForm.addEventListener('submit', (e) => {
             e.preventDefault();
             
             const submitBtn = document.getElementById('submitBtn');
             const submitBtnText = submitBtn.querySelector('span');
             
             // Simple visual loading state
             submitBtn.style.pointerEvents = 'none';
             submitBtnText.innerText = 'Sending Inquiry...';
             
             setTimeout(() => {
                 // Success message response
                 formFeedback.innerText = 'Thank you! Your inquiry was successfully received. Our studio will connect with you shortly.';
                 formFeedback.className = 'form-feedback-message success show';
                 
                 // Clear fields
                 contactForm.reset();
                 
                 // Restore button
                 submitBtn.style.pointerEvents = 'auto';
                 submitBtnText.innerText = 'Send Inquiry';
                 
                 // Fade feedback out after duration by removing the show class
                 setTimeout(() => {
                     formFeedback.classList.remove('show');
                 }, 6000);
             }, 1500);
         });
    }
    
    // Newsletter Submit
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    
    if (newsletterForm && newsletterFeedback) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputField = newsletterForm.querySelector('.newsletter-input');
            inputField.disabled = true;
            
            setTimeout(() => {
                newsletterFeedback.innerText = 'Successfully Subscribed to Journal.';
                newsletterFeedback.classList.add('active');
                
                inputField.value = '';
                inputField.disabled = false;
                
                setTimeout(() => {
                    newsletterFeedback.classList.remove('active');
                }, 4000);
            }, 1000);
        });
    }
});
