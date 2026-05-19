import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Initialize Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

window.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
    gsap.to(follower, {
        x: e.clientX - 10,
        y: e.clientY - 10,
        duration: 0.3
    });
});

document.querySelectorAll('a, button, .brutal-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.style.width = '80px';
        follower.style.height = '80px';
        follower.style.transform = 'translate(-20px, -20px)';
    });
    el.addEventListener('mouseleave', () => {
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.transform = 'translate(0, 0)';
    });
});

// Splash Screen Animation
const tl = gsap.timeline();

tl.to('.splash-logo span', {
    y: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out'
})
.to('.splash-screen', {
    clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
    duration: 1.5,
    ease: 'expo.inOut',
    delay: 0.5
})
.from('nav', {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
}, "-=0.5")
.from('.hero-title', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out'
}, "-=0.8")
.from('.hero-content', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
}, "-=1");

// Hero Parallax (Refined Alignment)
gsap.to('.hero-bg', {
    yPercent: 15,
    scale: 1.2,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

gsap.to('.hero-title', {
    yPercent: -100, // Move title up but slower to keep it in the sky area longer
    scale: 0.9,
    opacity: 0.8,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});


gsap.to('.hero-over', {
    yPercent: 5,
    scale: 1.1,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// Staggered Reveal for Sections with Liquid Skew
gsap.utils.toArray('section').forEach(section => {
    const q = gsap.utils.selector(section);
    gsap.from(q('.section-title, .bento-item, .glass-panel, .brutal-card, .neo-button'), {
        y: 60,
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: section,
            start: 'top 85%',
        }
    });
});

// Bento Grid Special Interaction
document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            scale: 1.02,
            boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            scale: 1,
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });
});

// Marquee Animation Speed Sync
gsap.to('.marquee-content', {
    xPercent: -50,
    duration: 30,
    ease: 'none',
    repeat: -1
});




// Nav Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Infinite Carousel
const track = document.querySelector('.carousel-track');
const items = track.innerHTML;
track.innerHTML += items + items; // Triple for smooth loop

gsap.to('.carousel-track', {
    xPercent: -33.33,
    duration: 20,
    ease: 'none',
    repeat: -1
});

// Extra Interaction: Liquid Glass Hover
document.querySelectorAll('.liquid-glass').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        gsap.to(card, {
            '--x': `${x}px`,
            '--y': `${y}px`,
            duration: 0.3
        });
    });
});
