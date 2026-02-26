// ========================================
// ETERNIT COLOMBIA — Modern Redesign JS
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Loader ----
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('locked');
        animateHero();
    }, 1800);

    // ---- Navigation scroll effect ----
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ---- Mobile menu ----
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    navToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('active', menuOpen);
        document.body.classList.toggle('locked', menuOpen);

        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (menuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            mobileMenu.classList.remove('active');
            document.body.classList.remove('locked');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ---- Hero entrance animation ----
    function animateHero() {
        const heroElements = document.querySelectorAll('.hero [data-animate]');
        heroElements.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
            }, 100);
        });

        // Start counting animation
        setTimeout(animateCounters, 600);
    }

    // ---- Counter animation ----
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };
            requestAnimationFrame(update);
        });
    }

    // ---- Scroll reveal animations ----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with data-animate (except hero ones)
    document.querySelectorAll('[data-animate]').forEach(el => {
        if (!el.closest('.hero')) {
            observer.observe(el);
        }
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Form handling ----
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ri-check-line"></i> Mensaje enviado';
            btn.style.background = '#22c55e';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        });
    }

    // ---- Video player ----
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const videoContainer = document.getElementById('videoContainer');
    const videoIframe = document.getElementById('videoIframe');
    const videoCloseBtn = document.getElementById('videoCloseBtn');
    const videoThumbnail = document.querySelector('.video-thumbnail');
    const videoYouTubeId = 'LbPWZMn3nHo';

    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            videoIframe.src = `https://www.youtube.com/embed/${videoYouTubeId}?autoplay=1&rel=0`;
            videoContainer.style.display = 'block';
            videoThumbnail.style.display = 'none';
        });

        videoThumbnail.addEventListener('click', () => {
            videoPlayBtn.click();
        });

        videoCloseBtn.addEventListener('click', () => {
            videoIframe.src = '';
            videoContainer.style.display = 'none';
            videoThumbnail.style.display = '';
        });
    }

    // ---- Products carousel ----
    const track = document.getElementById('productsTrack');
    const prevBtn = document.getElementById('prodPrev');
    const nextBtn = document.getElementById('prodNext');

    if (track && prevBtn && nextBtn) {
        const chipWidth = 286; // 270px + 16px gap
        let offset = 0;

        const getMaxOffset = () => {
            const visibleWidth = track.parentElement.offsetWidth;
            const totalWidth = track.scrollWidth;
            return Math.max(0, totalWidth - visibleWidth);
        };

        nextBtn.addEventListener('click', () => {
            const max = getMaxOffset();
            offset = Math.min(offset + chipWidth * 2, max);
            track.style.transform = `translateX(-${offset}px)`;
        });

        prevBtn.addEventListener('click', () => {
            offset = Math.max(offset - chipWidth * 2, 0);
            track.style.transform = `translateX(-${offset}px)`;
        });
    }

    // ---- Parallax on hero background ----
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroPattern = document.querySelector('.hero-pattern');
        if (heroPattern && scrolled < window.innerHeight) {
            heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });

});
