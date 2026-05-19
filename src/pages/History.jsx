import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const History = () => {
  const containerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // ── Smooth Scroll (Lenis) ──────────────────────────────────────────────
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    // ── Reveal Animations ──────────────────────────────────────────────────
    gsap.utils.toArray('.reveal').forEach((elem) => {
      gsap.fromTo(elem,
        { y: 80, opacity: 0, rotateX: 12, scale: 0.96, transformPerspective: 800 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: elem, start: 'top 92%' }
        }
      );
    });

    gsap.utils.toArray('.stagger-grid').forEach((grid) => {
      gsap.fromTo(grid.children,
        { y: 60, opacity: 0, rotateY: 8, transformPerspective: 600 },
        {
          y: 0, opacity: 1, rotateY: 0, stagger: 0.18, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 85%' }
        }
      );
    });

    return () => {
      lenis.destroy(); lenisRef.current = null;
      ScrollTrigger.getAll().forEach(t => t.revert());
    };
  }, []);

  const historyData = [
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
  ];

  return (
    <div ref={containerRef} className="relative bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      
      {/* Navigation */}
      <header className="fixed top-0 left-0 w-full z-[60] bg-white/90 backdrop-blur-xl border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <img src="/logo.svg" className="w-8 h-8 object-contain" alt="Logo" />
            <span className="text-xl font-headline font-bold text-primary tracking-tight">K.M.S.V. L.P.S.</span>
          </Link>
          <Link to="/" className="text-on-surface-variant font-bold text-sm flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 bg-on-background text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 reveal">
          <p className="text-primary font-bold tracking-widest uppercase mb-4">The Complete Journey</p>
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6">90+ Years of <span className="text-primary italic">Heritage</span></h1>
          <p className="text-xl text-white/70 leading-relaxed">
            From our humble beginnings under a banyan tree in 1932 to becoming Palakkad's most trusted digital primary school. This is our story of passion, community, and education.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[38px] md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2"></div>
          
          <div className="flex flex-col gap-16 md:gap-24">
            {historyData.map((era, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start reveal ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[38px] md:left-1/2 top-0 -translate-x-1/2 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-brutal z-10">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{era.icon}</span>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 pl-24 md:pl-0 pt-2 flex flex-col">
                  <div className={`md:px-8 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <time className="text-4xl md:text-6xl font-headline font-bold text-primary mb-2 block">{era.year}</time>
                    <h3 className="text-2xl md:text-3xl font-bold font-headline mb-4">{era.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed mb-6">{era.desc}</p>
                  </div>
                </div>

                {/* Image */}
                <div className={`w-full md:w-1/2 pl-24 md:pl-0 mt-4 md:mt-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="rounded-[2rem] overflow-hidden border-2 border-outline/10 shadow-xl group relative">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay"></div>
                    <img src={era.img} alt={era.title} className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-surface-variant py-24 px-6 border-t-2 border-primary/10">
        <div className="max-w-4xl mx-auto text-center reveal">
          <span className="material-symbols-outlined text-5xl text-primary mb-6">school</span>
          <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Be a Part of Our Next Chapter</h2>
          <p className="text-on-surface-variant text-lg mb-10">Admissions are now open for the upcoming academic year. Secure your child's future at K.M.S.V. L.P.S. Kutticode.</p>
          <Link to="/" className="px-12 py-5 bg-primary text-white rounded-full text-xl font-bold border-2 border-primary shadow-brutal hover:translate-y-1 transition-all inline-block">
            BACK TO HOME
          </Link>
        </div>
      </section>
    </div>
  );
};

export default History;
