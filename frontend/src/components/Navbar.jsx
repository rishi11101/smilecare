import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setOpen(false);
    if (href.startsWith('#')) {
      if (!isHome) { window.location.href = '/' + href; return; }
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    }
  };

  const scrolled_or_not_home = scrolled || !isHome;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled_or_not_home
          ? 'bg-card/95 backdrop-blur-sm shadow-warm border-b border-border py-3'
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-display font-800 transition-colors ${
              scrolled_or_not_home ? 'bg-navy text-white' : 'bg-white/20 border border-white/30 text-white'
            }`}>🦷</div>
            <div className="leading-none">
              <p className={`font-display font-800 text-lg tracking-tight transition-colors ${scrolled_or_not_home ? 'text-navy' : 'text-white'}`}>
                Smile<span className={scrolled_or_not_home ? 'text-steel' : 'text-gold'}>Care</span>
              </p>
              <p className={`font-body text-xs transition-colors ${scrolled_or_not_home ? 'text-slate-light' : 'text-white/60'}`}>Dental Clinic</p>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                  className={`font-body text-sm font-500 transition-colors relative group ${
                    scrolled_or_not_home ? 'text-slate-mid hover:text-navy' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${scrolled_or_not_home ? 'bg-steel' : 'bg-gold'}`} />
                </a>
              </li>
            ))}
            <li>
              <a href="tel:+919876543210" className={`hidden lg:inline-flex items-center gap-1.5 text-xs font-body font-500 transition-colors ${scrolled_or_not_home ? 'text-slate-mid hover:text-navy' : 'text-white/70 hover:text-white'}`}>
                <Phone size={13} /> +91 98765 43210
              </a>
            </li>
            <li>
              <Link to="/book" className="text-sm font-display font-700 px-5 py-2.5 rounded-lg bg-steel text-white hover:bg-steel-light transition-colors">
                Book Appointment
              </Link>
            </li>
          </ul>

          <button onClick={() => setOpen(!open)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled_or_not_home ? 'text-slate hover:bg-page' : 'text-white hover:bg-white/10'}`} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-card shadow-warm-lg transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-5 py-4 bg-navy">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">🦷</div>
              <span className="font-display font-800 text-white text-base">Smile<span className="text-gold">Care</span></span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white p-1"><X size={18} /></button>
          </div>
          <div className="px-5 py-6">
            <ul className="space-y-1 mb-6">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                    className="block px-4 py-3 rounded-xl text-slate font-body text-base hover:bg-steel-pale hover:text-navy transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link to="/book" onClick={() => setOpen(false)} className="block w-full text-center bg-steel text-white font-display font-700 py-3.5 rounded-xl hover:bg-steel-light transition-colors">
              Book Appointment
            </Link>
            <a href="tel:+919876543210" className="flex items-center justify-center gap-2 mt-3 text-sm font-body text-slate-mid">
              <Phone size={14} /> +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
