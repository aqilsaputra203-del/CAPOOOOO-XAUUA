// ========================================
// Capo XAU - Premium Interactive Script
// Bidirectional Scroll Animations
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ====== PAGE LOADER ======
    const loader = document.getElementById('page-loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 600);
        });
        setTimeout(() => loader.classList.add('hidden'), 3000);
    }

    // ====== FLOATING PARTICLES ======
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.3;
                this.speedY = -(Math.random() * 0.25 + 0.05);
                this.speedX = (Math.random() - 0.5) * 0.15;
                this.opacity = Math.random() * 0.4 + 0.05;
                this.fadeSpeed = Math.random() * 0.002 + 0.0005;
                this.growing = Math.random() > 0.5;
                const isPurple = Math.random() > 0.25;
                if (isPurple) { this.r = 168; this.g = 85; this.b = 247; }
                else { this.r = 245; this.g = 158; this.b = 11; }
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.5) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.02) this.reset();
                }
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                    this.y = canvas.height + 10;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor(window.innerWidth * 0.05), 35);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => { resizeCanvas(); initParticles(); }, 250);
        });
    }

    // ====== SCROLL PROGRESS BAR ======
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }, { passive: true });
    }

    // ====== HEADER SCROLL EFFECT ======
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }, { passive: true });
    }

    // ====== MOBILE DRAWER MENU ======
    const menuBtn = document.getElementById('menu-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    function openMenu() {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ====== BIDIRECTIONAL SCROLL ANIMATIONS ======
    // Elements animate IN when scrolling into view,
    // and animate OUT when scrolling away from view.
    const animElements = document.querySelectorAll('.anim-element');
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    // Track scroll direction
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;
    }, { passive: true });

    // Create observer for elements entering viewport
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

            if (entry.isIntersecting) {
                // Element is entering viewport — animate IN
                setTimeout(() => {
                    el.classList.remove('anim-exit-up', 'anim-exit-down');
                    el.classList.add('anim-visible');
                }, delay);
            } else {
                // Element is leaving viewport — animate OUT
                if (el.classList.contains('anim-visible')) {
                    el.classList.remove('anim-visible');

                    // Determine exit direction based on where element left
                    const rect = el.getBoundingClientRect();
                    if (rect.top < 0) {
                        // Element left through the top
                        el.classList.remove('anim-exit-down');
                        el.classList.add('anim-exit-up');
                    } else {
                        // Element left through the bottom
                        el.classList.remove('anim-exit-up');
                        el.classList.add('anim-exit-down');
                    }
                }
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '20px 0px -20px 0px'
    });

    animElements.forEach(el => animObserver.observe(el));

    // ====== STATS COUNTER ANIMATION ======
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterDone = new Set();

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterDone.has(entry.target)) {
                const el = entry.target;
                counterDone.add(el);
                const target = parseInt(el.getAttribute('data-target'), 10);
                const suffix = el.getAttribute('data-suffix') || '';
                animateCounter(el, target, suffix);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 50;
        const stepTime = 1200 / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            let display = Math.floor(current);
            if (target >= 1000) display = display.toLocaleString('id-ID');
            element.textContent = display + suffix;
        }, stepTime);
    }

    // ====== TILT EFFECT ON CARDS (desktop only) ======
    if (window.matchMedia('(hover: hover)').matches) {
        const tiltCards = document.querySelectorAll('.service-card, .broker-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;
                card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ====== PARALLAX BACKGROUND on scroll ======
    const bgImageLayer = document.querySelector('.bg-image-layer');
    if (bgImageLayer) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(scrollY / maxScroll, 1);

            // Slow parallax movement + subtle opacity change
            const translateY = progress * -15;
            const scale = 1 + progress * 0.12;
            const opacity = 0.45 + progress * 0.2;

            bgImageLayer.style.transform = `translateY(${translateY}%) scale(${scale})`;
            bgImageLayer.style.opacity = opacity;
        }, { passive: true });
    }

    // ====== SMOOTH ANCHOR SCROLL ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('✨ Capo XAU Premium Website Loaded');
});
