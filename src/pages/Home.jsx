import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

import { Link } from 'react-router-dom';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | success | error
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const heroRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // ── 1. Smooth Scroll (Lenis) ──────────────────────────────────────────────
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // ── 2. Premium Dual-Layer Cursor ──────────────────────────────────────────
    const ring = document.querySelector('.cursor-ring');
    const dot = document.querySelector('.cursor-dot');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', moveCursor);

    // Ring follows with lag
    const tickRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(tickRing);
    };
    tickRing();

    // Cursor grows on hover
    const hoverEls = document.querySelectorAll('a, button, .cursor-grow');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 2.5, opacity: 0.6, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 0, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      });
    });

    // ── 3. Enhanced Splash Screen ─────────────────────────────────────────────
    const tl = gsap.timeline();
    tl.to('.splash-progress', { width: '100%', duration: 1.6, ease: 'power2.inOut' })
      .to('.splash-text span', { y: 0, stagger: 0.12, duration: 1.0, ease: 'expo.out' }, '-=1.0')
      .to('.splash-counter', { innerHTML: 100, snap: { innerHTML: 1 }, duration: 1.4, ease: 'power2.inOut' }, '<')
      .to('.splash-screen', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut', delay: 0.3 })
      .set('.splash-screen', { visibility: 'hidden' })
      .fromTo('.hero-title-group h1', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out' }, '-=0.4')
      .fromTo('.hero-details-group p', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }, '-=0.9')
      .fromTo('.hero-details-group button', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power3.out' }, '-=0.8');

    // ── 4. Hero Parallax ──────────────────────────────────────────────────────
    const heroTl = gsap.timeline({ scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1 } });
    heroTl.to('.hero-bg', { yPercent: 30, scale: 1.1, ease: 'none' }, 0);
    heroTl.to('.hero-title-group', { y: -100, opacity: 0, scale: 0.95, ease: 'power1.in' }, 0);
    heroTl.to('.hero-details-group', { y: -50, opacity: 0, ease: 'power1.in' }, 0);
    heroTl.to('.hero-over', { yPercent: 10, scale: 1.05, ease: 'none' }, 0);

    // ── 5. 3D Perspective Reveals ─────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((elem) => {
      gsap.fromTo(elem,
        { y: 80, opacity: 0, rotateX: 12, scale: 0.96, transformPerspective: 800 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: elem, start: 'top 92%' }
        }
      );
    });

    // ── 6. Staggered Grid with 3D ─────────────────────────────────────────────
    gsap.utils.toArray('.stagger-grid').forEach((grid) => {
      gsap.fromTo(grid.children,
        { y: 60, opacity: 0, rotateY: 8, transformPerspective: 600 },
        {
          y: 0, opacity: 1, rotateY: 0, stagger: 0.18, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 85%' }
        }
      );
    });

    // ── 7. Clip-Path Mask Reveal ──────────────────────────────────────────────
    gsap.utils.toArray('.mask-reveal').forEach((mask) => {
      gsap.fromTo(mask,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut',
          scrollTrigger: { trigger: mask, start: 'top 85%' }
        }
      );
    });

    // ── 8. Text Highlight Sweep ───────────────────────────────────────────────
    gsap.utils.toArray('.highlight-text').forEach((text) => {
      gsap.fromTo(text,
        { backgroundSize: '0% 100%' },
        {
          backgroundSize: '100% 100%', duration: 1, ease: 'power2.inOut',
          scrollTrigger: { trigger: text, start: 'top 80%' }
        }
      );
    });

    // ── 9. Word Stagger Reveal ────────────────────────────────────────────────
    gsap.utils.toArray('.stagger-word').forEach((text) => {
      const words = text.innerText.split(' ');
      text.innerHTML = words.map(w => `<span class="inline-block">${w}&nbsp;</span>`).join('');
      gsap.from(text.querySelectorAll('span'), {
        y: 30, opacity: 0, rotateX: 15, stagger: 0.04, duration: 0.9, ease: 'power3.out',
        transformPerspective: 400,
        scrollTrigger: { trigger: text, start: 'top 90%' }
      });
    });

    // ── 10. Timeline items slide-in ───────────────────────────────────────────
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      const dir = i % 2 === 0 ? -60 : 60;
      gsap.fromTo(item,
        { x: dir, opacity: 0, scale: 0.9 },
        {
          x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 88%' }
        }
      );
    });

    // ── 11. Horizontal Scroll Strip (features marquee) ────────────────────────
    gsap.utils.toArray('.h-scroll-track').forEach(track => {
      gsap.to(track, {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
      });
    });

    // ── 11b. Pinned Horizontal Storytelling (Heritage) ──────────────────────
    const heritagePin = document.querySelector('#heritage');
    const heritageTrack = document.querySelector('.heritage-track');
    if (heritagePin && heritageTrack) {
      const getScrollAmount = () => -(heritageTrack.scrollWidth - window.innerWidth);

      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: heritagePin,
          start: 'top top',
          end: () => `+=${heritageTrack.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      pinTl.to(heritageTrack, {
        x: getScrollAmount,
        ease: 'none'
      }, 0);

      gsap.utils.toArray('.heritage-image').forEach(img => {
        pinTl.to(img, {
          xPercent: 30,
          ease: 'none'
        }, 0);
      });

      // Force refresh to calculate scrollWidth after DOM paint
      setTimeout(() => ScrollTrigger.refresh(), 100);
      setTimeout(() => ScrollTrigger.refresh(), 1000); // Added for safety on mobile load
    }

    // ── 12. Card 3D Tilt on Hover ────────────────────────────────────────────
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, { rotateY: x * 18, rotateX: -y * 18, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });

    // ── 13. Navbar Color Switch ───────────────────────────────────────────────
    ScrollTrigger.create({
      start: 'top -100',
      onEnter: () => gsap.to('.main-header', { backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', duration: 0.3 }),
      onLeaveBack: () => gsap.to('.main-header', { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', duration: 0.3 })
    });

    // ── 14. Magnetic Buttons ──────────────────────────────────────────────────
    document.querySelectorAll('button, .cursor-pointer').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }));
    });

    // ── 15. Section SEO hash update ───────────────────────────────────────────
    const sectionMeta = {
      '': { title: 'K.M.S.V. L.P.S. Kutticode | Home', hash: '' },
      'about': { title: 'About Us | K.M.S.V. L.P.S. Kutticode', hash: '#about' },
      'heritage': { title: 'Heritage & Legacy | K.M.S.V. L.P.S. Kutticode', hash: '#heritage' },
      'academics': { title: 'Academics & Special Coaching | K.M.S.V. L.P.S. Kutticode', hash: '#academics' },
      'infrastructure': { title: 'Smart Infrastructure & Facilities | K.M.S.V. L.P.S. Kutticode', hash: '#infrastructure' },
      'gallery': { title: 'School Activity Gallery | K.M.S.V. L.P.S. Kutticode', hash: '#gallery' },
      'community': { title: 'Community & Welfare | K.M.S.V. L.P.S. Kutticode', hash: '#community' },
      'admissions': { title: 'Admissions Open | K.M.S.V. L.P.S. Kutticode', hash: '#admissions' },
      'contact': { title: 'Contact Us | K.M.S.V. L.P.S. Kutticode', hash: '#contact' },
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const meta = sectionMeta[entry.target.id || ''];
          if (meta && window.location.hash !== meta.hash) {
            document.title = meta.title;
            history.replaceState(null, meta.title, window.location.pathname + meta.hash);
          }
        }
      });
    }, { threshold: 0.4 });
    ['about', 'heritage', 'academics', 'infrastructure', 'gallery', 'community', 'admissions', 'contact'].forEach(id => {
      const el = document.getElementById(id); if (el) sectionObserver.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      lenis.destroy(); lenisRef.current = null;
      sectionObserver.disconnect();
      ScrollTrigger.getAll().forEach(t => t.revert());
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    // Prevent URL hash from updating
    const currentUrl = window.location.pathname;
    if (targetId === 'top') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, {
          duration: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      history.replaceState(null, '', currentUrl);
      return;
    }
    const target = document.querySelector(targetId);
    if (!target) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: -100,
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    // Keep URL clean — no hash update
    history.replaceState(null, '', currentUrl);
  };

  return (
    <div ref={containerRef} className="relative bg-background overflow-x-hidden selection:bg-primary selection:text-white" style={{ cursor: 'none' }}>

      {/* Premium Dual-Layer Cursor */}
      <div className="cursor-ring hidden md:block fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-primary pointer-events-none z-[9999]" style={{ transform: 'translate(-50%,-50%)', mixBlendMode: 'difference' }} />
      <div className="cursor-dot hidden md:block fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999]" style={{ transform: 'translate(-50%,-50%)' }} />

      {/* Enhanced Splash Screen with Progress Bar */}
      <div className="splash-screen fixed inset-0 z-[100] bg-on-background flex flex-col items-center justify-center overflow-hidden" style={{ clipPath: 'inset(0 0 0% 0)' }}>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
          <div className="splash-progress h-full bg-primary" style={{ width: '0%' }} />
        </div>
        <div className="absolute bottom-8 right-10 text-white/30 font-mono text-sm">
          <span className="splash-counter">0</span>%
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(158,61,0,0.15)_0%,transparent_60%)] pointer-events-none" />
        <h1 className="splash-text text-white text-7xl md:text-[11rem] font-headline font-bold overflow-hidden tracking-tighter">
          {['K', 'M', 'S', 'V'].map((char, i) => (
            <span key={i} className="inline-block transform translate-y-full">{char}</span>
          ))}
        </h1>
        <p className="text-white/30 uppercase tracking-[0.4em] text-xs mt-6">Est. 1932 · Kutticode, Palakkad</p>
      </div>

      {/* Navigation - Glassmorphism + Neobrutalism Mix */}
      <header className="main-header fixed top-0 left-0 w-full z-[60] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div
            onClick={(e) => handleNavClick(e, 'top')}
            className="bg-white/90 backdrop-blur-xl border-2 border-primary px-6 py-3 shadow-brutal rounded-full cursor-pointer hover:scale-105 transition-transform flex items-center gap-3"
          >
            <img src="/logo.svg" className="w-8 h-8 object-contain" alt="Logo" />
            <span className="text-2xl font-headline font-bold text-primary tracking-tight">K.M.S.V. L.P.S.</span>
          </div>

          <nav className="hidden lg:flex gap-2 p-1.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-lg">
            {['About', 'Heritage', 'Academics', 'Infrastructure', 'Gallery', 'Community', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={(e) => handleNavClick(e, `#${item.toLowerCase()}`)}
                className="px-5 py-2 rounded-full font-label-md hover:bg-white hover:text-primary transition-all text-on-surface-variant font-semibold text-sm"
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={(e) => handleNavClick(e, '#admissions')}
            className="hidden lg:flex bg-primary text-on-primary px-8 py-3 rounded-full border-2 border-primary shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold"
          >
            ADMISSIONS
          </button>

          <button className="lg:hidden w-12 h-12 bg-white border-2 border-primary rounded-xl flex items-center justify-center shadow-brutal z-[70] relative" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-on-background z-[100] flex flex-col items-center justify-center gap-6 text-white p-12 transition-all duration-700 ease-in-out ${menuOpen ? 'clip-path-open opacity-100' : 'clip-path-closed opacity-0 pointer-events-none'}`}>
        <button
          className="absolute top-6 right-6 lg:hidden w-12 h-12 bg-white border-2 border-primary rounded-xl flex items-center justify-center shadow-brutal z-[110] text-on-background"
          onClick={() => setMenuOpen(false)}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center w-full gap-5 overflow-y-auto max-h-[85vh] py-6">
          {['About', 'Heritage', 'Academics', 'Infrastructure', 'Gallery', 'Community', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={(e) => handleNavClick(e, `#${item.toLowerCase()}`)}
              className="text-3xl md:text-5xl font-headline font-bold hover:text-primary hover:italic transition-all transform hover:scale-110"
            >
              {item}
            </button>
          ))}
          <button
            onClick={(e) => handleNavClick(e, '#admissions')}
            className="mt-6 bg-primary text-white px-12 py-4 rounded-full font-bold text-xl shadow-[4px_4px_0px_0px_#fff]"
          >
            ADMISSIONS
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[110vh] flex items-center justify-center overflow-hidden">
        <img src="/bg.png" className="hero-bg hero-layer z-0" alt="Sky" style={{ willChange: 'transform' }} />

        {/* Decorative floating blur circles for enhanced premium motion */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-float-slow-1"></div>
          <div className="absolute bottom-1/3 right-1/10 w-96 h-96 rounded-full bg-secondary/10 blur-[120px] animate-float-slow-2"></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full bg-primary/5 blur-[80px] animate-float-slow-3"></div>
        </div>

        {/* Hero Decorative Watermark Logo - Static Correctly Positioned */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.04] pointer-events-none" style={{ willChange: 'transform' }}>
          <img src="/logobgr.svg" className="w-[75vh] h-[75vh] object-contain" alt="KMSV Logo Watermark" />
        </div>

        {/* Hero Title - Behind Building */}
        <div className="hero-title-group absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 mt-[-40vh]" style={{ willChange: 'transform' }}>
          <h1 className="text-4xl md:text-8xl text-on-surface leading-[0.95] font-headline font-bold mb-8 drop-shadow-2xl">
            Where Heritage<br />
            <span className="text-primary italic">Meets Future</span>
          </h1>
        </div>

        {/* Hero Details - Above Building */}
        <div className="hero-details-group absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 mt-[25vh]" style={{ willChange: 'transform' }}>
          <p className="text-lg md:text-2xl text-white max-w-2xl mx-auto mb-14 font-semibold text-center leading-relaxed drop-shadow-xl reveal">
            Established in 1932, K.M.S.V. L.P.S. is one of the most trusted lower primary schools in Palakkad, Kerala — shaping young minds for 90+ years through SCERT curriculum, activity-based learning, and modern digital education.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button
              onClick={(e) => handleNavClick(e, '#about')}
              className="px-12 py-5 bg-primary text-white rounded-full text-xl font-bold border-2 border-primary shadow-brutal hover:translate-y-1 transition-all"
            >
              EXPLORE OUR STORY
            </button>
            <button
              onClick={(e) => handleNavClick(e, '#admissions')}
              className="px-12 py-5 bg-white/20 backdrop-blur-xl border-2 border-secondary text-secondary rounded-full text-xl font-bold hover:bg-secondary/10 transition-all"
            >
              ENROLL NOW
            </button>
          </div>
        </div>

        {/* Building Image - Layered with Carousel */}
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ willChange: 'transform' }}>
          <img src="/over.png" className="hero-over w-full h-full object-cover" alt="Building" style={{ mixBlendMode: 'multiply', opacity: 0.95, willChange: 'transform' }} />
        </div>

      </section>

      {/* Tilted Infinite Carousel - Transitional Layer */}
      <div className="relative z-40 bg-white py-4 transform -rotate-2 origin-left scale-110 shadow-2xl overflow-hidden border-y border-primary -mt-3">
        <div className="marquee-container flex whitespace-nowrap gap-12 animate-marquee-reverse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center">
              {['ACTIVITY-BASED LEARNING', 'DIGITAL IT LAB', 'HERITAGE 1932', 'BALANCED NUTRITION', 'ECO-FRIENDLY CAMPUS', 'DEDICATED FACULTY', 'INCLUSIVE EDUCATION'].map((feature) => (
                <div key={feature} className="flex items-center gap-4 text-primary font-bold text-sm md:text-lg">
                  <span className="material-symbols-outlined fill-icon text-sm">star</span>
                  {feature}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* About Us Section */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="absolute top-0 left-0 w-96 h-96 opacity-[0.03] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8 reveal">
            <p className="text-primary font-bold tracking-widest uppercase">Shaping Tomorrows — About KMSV LPS</p>
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-on-surface leading-tight">
              Nurturing Excellence <br />
              <span className="text-primary italic">Since 1932</span>
            </h2>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              K.M.S.V. L.P.S. Kutticode has stood as a beacon of standard education in Palakkad for nearly a century. We combine a solid foundation of academic excellence with modern technology, creating an environment where learning is joyful, inclusive, and future-oriented. We offer robust foundational education from kindergarten to primary standard in both English and Malayalam mediums.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-5xl font-bold text-primary">90+</p>
                <p className="text-xs uppercase tracking-widest opacity-60 mt-1">Years of Legacy</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-8">
                <p className="text-5xl font-bold text-secondary">100%</p>
                <p className="text-xs uppercase tracking-widest opacity-60 mt-1">Activity Centered</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 stagger-grid">
            {/* Montessori / Kindergarten */}
            <div className="bg-surface-variant border-2 border-outline/30 rounded-[3rem] p-10 hover:shadow-brutal hover:translate-y-[-4px] transition-all group flex flex-col justify-between h-[420px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none">
                <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Montessori learning" />
              </div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-primary text-5xl mb-6">child_care</span>
                <h3 className="text-2xl font-bold mb-4 font-headline text-on-surface">Montessori & Kindergarten</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  A warm, safe environment for LKG, UKG, and Montessori learners, fostering early motor skills, language development, and interactive social play.
                </p>
              </div>
              <div className="relative z-10 flex gap-2 flex-wrap">
                {['LKG', 'UKG', 'Montessori'].map(t => (
                  <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{t}</span>
                ))}
              </div>
            </div>

            {/* Primary Standard 1-5 */}
            <div className="bg-white border-2 border-primary rounded-[3rem] p-10 hover:shadow-brutal hover:translate-y-[-4px] transition-all group flex flex-col justify-between h-[420px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none">
                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Primary school classroom" />
              </div>
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-5xl mb-6">school</span>
                <h3 className="text-2xl font-bold mb-4 font-headline text-on-surface">Primary Standards (Classes 1-5)</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Rigorous primary curriculum spanning Malayalam and English Medium. Building strong foundations in sciences, mathematics, and languages.
                </p>
              </div>
              <div className="relative z-10 flex gap-2 flex-wrap">
                {['Malayalam Medium', 'English Medium'].map(t => (
                  <span key={t} className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Desk Section */}
      <section className="bg-primary text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.05] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-24 space-y-4 reveal">
            <p className="text-white/60 font-bold tracking-widest uppercase">Guiding Our Vision</p>
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-white">From the Desk of Leaders</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Manager Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-12 flex flex-col md:flex-row gap-8 items-center reveal group hover:bg-white hover:text-primary transition-all duration-500">
              <div className="w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-white/30 group-hover:border-primary/20 transition-all shadow-xl relative bg-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Manager Abdul Nasar Kollath"
                />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <span className="material-symbols-outlined text-4xl opacity-50 group-hover:text-primary">format_quote</span>
                <p className="italic text-base leading-relaxed opacity-90 group-hover:opacity-100">
                  "Since our inception in 1932, KMSV LPS has worked to provide children with more than just academic knowledge. We believe in building character, strong moral values, and integrating modern digital classrooms, ensuring that every kid gets an inclusive, future-ready environment."
                </p>
                <div>
                  <h4 className="text-2xl font-bold font-headline">Abdul Nasar Kollath</h4>
                  <p className="text-sm opacity-60 group-hover:opacity-75 font-semibold uppercase tracking-wider">Manager</p>
                </div>
              </div>
            </div>

            {/* Head Teacher Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[3rem] p-12 flex flex-col md:flex-row gap-8 items-center reveal group hover:bg-white hover:text-primary transition-all duration-500">
              <div className="w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 border-4 border-white/30 group-hover:border-primary/20 transition-all shadow-xl relative bg-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt="Head Teacher K P SMITHA"
                />
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <span className="material-symbols-outlined text-4xl opacity-50 group-hover:text-primary">format_quote</span>
                <p className="italic text-base leading-relaxed opacity-90 group-hover:opacity-100">
                  "Primary education sets the stage for a child's entire life. We utilize activity-based learning under the SCERT curriculum, alongside karate, abacus, spoken English, and athletic coaching, to cultivate academic curiosity and holistic self-discipline in every student."
                </p>
                <div>
                  <h4 className="text-2xl font-bold font-headline">K P SMITHA</h4>
                  <p className="text-sm opacity-60 group-hover:opacity-75 font-semibold uppercase tracking-wider">Head Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          HERITAGE SECTION — GSAP Pinned Horizontal Storytelling
          SEO: "90-year history of K.M.S.V. L.P.S. Kutticode Palakkad"
          ────────────────────────────────────────────────────────────── */}
      <section id="heritage" className="relative h-screen bg-on-background overflow-hidden" aria-label="School Heritage Timeline">

        {/* Fixed Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_15%_25%,rgba(158,61,0,0.14)_0%,transparent_55%)]" aria-hidden="true" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_85%_75%,rgba(0,100,151,0.09)_0%,transparent_55%)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff opacity=0.015%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" aria-hidden="true" />
        </div>

        {/* Sticky Left Content Area (Visible on Desktop & Top on Mobile) */}
        <div className="absolute top-0 left-0 w-full md:w-[35vw] h-[45vh] md:h-full flex flex-col justify-center px-6 pt-16 md:pt-0 md:px-16 z-20 pointer-events-none bg-gradient-to-b md:bg-gradient-to-r from-on-background via-on-background/95 to-transparent">
          <div className="flex items-center gap-3 text-white/50 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="material-symbols-outlined text-primary text-[16px]" aria-hidden="true">history_edu</span>
            Est. 1932 · Palakkad
          </div>
          <h2 className="text-4xl md:text-7xl font-headline font-bold text-white leading-[1.1] mb-4 md:mb-6 drop-shadow-2xl">
            Nine Decades<br />
            <span className="text-primary italic">of Legacy</span>
          </h2>
          <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-sm drop-shadow-lg">
            Scroll to explore the remarkable 90+ year journey of K.M.S.V. Lower Primary School — shaping young minds since 1932.
          </p>
          <div className="hidden md:flex mt-12 items-center gap-4 text-primary font-bold uppercase tracking-widest text-xs animate-pulse">
            <span className="material-symbols-outlined text-[16px]">swipe_right</span>
            Keep Scrolling
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="heritage-track absolute top-0 left-0 h-full w-fit flex items-end md:items-center pb-[8vh] md:pb-0 px-6 md:pl-[40vw] pr-[20vw] z-10" role="list">
          {[
            {
              year: '1932',
              title: 'Foundation & Vision',
              desc: 'Established in 1932 by a group of passionate educators in Thrikkadeeri, K.M.S.V. L.P.S. began under the shade of a banyan tree. The vision was radical yet simple: to provide accessible, high-quality foundational education to every child in the community, regardless of background.',
              img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
              icon: 'eco'
            },
            {
              year: '1947',
              title: 'A New Era of Freedom',
              desc: 'As India gained independence, the school mirrored the nation\'s hope. Embracing a structured curriculum, the institution began formalizing its approach to lower primary education, expanding its community outreach and becoming a beacon of literacy in Palakkad.',
              img: 'https://images.unsplash.com/photo-1536337005238-94b997371b40?auto=format&fit=crop&q=80&w=800',
              icon: 'flag'
            },
            {
              year: '1965',
              title: 'Building The Future',
              desc: 'Transitioning from temporary thatched structures to a permanent concrete building marked a significant milestone. The new infrastructure accommodated a surging enrollment and allowed for dedicated classrooms, laying the groundwork for modernized teaching.',
              img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
              icon: 'apartment'
            },
            {
              year: '1982',
              title: 'Golden Jubilee',
              desc: 'Celebrating 50 years of academic excellence, the school was recognized by the Kerala State Education Board for its outstanding contribution to foundational learning. The Golden Jubilee brought immense community support and funding for new educational tools.',
              img: 'https://images.unsplash.com/photo-1523580494112-071d1692d509?auto=format&fit=crop&q=80&w=800',
              icon: 'workspace_premium'
            },
            {
              year: '1995',
              title: 'Cultivating Imagination',
              desc: 'A dedicated library housing over 1,000 children\'s books and a specialized arts and crafts center were inaugurated. This era shifted the focus toward holistic development, emphasizing storytelling, creativity, and moral education alongside academics.',
              img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800',
              icon: 'menu_book'
            },
            {
              year: '2015',
              title: 'The Digital Frontier',
              desc: 'Stepping into the 21st century, K.M.S.V. L.P.S. integrated the state-backed KITE program. The inauguration of a high-speed, modern IT Lab transformed the historic campus, introducing digital literacy and multimedia learning to students from Class 1.',
              img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
              icon: 'computer'
            },
            {
              year: '2024',
              title: 'A Century in Sight',
              desc: 'Today, approaching its centenary, the school masterfully blends its 90-year heritage with the modern SCERT Kerala curriculum. With eco-friendly classrooms, activity-based learning, and comprehensive arts/sports coaching, the legacy continues to shape the leaders of tomorrow.',
              img: 'https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&q=80&w=800',
              icon: 'rocket_launch'
            }
          ].map((era, i) => (
            <div key={i} className="flex-shrink-0 w-[85vw] md:w-[700px] h-[55vh] md:h-[75vh] mr-8 md:mr-24 relative rounded-[2rem] overflow-hidden group tilt-card cursor-grow" role="listitem" itemScope itemType="https://schema.org/Event">

              {/* Parallax Image Background */}
              <div className="absolute inset-0 bg-black">
                <img src={era.img} alt={era.title} className="heritage-image w-[130%] h-[130%] object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" itemProp="image" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden="true" />
              </div>

              {/* Floating Year Graphic */}
              <div className="absolute top-6 right-6 md:top-8 md:right-8 text-[4rem] md:text-[8rem] font-headline font-bold text-white/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-700 leading-none">
                {era.year}
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{era.icon}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6 mb-3 md:mb-4">
                  <time className="text-3xl md:text-5xl font-headline font-bold text-primary" itemProp="startDate" dateTime={era.year}>{era.year}</time>
                  <h3 className="text-xl md:text-3xl font-headline font-bold text-white mb-0 md:mb-1" itemProp="name">{era.title}</h3>
                </div>

                <p className="text-white/80 text-xs md:text-base leading-relaxed max-w-lg border-l-2 border-primary/50 pl-3 md:pl-4" itemProp="description">
                  {era.desc}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-1000" aria-hidden="true" />
            </div>
          ))}

          {/* Outro Stat Block at the end of scroll */}
          <div className="flex-shrink-0 w-[85vw] md:w-[400px] h-[55vh] md:h-[75vh] flex flex-col items-center justify-center text-center p-8">
            <span className="material-symbols-outlined text-primary text-[4rem] md:text-[5rem] mb-6 animate-float-slow-1">history_edu</span>
            <h3 className="text-4xl md:text-5xl font-headline font-bold text-white mb-4">90+ Years</h3>
            <p className="text-white/50 text-sm md:text-lg uppercase tracking-widest">The Legacy Continues</p>
          </div>
        </div>

      </section>

      {/* Legacy & Impact Section (Below Heritage Scroll) */}
      <section className="py-24 md:py-32 px-6 bg-on-background text-white relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 right-0 w-full md:w-[800px] h-full md:h-[800px] bg-[radial-gradient(circle_at_center,rgba(158,61,0,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-6 md:space-y-8 reveal">
              <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
              <h3 className="text-4xl md:text-6xl font-headline font-bold leading-[1.1]">
                A Legacy That <br className="hidden md:block"/>
                <span className="text-primary italic">Echoes</span>
              </h3>
              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg">
                For over 90 years, K.M.S.V. L.P.S. has been more than a school; it has been a second home. Generation after generation, families in Palakkad have trusted us to build the foundational character, intellect, and creativity of their children.
              </p>
              <div className="pt-4">
                <Link to="/history" className="neo-button text-sm uppercase tracking-widest flex items-center gap-2 w-max">
                  Read Full History
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-6 stagger-grid">
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:bg-white/10 transition-colors">
                <p className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">90+</p>
                <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest font-bold">Years of Trust</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:bg-white/10 transition-colors md:translate-y-8">
                <p className="text-4xl md:text-5xl font-headline font-bold text-white mb-2">5k+</p>
                <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest font-bold">Alumni Worldwide</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:bg-white/10 transition-colors md:-translate-y-4">
                <p className="text-4xl md:text-5xl font-headline font-bold text-white mb-2">100%</p>
                <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest font-bold">Activity Based</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8 hover:bg-white/10 transition-colors md:translate-y-4">
                <p className="text-4xl md:text-5xl font-headline font-bold text-primary mb-2">1</p>
                <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest font-bold">Shared Vision</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          ACADEMICS SECTION — Complete Redesign
          SEO: "SCERT Kerala primary school curriculum Palakkad"
          ────────────────────────────────────────────────────────────── */}
      <section id="academics" className="relative py-32 px-6 overflow-hidden bg-surface-variant" aria-label="Academic Programs at K.M.S.V. L.P.S. Kutticode">

        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%239e3d00 opacity=0.04%3E%3Cpath d=M0 40L40 0H20L0 20M40 40V20L20 40/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* SEO header */}
          <header className="text-center max-w-3xl mx-auto mb-20 reveal">
            <div className="flex items-center justify-center gap-3 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">school</span>
              SCERT Kerala · Activity-Based Learning
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold  leading-tight mb-5">
              World-Class <span className="text-primary italic">Primary Education</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              K.M.S.V. L.P.S. Kutticode follows the SCERT Kerala curriculum, delivering holistic, activity-based primary education for Classes 1 to 4 in Thrikkadeeri, Palakkad.
            </p>
          </header>

          {/* ── Class-by-Class Curriculum Cards ─────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 stagger-grid" role="list" aria-label="Class curriculum overview">
            {[
              {
                grade: 'Class 1',
                age: 'Age 6–7',
                icon: 'child_care',
                color: 'from-[#FF6B6B]/10 to-transparent border-[#FF6B6B]/20 hover:border-[#FF6B6B]/60',
                iconColor: 'text-[#FF6B6B]',
                subjects: ['Malayalam', 'English', 'Mathematics', 'Environmental Science'],
                focus: 'Foundational literacy, numeracy, language development, environmental awareness, and joyful creative activities using the Activity-Based Learning approach.',
                tag: 'Foundation',
              },
              {
                grade: 'Class 2',
                age: 'Age 7–8',
                icon: 'psychology',
                color: 'from-[#4ECDC4]/10 to-transparent border-[#4ECDC4]/20 hover:border-[#4ECDC4]/60',
                iconColor: 'text-[#4ECDC4]',
                subjects: ['Malayalam', 'English', 'Mathematics', 'EVS', 'Creative Arts'],
                focus: 'Communication skills, social interaction, problem-solving, collaborative group activities, and foundational mathematics with real-world applications.',
                tag: 'Building',
              },
              {
                grade: 'Class 3',
                age: 'Age 8–9',
                icon: 'lightbulb',
                color: 'from-[#FFE66D]/10 to-transparent border-[#FFE66D]/20 hover:border-[#FFE66D]/60',
                iconColor: 'text-[#FFE66D]',
                subjects: ['Malayalam', 'English', 'Mathematics', 'EVS', 'IT Basics', 'Arts'],
                focus: 'Core subject deepening, digital learning tools, IT lab access, storytelling, creative arts, and project-based collaborative learning experiences.',
                tag: 'Expanding',
              },
              {
                grade: 'Class 4',
                age: 'Age 9–10',
                icon: 'rocket_launch',
                color: 'from-primary/10 to-transparent border-primary/20 hover:border-primary/60',
                iconColor: 'text-primary',
                subjects: ['Malayalam', 'English', 'Mathematics', 'Science', 'Social Studies', 'IT'],
                focus: 'Advanced academics, comprehensive KITE IT lab learning, project-based activities, leadership development, and preparation for upper primary excellence.',
                tag: 'Advanced',
              },
            ].map((item, i) => (
              <article key={i} role="listitem" className={`tilt-card group bg-gradient-to-br ${item.color} border-2 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-brutal hover:-translate-y-1 relative overflow-hidden`} itemScope itemType="https://schema.org/Course">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-on-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <span className={`material-symbols-outlined ${item.iconColor} text-3xl`} style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{item.icon}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${item.iconColor} bg-current/10 opacity-70`}>{item.tag}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-widest mb-1" itemProp="courseLevel">{item.age}</p>
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-3" itemProp="name">{item.grade}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-5" itemProp="description">{item.focus}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.subjects.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-on-background/5 border border-on-surface/10 rounded-full text-on-surface-variant text-xs group-hover:border-primary/30 group-hover:text-primary transition-all">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700" aria-hidden="true" />
              </article>
            ))}
          </div>

          {/* ── Subjects Strip ───────────────────────────────────────────── */}
          <div className="mb-20 reveal">
            <p className="text-center text-xs text-on-surface-variant/50 uppercase tracking-widest font-bold mb-6">All Subjects Offered · SCERT Kerala Syllabus</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { name: 'Malayalam', icon: 'translate' },
                { name: 'English', icon: 'record_voice_over' },
                { name: 'Mathematics', icon: 'calculate' },
                { name: 'Environmental Science', icon: 'eco' },
                { name: 'Information Technology', icon: 'computer' },
                { name: 'Physical Education', icon: 'sports_soccer' },
                { name: 'Creative Arts', icon: 'palette' },
                { name: 'Moral Education', icon: 'favorite' },
                { name: 'Social Studies', icon: 'public' },
                { name: 'Science', icon: 'science' },
              ].map(sub => (
                <span key={sub.name} className="group flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-outline/10 rounded-full hover:border-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 font-bold text-sm text-on-surface-variant cursor-grow">
                  <span className="material-symbols-outlined text-[16px] opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" style={{ fontVariationSettings: "'FILL' 1" }}>{sub.icon}</span>
                  {sub.name}
                </span>
              ))}
            </div>
          </div>

          {/* ── Learning Approach Cards ──────────────────────────────────── */}
          <div className="mb-20">
            <div className="text-center mb-12 reveal">
              <h3 className="text-2xl md:text-4xl font-headline font-bold text-on-surface mb-3">
                Our Teaching <span className="text-primary italic">Philosophy</span>
              </h3>
              <p className="text-on-surface-variant">How we make learning joyful, meaningful, and lasting for every child in Palakkad</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-grid">
              {[
                { title: 'Activity-Based Learning', icon: 'extension', desc: 'Every lesson at K.M.S.V. L.P.S. is designed around hands-on activities, real-world contexts, and interactive participation — ensuring concepts are understood, not just memorised.', stat: '100%', statLabel: 'Activity Integrated' },
                { title: 'Digital-First Classrooms', icon: 'computer', desc: 'Our KITE-enabled IT lab brings technology directly into learning — with multimedia lessons, interactive software, and safe internet exploration for Classes 1–4.', stat: 'KITE', statLabel: 'Certified Lab' },
                { title: 'Multilingual Excellence', icon: 'translate', desc: 'Instruction in both Malayalam and English medium ensures students develop strong bilingual communication skills — a critical asset in modern Kerala\'s education and job market.', stat: '2', statLabel: 'Language Mediums' },
              ].map((ap, i) => (
                <div key={i} className="tilt-card group bg-white border-2 border-outline/10 rounded-[2rem] p-10 hover:border-primary/40 hover:shadow-brutal transition-all duration-500 relative overflow-hidden cursor-grow">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-primary group-hover:text-white text-3xl transition-colors" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{ap.icon}</span>
                  </div>
                  <h4 className="text-xl font-headline font-bold text-on-surface mb-3">{ap.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{ap.desc}</p>
                  <div className="flex items-baseline gap-2 border-t border-outline/10 pt-4">
                    <span className="text-3xl font-bold text-primary font-headline">{ap.stat}</span>
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest">{ap.statLabel}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700" aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Special Coaching Programs ────────────────────────────────── */}
          <div className="mb-20">
            <div className="text-center mb-12 reveal">
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Beyond the Classroom</p>
              <h3 className="text-2xl md:text-4xl font-headline font-bold text-on-surface mb-3">
                Specialized <span className="text-primary italic">Coaching Programs</span>
              </h3>
              <p className="text-on-surface-variant max-w-2xl mx-auto">K.M.S.V. L.P.S. Kutticode offers Kerala's best-in-class extracurricular coaching — building confident, skilled, and well-rounded young learners.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-grid">
              {[
                {
                  title: 'Karate Coaching',
                  desc: 'Professional martial arts training by certified instructors — building physical endurance, mental focus, self-discipline, and self-defense skills from an early age.',
                  icon: 'sports_martial_arts',
                  img: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600',
                  benefit: 'Discipline & Focus',
                  color: 'from-red-500/20',
                },
                {
                  title: 'Abacus & Mental Maths',
                  desc: 'Internationally recognised abacus and mental arithmetic coaching that accelerates numerical reasoning, improves working memory, and builds extraordinary mathematical confidence.',
                  icon: 'calculate',
                  img: 'https://images.unsplash.com/photo-1453733190148-c44698c26588?auto=format&fit=crop&q=80&w=600',
                  benefit: 'Brain Power',
                  color: 'from-blue-500/20',
                },
                {
                  title: 'Spoken English',
                  desc: 'Interactive language training with emphasis on correct pronunciation, public speaking, conversational grammar, and the confidence to communicate fluently in English.',
                  icon: 'record_voice_over',
                  img: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
                  benefit: 'Communication',
                  color: 'from-green-500/20',
                },
                {
                  title: 'Sports & Fine Arts',
                  desc: 'Dedicated football, athletics, painting, music, and dance coaching — ensuring every child discovers their unique talent and builds a creative, healthy identity.',
                  icon: 'palette',
                  img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
                  benefit: 'Creativity & Health',
                  color: 'from-purple-500/20',
                },
              ].map((coach, i) => (
                <article key={i} className="tilt-card group bg-on-background rounded-[2rem] overflow-hidden hover:scale-[1.03] transition-all duration-500 relative flex flex-col cursor-grow" itemScope itemType="https://schema.org/Course">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img src={coach.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={coach.title} loading="lazy" itemProp="image" />
                    <div className={`absolute inset-0 bg-gradient-to-b ${coach.color} via-transparent to-on-background`} aria-hidden="true" />
                    <span className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 text-xs font-bold">{coach.benefit}</span>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl transition-colors" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{coach.icon}</span>
                    </div>
                    <h4 className="text-xl font-headline font-bold text-white mb-3" itemProp="name">{coach.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed flex-1" itemProp="description">{coach.desc}</p>
                    <div className="flex items-center gap-2 mt-6 text-primary text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                      <span>Learn More</span>
                      <span className="material-symbols-outlined text-[14px]" aria-hidden="true">arrow_forward</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>

          {/* ── Achievement Highlights ───────────────────────────────────── */}
          <div className="reveal">
            <div className="bg-on-background rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04] pointer-events-none" aria-hidden="true">
                <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Why Choose K.M.S.V. L.P.S. Kutticode</p>
                  <h4 className="text-3xl md:text-4xl font-headline font-bold text-white mb-5 leading-tight">
                    Palakkad's Most Trusted <span className="text-primary italic">Lower Primary School</span>
                  </h4>
                  <p className="text-white/60 leading-relaxed mb-8">
                    For over 90 years, K.M.S.V. L.P.S. Kutticode has been shaping the foundation of thousands of young lives in Thrikkadeeri, Palakkad. Our blend of SCERT Kerala curriculum, dedicated faculty, modern KITE infrastructure, and holistic special coaching programs makes us the first choice for parents seeking the best primary education in Palakkad district.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'SCERT Curriculum', icon: 'verified' },
                      { label: 'KITE IT Lab', icon: 'computer' },
                      { label: 'Mid-Day Meal', icon: 'restaurant' },
                      { label: 'Eco Campus', icon: 'eco' },
                      { label: 'Inclusive Education', icon: 'diversity_3' },
                      { label: '90+ Years Trust', icon: 'history_edu' },
                    ].map(f => (
                      <div key={f.label} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary transition-all duration-300 flex-shrink-0">
                          <span className="material-symbols-outlined text-primary group-hover:text-white text-[16px] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{f.icon}</span>
                        </div>
                        <span className="text-white/70 text-sm font-medium">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: '90+', label: 'Years of Excellence', icon: 'history_edu' },
                    { num: '1–4', label: 'Classes Offered', icon: 'school' },
                    { num: '6+', label: 'Special Programs', icon: 'stars' },
                    { num: '100%', label: 'Activity-Based', icon: 'extension' },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-300 group cursor-grow">
                      <span className="material-symbols-outlined text-primary text-2xl mb-2 group-hover:scale-110 transition-transform block" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">{s.icon}</span>
                      <p className="text-3xl font-bold text-white font-headline group-hover:text-primary transition-colors">{s.num}</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Infrastructure Section — Complete Redesign */}
      <section id="infrastructure" className="relative overflow-hidden bg-on-background py-32 px-6">

        {/* Animated floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-primary/20 blur-[120px] animate-float-slow-1" />
          <div className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full bg-secondary/20 blur-[100px] animate-float-slow-2" />
          <div className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full bg-primary/10 blur-[80px] animate-float-slow-3" />
        </div>



        <div className="max-w-7xl mx-auto relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 reveal">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/60 font-bold tracking-widest uppercase text-xs mb-6">
              <span className="material-symbols-outlined text-primary text-[16px]">apartment</span>
              Smart Campus — Digital Palakkad
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white leading-tight mb-6">
              World-Class <span className="text-primary italic">Infrastructure</span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              A future-ready campus equipped with cutting-edge technology, enriching spaces, and facilities designed for holistic child development.
            </p>
          </div>

          {/* Animated Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 stagger-grid">
            {[
              { value: '1,249+', label: 'Library Books', icon: 'menu_book' },
              { value: 'KITE', label: 'Enabled IT Lab', icon: 'computer' },
              { value: '100%', label: 'Digital Ready', icon: 'wifi' },
              { value: '90+', label: 'Years of Trust', icon: 'history_edu' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 hover:border-primary/40 hover:scale-105 transition-all duration-300 group">
                <span className="material-symbols-outlined text-primary text-3xl mb-3 group-hover:scale-110 transition-transform block" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                <p className="text-3xl font-bold text-white font-headline">{stat.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Bento Grid — Main Facility Cards */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* IT Lab — Large Hero Card */}
            <div className="md:col-span-7 bg-secondary/20 backdrop-blur-xl border border-secondary/30 rounded-[2.5rem] overflow-hidden relative group reveal hover:border-secondary/60 transition-all duration-500 min-h-[420px] flex flex-col">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img src="https://images.unsplash.com/photo-1510519138101-570d1dca3d66?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" alt="IT Lab" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>
              <div className="relative z-10 p-10 md:p-12 flex flex-col justify-end h-full">
                <div className="mb-auto">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/30 border border-secondary/40 rounded-full text-secondary text-xs font-bold uppercase tracking-wider mb-6">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    KITE Enabled
                  </span>
                </div>
                <div>
                  <span className="material-symbols-outlined text-secondary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>computer</span>
                  <h3 className="text-2xl md:text-3xl font-headline font-bold text-white mb-4">Modern IT Lab</h3>
                  <p className="text-white/70 leading-relaxed mb-8 max-w-lg text-sm">
                    Powered by KITE &amp; IT@School initiatives — students explore digital literacy, interactive multimedia, and computer fundamentals in a safe, supervised environment.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['High-Speed Internet', 'Modern Computers', 'Interactive Modules', 'Smart Slots', 'Safe Browsing', 'Early Coding'].map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs font-semibold text-white/80">
                        <span className="w-4 h-4 rounded-full bg-secondary/40 border border-secondary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-secondary" style={{ fontSize: '10px' }}>check</span>
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — two stacked cards */}
            <div className="md:col-span-5 flex flex-col gap-6">

              {/* Library */}
              <div className="bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-[2.5rem] p-8 relative group hover:border-primary/50 hover:bg-primary/20 transition-all duration-500 reveal flex-1 overflow-hidden">
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-[8rem] text-primary">menu_book</span>
                </div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-primary text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
                  <h3 className="text-xl font-headline font-bold text-white mb-3">Library &amp; Reading Hub</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-6">
                    Over 1,249+ curated books fostering imagination, language skills, and a lifelong love of reading through weekly storytelling sessions.
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">1,249+</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest">Curated Books</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-primary/30">
                      <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Library" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Classrooms */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative group hover:border-white/30 hover:bg-white/10 transition-all duration-500 reveal flex-1 overflow-hidden">
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined text-[8rem] text-white">cast_for_education</span>
                </div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-white/80 text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>cast_for_education</span>
                  <h3 className="text-xl font-headline font-bold text-white mb-3">Smart Classrooms</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">
                    Activity-based SCERT curriculum delivered through well-equipped, bright, and inclusive classrooms — blending traditional and digital pedagogy.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {['SCERT', 'Activity-Based', 'Inclusive'].map(t => (
                      <span key={t} className="px-3 py-1 bg-white/10 border border-white/15 text-white/70 text-xs font-bold rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row — 3 facility mini-cards */}
            {[
              { icon: 'eco', color: 'text-tertiary', bg: 'bg-tertiary/10 border-tertiary/20 hover:border-tertiary/50 hover:bg-tertiary/20', title: 'Eco-Friendly Campus', desc: 'Green surroundings, clean environment, and nature-integrated learning spaces that inspire calm and creativity.' },
              { icon: 'sports_soccer', color: 'text-secondary', bg: 'bg-secondary/10 border-secondary/20 hover:border-secondary/50 hover:bg-secondary/20', title: 'Sports &amp; Play Grounds', desc: 'Dedicated sports area for football, athletics, and physical activities — building team spirit and healthy bodies.' },
              { icon: 'restaurant', color: 'text-primary', bg: 'bg-primary/10 border-primary/20 hover:border-primary/50 hover:bg-primary/20', title: 'Nutrition &amp; Meal Hub', desc: '100% student participation in the Mid-Day Meal program — balanced, nutritious daily meals for every child.' },
            ].map((card, i) => (
              <div key={i} className={`md:col-span-4 backdrop-blur-xl border rounded-[2.5rem] p-8 relative group transition-all duration-500 reveal overflow-hidden ${card.bg}`}>
                <div className="absolute top-4 right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <span className={`material-symbols-outlined text-[6rem] ${card.color}`}>{card.icon}</span>
                </div>
                <div className="relative z-10">
                  <span className={`material-symbols-outlined text-4xl mb-4 group-hover:scale-110 transition-transform block ${card.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                  <h3 className="text-lg font-headline font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: card.title }} />
                  <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Strip */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 reveal">
            <div>
              <h3 className="text-xl font-bold text-white font-headline mb-1">Visit our campus to experience it firsthand</h3>
              <p className="text-white/50 text-sm">See our digital classrooms, library, and eco-campus in person.</p>
            </div>
            <button
              onClick={(e) => handleNavClick(e, '#contact')}
              className="flex-shrink-0 flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full border-2 border-primary font-bold hover:bg-transparent hover:text-primary transition-all duration-300 group"
            >
              Schedule a Visit
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-32 px-6 bg-surface-variant relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.05] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 reveal relative z-10">
          <div className="space-y-10">
            <div className="inline-block px-6 py-2 bg-primary/10 rounded-full text-primary font-bold">OUR VISION</div>
            <h2 className="text-2xl md:text-4xl">Empowering Every Child for the Future</h2>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Our vision is to create a nurturing educational environment where every child discovers their talents, develops confidence, and grows into a responsible global citizen — combining Kerala's rich educational values with modern learning approaches.
            </p>
          </div>
          <div className="space-y-10">
            <div className="inline-block px-6 py-2 bg-secondary/10 rounded-full text-secondary font-bold">OUR MISSION</div>
            <h2 className="text-2xl md:text-4xl text-secondary">Heritage, Innovation &amp; Holistic Learning</h2>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              To provide accessible, inclusive, technology-enabled, and value-based primary education that empowers children academically, socially, emotionally, and digitally — promoting digital literacy, creativity, strong moral values, and lifelong learning.
            </p>
          </div>
        </div>
      </section>

      {/* Community / Welfare */}
      <section id="community" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-on-background text-white rounded-[4rem] p-16 md:p-32 relative overflow-hidden reveal">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_20%,rgba(158,61,0,0.1)_0%,transparent_50%)]"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary rounded-full text-white font-bold">
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                  NUTRITION HUB
                </div>
                <h2 className="text-2xl md:text-4xl font-headline font-bold">Nutrition &amp; Student Wellness</h2>
                <p className="text-xl opacity-70 leading-relaxed max-w-lg">
                  Healthy students learn better. Our comprehensive Mid-Day Meal program provides nutritious, balanced meals that support the physical and mental well-being of every child — with 100% student participation reflecting community trust.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/20">
                    <p className="text-4xl font-bold">100%</p>
                    <p className="text-xs opacity-60 uppercase">Participation</p>
                  </div>
                  <div className="bg-white/10 px-8 py-4 rounded-3xl border border-white/20">
                    <p className="text-4xl font-bold">Daily</p>
                    <p className="text-xs opacity-60 uppercase">Balanced Meals</p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl mask-reveal">
                <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover parallax-img" alt="Student Life" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section id="admissions" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.04] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-surface-variant border-2 border-primary rounded-[4rem] p-12 md:p-24 shadow-brutal reveal overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center text-left">
              <div>
                <h2 className="text-2xl md:text-4xl font-headline font-bold mb-8 text-on-surface">Admissions Open <br /><span className="text-primary italic">Secure Your Child's Future</span></h2>
                <p className="text-xl text-on-surface-variant mb-8 leading-relaxed">
                  Join the most trusted lower primary school in Palakkad. Admissions are now open for Classes 1 to 5 as well as Montessori & Kindergarten (LKG / UKG) at K.M.S.V. L.P.S. Kutticode.
                </p>
                <div className="space-y-6">
                  {[
                    'Download the admission application form.',
                    'Submit the completed form at the school office.',
                    'Parent and student interaction session.',
                    'Admission confirmation.'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">{i + 1}</div>
                      <p className="text-lg">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <p className="font-bold mb-4 text-on-surface-variant uppercase tracking-widest text-sm">Documents Required</p>
                  <div className="flex flex-wrap gap-3">
                    {['Birth Certificate', 'Aadhaar Copy', 'Passport Photo', 'Previous School Records'].map(doc => (
                      <span key={doc} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">{doc}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white p-12 rounded-[3rem] border border-outline shadow-xl text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-6">description</span>
                <h3 className="text-2xl font-bold mb-4">Application Form</h3>
                <p className="text-on-surface-variant mb-8">Download and fill the official admission request form.</p>
                <button className="w-full py-5 bg-on-background text-white rounded-2xl text-xl font-bold hover:bg-primary transition-colors mb-4">
                  DOWNLOAD PDF
                </button>
                <p className="text-sm opacity-50 uppercase tracking-widest">Available in Malayalam & English</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-6 bg-surface-variant relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 opacity-[0.03] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 reveal">
            <p className="text-primary font-bold tracking-widest uppercase">School Activities — Media Gallery</p>
            <h2 className="text-3xl md:text-5xl font-headline font-bold text-on-surface">Moments of Joy & Learning</h2>
          </div>

          {/* Gallery Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {['All', 'Academics', 'Kindergarten', 'Sports & Arts', 'Campus Life'].map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2.5 rounded-full font-bold transition-all text-sm border-2 ${activeTag === tag
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white text-on-surface-variant hover:bg-primary/5 border-outline/20'
                  }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Gallery Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { id: 1, tag: 'Academics', title: 'Digital Classrooms', img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=600' },
              { id: 2, tag: 'Kindergarten', title: 'Montessori Playtime', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600' },
              { id: 3, tag: 'Sports & Arts', title: 'Karate Defense Training', img: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=600' },
              { id: 4, tag: 'Campus Life', title: 'Eco-Friendly Campus', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600' },
              { id: 5, tag: 'Academics', title: 'Interactive Science Projects', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600' },
              { id: 6, tag: 'Sports & Arts', title: 'Football Coaching Sessions', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600' },
              { id: 7, tag: 'Kindergarten', title: 'Early Years Creativity', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600' },
              { id: 8, tag: 'Campus Life', title: 'Balanced Nutrition Dining', img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&q=80&w=600' }
            ]
              .filter(item => activeTag === 'All' || item.tag === activeTag)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxImg(item)}
                  className="bg-white border-2 border-outline/10 rounded-[2.5rem] overflow-hidden shadow-md group hover:shadow-brutal hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-[350px]"
                >
                  <div className="h-60 overflow-hidden relative bg-primary/5 pointer-events-none">
                    <img
                      src={item.img}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-5xl bg-primary/80 rounded-full p-4">zoom_in</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center text-left">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{item.tag}</p>
                    <h4 className="text-base font-bold font-headline text-on-surface leading-snug">{item.title}</h4>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setLightboxImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white text-4xl w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-[210]"
              onClick={() => setLightboxImg(null)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center gap-4 z-[205]" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxImg.img}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border-2 border-white/20"
                alt={lightboxImg.title}
              />
              <div className="text-center text-white space-y-1">
                <p className="text-xs text-primary font-bold uppercase tracking-widest">{lightboxImg.tag}</p>
                <h4 className="text-2xl font-headline font-bold">{lightboxImg.title}</h4>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contact Section — Redesigned with Form */}
      <section id="contact" className="py-32 px-6 relative overflow-hidden bg-surface-variant">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-primary/5 blur-[100px] animate-float-slow-2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary/5 blur-[80px] animate-float-slow-1" />
          <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04] pointer-events-none">
            <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20 reveal">
            <p className="text-primary font-bold tracking-widest uppercase text-sm mb-3">Get In Touch — We'd Love to Hear From You</p>
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-on-surface leading-tight">
              Contact <span className="text-primary italic">KMSV LPS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left — Info Column */}
            <div className="lg:col-span-4 space-y-6 reveal">
              {/* Contact details card */}
              <div className="bg-on-background text-white rounded-[2.5rem] p-10 space-y-8">
                <h3 className="text-xl font-headline font-bold">Contact Details</h3>

                <a href="tel:+919961178026" className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-300 flex-shrink-0">
                    <span className="material-symbols-outlined text-primary group-hover:text-white text-2xl transition-colors">call</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Phone</p>
                    <p className="text-lg font-bold group-hover:text-primary transition-colors">+91 9961178026</p>
                  </div>
                </a>

                <a href="mailto:kmsvlpschool@gmail.com" className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-secondary/20 border border-secondary/30 rounded-2xl flex items-center justify-center group-hover:bg-secondary transition-all duration-300 flex-shrink-0">
                    <span className="material-symbols-outlined text-secondary group-hover:text-white text-2xl transition-colors">mail</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Email</p>
                    <p className="text-base font-bold break-all group-hover:text-secondary transition-colors">kmsvlpschool@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white/60 text-2xl">location_on</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Address</p>
                    <p className="text-base text-white/80 leading-relaxed">Tharuvakonam, Thrikkadeeri (P.O)<br />Palakkad, Kerala — 679501</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white/60 text-2xl">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">School Hours</p>
                    <p className="text-base font-bold text-white/80">Mon — Fri</p>
                    <p className="text-sm text-white/50">9:30 AM — 4:30 PM</p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=KMSV+LPS+Kutticode+Palakkad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-2xl font-bold border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 group"
                >
                  <span className="material-symbols-outlined group-hover:scale-110 transition-transform">map</span>
                  VIEW ON GOOGLE MAPS
                </a>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/919961178026?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20admissions%20at%20KMSV%20LPS%20Kutticode."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-6 bg-[#25D366]/10 border-2 border-[#25D366]/30 rounded-[1.5rem] hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-300 group reveal"
              >
                <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-[#25D366] text-sm">Chat on WhatsApp</p>
                  <p className="text-xs text-on-surface-variant">Quick replies for admission queries</p>
                </div>
                <span className="material-symbols-outlined text-[#25D366] ml-auto group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </a>
            </div>

            {/* Right — Contact Form */}
            <div className="lg:col-span-8 reveal">
              <div className="bg-white border-2 border-outline/20 rounded-[2.5rem] p-10 md:p-14 shadow-brutal relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="mb-10">
                  <h3 className="text-2xl md:text-3xl font-headline font-bold text-on-surface mb-2">Send Us a Message</h3>
                  <p className="text-on-surface-variant">Fill in the form and we'll get back to you within 24 hours.</p>
                </div>

                {formStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                    <div className="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-tertiary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <h4 className="text-2xl font-headline font-bold text-on-surface">Message Sent!</h4>
                    <p className="text-on-surface-variant max-w-sm">Thank you for reaching out. Our team will contact you shortly.</p>
                    <button
                      onClick={() => { setFormStatus('idle'); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/80 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setFormStatus('sending');
                      setTimeout(() => setFormStatus('success'), 1800);
                    }}
                    className="space-y-6"
                  >
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Full Name *</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">person</span>
                          <input
                            type="text"
                            required
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 bg-surface-variant border-2 border-outline/20 rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 font-medium"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Email Address *</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">mail</span>
                          <input
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 bg-surface-variant border-2 border-outline/20 rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Phone + Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Phone Number</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">call</span>
                          <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 bg-surface-variant border-2 border-outline/20 rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 font-medium"
                          />
                        </div>
                      </div>
                      <div className="relative group">
                        <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Subject *</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl transition-colors group-focus-within:text-primary">topic</span>
                          <select
                            required
                            value={formData.subject}
                            onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 bg-surface-variant border-2 border-outline/20 rounded-2xl text-on-surface focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 font-medium appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select a subject</option>
                            <option>Admission Enquiry</option>
                            <option>Campus Visit Request</option>
                            <option>Fee Structure</option>
                            <option>Academic Information</option>
                            <option>General Inquiry</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative group">
                      <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Your Message *</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Tell us what you'd like to know..."
                        value={formData.message}
                        onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-variant border-2 border-outline/20 rounded-2xl text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:bg-white transition-all duration-300 font-medium resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full py-5 bg-primary text-white rounded-2xl text-lg font-bold border-2 border-primary shadow-brutal hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {formStatus === 'sending' ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                          SEND MESSAGE
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-on-surface-variant opacity-60">
                      By submitting, you agree to be contacted by K.M.S.V. L.P.S. Kutticode regarding your inquiry.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t-2 border-primary py-24 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.04] pointer-events-none">
          <img src="/logobgr.svg" className="w-full h-full object-contain" alt="" />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-headline font-bold text-primary">K.M.S.V. L.P.S.</h2>
            <p className="opacity-60 max-w-xs">Best lower primary school in Palakkad, Kerala — nurturing young minds since 1932 with heritage, innovation, and digital excellence.</p>
          </div>
          <div className="flex gap-12 text-sm font-bold opacity-60 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
          <div className="text-center md:text-right">
            <p className="font-bold opacity-80">© 1932 — 2024</p>
            <p className="text-xs opacity-40 mt-1 uppercase tracking-widest">Kuttikkode M.S.V. L.P.S.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
