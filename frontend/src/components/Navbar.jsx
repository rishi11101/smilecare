import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
    { label: 'Home', href: isHome ? '#home' : '/' },
    { label: 'Services', href: isHome ? '#services' : '/#services' },
    { label: 'About', href: isHome ? '#about' : '/#about' },
    { label: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ];

  const handleNavClick = (href) => {
    setOpen(false);
    if (href.startsWith('#')) {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 10);
    }
  };

  const navBg = scrolled || !isHome
    ? 'bg-white shadow-sm border-b border-gray-100 py-3'
    : 'bg-transparent py-4';

  const logoColor = scrolled || !isHome ? 'text-navy' : 'text-white';
  const linkColor = scrolled || !isHome ? 'text-slate-mid hover:text-navy' : 'text-white/90 hover:text-white';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-colors ${
              scrolled || !isHome ? 'bg-navy' : 'bg-white/20 border border-white/30'
            }`}>🦷</div>
            <div className="leading-none">
              <span className={`font-display font-800 text-base sm:text-lg tracking-tight transition-colors ${logoColor}`}>
                SmileCare
              </span>
              <span className={`hidden sm:block font-body text-xs transition-colors ${
                scrolled || !isHome ? 'text-slate-light' : 'text-white/60'
              }`}>Dental Clinic</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => handleNavClick(l.href)}
                  className={`font-body text-sm font-500 transition-colors relative group ${linkColor}`}
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/book"
                className={`text-sm font-display font-700 px-5 py-2.5 rounded-lg transition-colors ${
                  scrolled || !isHome
                    ? 'bg-navy text-white hover:bg-navy-dark'
                    : 'bg-white text-navy hover:bg-white/90'
                }`}
              >
                Book Appointment
              </Link>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled || !isHome ? 'text-slate hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 bg-navy">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm">🦷</div>
              <span className="font-display font-800 text-white text-base">SmileCare</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          {/* Drawer nav */}
          <div className="px-5 py-6">
            <ul className="space-y-1 mb-6">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      if (l.href.startsWith('#')) e.preventDefault();
                      handleNavClick(l.href);
                    }}
                    className="block px-4 py-3 rounded-xl text-slate font-body text-base hover:bg-sky hover:text-navy transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-navy text-white font-display font-700 py-3.5 rounded-xl hover:bg-navy-dark transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
