"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",       href: "home" },
  { label: "Fitur",      href: "fitur" },
  { label: "Cara Kerja", href: "cara-kerja" },
  { label: "Kontak",     href: "kontak" },
];

/* ── tiny hook: returns true once element enters viewport ── */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection]   = useState("home");
  const [scrolled, setScrolled]             = useState(false);
  const [loaded, setLoaded]                 = useState(false);

  /* trigger load animation after mount */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* scroll tracker */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = NAV_LINKS.map((l) => l.href);
      let current = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback((e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  /* in-view refs */
  const [fiturRef, fiturInView] = useInView();
  const [caraRef,  caraInView]  = useInView();
  const [ctaRef,   ctaInView]   = useInView();

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity:0; transform:translateY(-20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(36px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity:0; transform:translateX(44px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1); }
        }

        /* paused until parent gets .loaded */
        .anim-navbar   { animation: fadeDown 0.6s cubic-bezier(.22,1,.36,1) both; animation-play-state:paused; }
        .anim-up       { animation: fadeUp   0.7s cubic-bezier(.22,1,.36,1) both; animation-play-state:paused; }
        .anim-left     { animation: fadeLeft 0.75s cubic-bezier(.22,1,.36,1) both; animation-play-state:paused; }
        .anim-scale    { animation: scaleIn  0.65s cubic-bezier(.22,1,.36,1) both; animation-play-state:paused; }

        .loaded .anim-navbar,
        .loaded .anim-up,
        .loaded .anim-left,
        .loaded .anim-scale { animation-play-state:running; }

        .d1  { animation-delay:0.08s; }
        .d2  { animation-delay:0.18s; }
        .d3  { animation-delay:0.28s; }
        .d4  { animation-delay:0.38s; }
        .d5  { animation-delay:0.48s; }
        .d6  { animation-delay:0.58s; }
        .d7  { animation-delay:0.72s; }

        /* scroll reveal */
        .reveal {
          opacity:0;
          transform:translateY(30px);
          transition: opacity 0.65s cubic-bezier(.22,1,.36,1),
                      transform 0.65s cubic-bezier(.22,1,.36,1);
        }
        .reveal.in-view { opacity:1; transform:translateY(0); }
        .sd1 { transition-delay:0.05s; }
        .sd2 { transition-delay:0.20s; }
        .sd3 { transition-delay:0.35s; }
      `}</style>

      <main className={`min-h-screen bg-white font-sans${loaded ? " loaded" : ""}`}>

        {/* ── NAVBAR ── */}
        <nav className={`anim-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
                     : "bg-white/80 backdrop-blur-sm border-b border-transparent"}`}
        >
          <div className="max-w-[85%] mx-auto px-8 py-5 flex items-center justify-between">
            <a href="#home" onClick={(e) => handleNavClick(e, "home")} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <img src="/image/logo.png" alt="ProcSpy Logo" className="w-6 h-6 object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-gray-900 text-xl">ProcSpy</span>
            </a>

            <div className="hidden md:flex items-center gap-2">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeSection === href;
                return (
                  <a key={href} href={`#${href}`} onClick={(e) => handleNavClick(e, href)}
                    className={`relative px-5 py-2.5 text-lg font-medium rounded-lg transition-all duration-200 group
                      ${isActive ? "text-indigo-700 font-semibold" : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"}`}
                  >
                    {label}
                    <span className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-indigo-600 transition-all duration-300 origin-left
                      ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40"}`} />
                  </a>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="text-gray-700 text-lg font-medium hover:text-indigo-700 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50">
                Masuk
              </Link>
              <Link href="/register" className="bg-indigo-700 hover:bg-indigo-800 active:scale-95 text-white text-lg font-semibold px-6 py-2.5 rounded-lg transition-all duration-150 shadow-md shadow-indigo-200">
                Daftar
              </Link>
            </div>

            <button className="md:hidden text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activeSection === href;
                return (
                  <a key={href} href={`#${href}`} onClick={(e) => handleNavClick(e, href)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                      ${isActive ? "text-indigo-700 bg-indigo-50 font-semibold border-l-2 border-indigo-600 pl-3"
                                 : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"}`}
                  >{label}</a>
                );
              })}
              <div className="flex gap-3 pt-3 mt-1 border-t border-gray-100">
                <Link href="/login" className="text-gray-700 text-sm font-medium hover:text-indigo-700 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50">Masuk</Link>
                <button className="bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-indigo-800 transition-colors">Daftar</button>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="home" className="pt-40 pb-36 px-8 max-w-[85%] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left — staggered fade-up */}
            <div className="flex-1">

              <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-8">
                <span className="block anim-up d2">Pengawasan Ujian</span>
                <span className="block anim-up d3">Online Yang</span>
                <span className="block text-indigo-600 anim-up d4">Terpercaya</span>
              </h1>

              <p className="anim-up d5 text-gray-500 text-xl mb-12 leading-relaxed max-w-lg">
                Sistem monitoring ujian online untuk memastikan integritas dan keamanan ujian.
              </p>

              <div className="anim-up d6 flex flex-wrap gap-5">
                <Link href="/login"
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-9 py-4 rounded-xl transition-all hover:scale-105 shadow-lg shadow-indigo-200 inline-block text-lg">
                  Mulai Sekarang
                </Link>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-9 py-4 rounded-xl transition-all hover:scale-105 text-lg">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>

            {/* Right — slide from right */}
            <div className="anim-left d4 flex-1 flex justify-center relative">
              <div className="relative w-96 md:w-[420px]">
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden flex items-end justify-center shadow-xl">
                  <div className="w-72 h-80 bg-gradient-to-t from-indigo-200 to-transparent rounded-t-full" />
                </div>
                <div className="anim-scale d7 absolute bottom-8 right-0 translate-x-8 bg-white rounded-2xl shadow-lg px-5 py-4 flex items-center gap-4 min-w-max">
                  <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-gray-900 leading-none">98</p>
                    <p className="text-sm text-gray-400 mt-0.5">Online Student</p>
                  </div>
                  <div className="flex -space-x-2 ml-1">
                    {["bg-indigo-400","bg-yellow-400","bg-pink-400","bg-green-400"].map((c, i) => (
                      <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-white`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FITUR UNGGULAN ── */}
        <section id="fitur" className="py-36 px-8 bg-gray-50" ref={fiturRef}>
          <div className="max-w-[85%] mx-auto">
            <div className={`text-center mb-14 reveal ${fiturInView ? "in-view" : ""}`}>
              <h2 className="text-5xl font-extrabold text-gray-900 mb-5">Fitur Unggulan</h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Teknologi canggih untuk pengawasan ujian online yang komprehensif dan efektif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  sd: "sd1",
                  iconBg: "bg-gray-900 group-hover:bg-indigo-700",
                  icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>,
                  title: "Monitoring Video Real-time",
                  desc: "Pantau peserta ujian secara langsung dengan teknologi streaming video berkualitas tinggi.",
                },
                {
                  sd: "sd2",
                  iconBg: "bg-orange-100 group-hover:bg-orange-500",
                  icon: <svg className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>,
                  title: "Deteksi Kecurangan Otomatis",
                  desc: "Sistem otomatis yang mendeteksi perilaku mencurigakan dan aktivitas tidak wajar selama ujian.",
                },
                {
                  sd: "sd3",
                  iconBg: "bg-indigo-100 group-hover:bg-indigo-700",
                  icon: <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                  title: "Laporan Komprehensif",
                  desc: "Dapatkan laporan detail tentang aktivitas ujian dan analisis perilaku peserta.",
                },
              ].map(({ sd, iconBg, icon, title, desc }) => (
                <div key={title} className={`reveal ${sd} ${fiturInView ? "in-view" : ""} bg-white rounded-2xl px-10 py-12 shadow-sm hover:shadow-md transition-all border border-gray-100 group`}>
                  <div className={`w-16 h-16 ${iconBg} rounded-xl flex items-center justify-center mb-6 transition-colors`}>
                    {icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-3">{title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARA KERJA ── */}
        <section id="cara-kerja" className="py-36 px-8" ref={caraRef}>
          <div className="max-w-[85%] mx-auto">
            <div className={`text-center mb-16 reveal ${caraInView ? "in-view" : ""}`}>
              <h2 className="text-5xl font-extrabold text-gray-900 mb-5">Cara Kerja</h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Proses sederhana untuk memulai pengawasan ujian online yang efektif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
              <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-yellow-200" />
              {[
                { step:"1", title:"Daftar & Setup",     sd:"sd1" },
                { step:"2", title:"Undang Peserta",      sd:"sd2" },
                { step:"3", title:"Monitor & Analisis",  sd:"sd3" },
              ].map(({ step, title, sd }) => (
                <div key={step} className={`reveal ${sd} ${caraInView ? "in-view" : ""} flex flex-col items-center text-center`}>
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-extrabold text-2xl mb-6 shadow-lg shadow-yellow-100 z-10">
                    {step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-2xl mb-3">{title}</h3>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
                    Proses sederhana untuk memulai pengawasan ujian online yang efektif
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-28 px-6 bg-indigo-900" ref={ctaRef}>
          <div className={`max-w-4xl mx-auto text-center reveal ${ctaInView ? "in-view" : ""}`}>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              Siap Memulai{" "}
              <span className="text-yellow-400">Pengawasan Ujian Online?</span>
            </h2>
            <p className="text-indigo-200 text-lg mb-12 leading-relaxed">
              Bergabunglah dengan ribuan institusi pendidikan yang telah mempercayai ProcSpy untuk ujian online mereka
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-10 py-4 rounded-xl transition-all hover:scale-105 inline-block text-lg">
                Masuk ke Akun
              </Link>
              <Link href="/register" className="border-2 border-white text-white font-semibold px-10 py-4 rounded-xl hover:bg-white hover:text-indigo-900 transition-all hover:scale-105 text-lg">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer id="kontak" className="py-14 px-8 bg-white border-t border-gray-100">
          <div className="max-w-[85%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                  </div>
                  <span className="font-bold text-gray-900 text-lg">ProcSpy</span>
                </div>
                <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                  Solusi pengawasan ujian online terdepan dengan teknologi terkini untuk memastikan integritas ujian online
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Produk</h4>
                <ul className="space-y-2">
                  {["Fitur","Harga","Demo"].map((item) => (
                    <li key={item}><a href="#" className="text-gray-500 hover:text-indigo-700 text-sm transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Dukungan</h4>
                <ul className="space-y-2">
                  {["Bantuan","Kontak","FAQ"].map((item) => (
                    <li key={item}><a href="#" className="text-gray-500 hover:text-indigo-700 text-sm transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-400 text-sm">© Copyright 2025 by ProcSpy</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}