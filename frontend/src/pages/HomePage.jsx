import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Phone, MapPin, Clock, CheckCircle, Shield, Award, Users, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';

function RevealDiv({ children, className = '', delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) ref.current?.classList.add('visible'); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const defaultServices = [
  { name: 'General Checkup', description: 'Full oral examination, X-ray review and personalised treatment plan', duration_minutes: 30, price: 500, icon: '🔍' },
  { name: 'Teeth Cleaning', description: 'Professional scaling and polishing for healthy gums', duration_minutes: 45, price: 800, icon: '✨' },
  { name: 'Tooth Filling', description: 'Composite resin filling for cavities and tooth decay', duration_minutes: 45, price: 1200, icon: '🦷' },
  { name: 'Tooth Extraction', description: 'Safe and gentle removal of damaged or wisdom teeth', duration_minutes: 30, price: 1500, icon: '🩺' },
  { name: 'Root Canal', description: 'Complete root canal treatment with permanent filling', duration_minutes: 60, price: 4500, icon: '⚕️' },
  { name: 'Teeth Whitening', description: 'Professional in-clinic whitening for a brighter, confident smile', duration_minutes: 60, price: 3500, icon: '😁' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer, Flipkart', initials: 'PS', text: "Best dental experience I've had in Bangalore. Dr. Mehta was thorough, gentle, and explained everything clearly. The online booking saved me so much time.", rating: 5 },
  { name: 'Rohit Nair', role: 'Business Owner', initials: 'RN', text: 'The clinic is spotless and the staff is genuinely warm. Got my root canal done here — completely painless. Highest recommendation for anyone in Bangalore.', rating: 5 },
  { name: 'Anita Krishnamurthy', role: 'Teacher', initials: 'AK', text: "My kids actually look forward to coming here — that says everything. Dr. Mehta is brilliant with children. The online booking is a lifesaver for busy parents.", rating: 5 },
];

const faqs = [
  { q: 'Do I need to bring anything for my first visit?', a: 'Just yourself. If you have previous X-rays or dental records, do bring those along — it helps us plan better. Otherwise, we do a fresh comprehensive assessment on your first visit.' },
  { q: 'Is the clinic open on weekends?', a: 'We are open Monday to Saturday, 9 AM to 7 PM. We are closed on Sundays. You can book an appointment any time through this website.' },
  { q: 'How do I know which service I need?', a: 'Not sure? Just book a General Checkup. Our dentist will assess your oral health and recommend the right treatment — no pressure, no surprise upsells.' },
  { q: 'Is EMI available for expensive treatments?', a: 'Yes. For treatments above ₹5,000, we offer easy EMI options through popular payment providers. Ask our front desk for details when you visit.' },
];

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-card hover:bg-page transition-colors"
      >
        <span className="font-display font-600 text-slate text-sm sm:text-base">{q}</span>
        {open
          ? <ChevronUp size={17} className="text-steel flex-shrink-0" />
          : <ChevronDown size={17} className="text-slate-light flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-card border-t border-border border-l-2 border-l-steel">
          <p className="font-body text-slate-mid text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

const trustItems = ['✦ BDA Certified Clinic', '✦ 15+ Years of Excellence', '✦ 8,000+ Happy Patients', '✦ Transparent Pricing', '✦ Family-Friendly Care', '✦ Anxiety-Free Environment', '✦ 4.9★ Google Rating', '✦ Mon–Sat 9AM–7PM'];

export default function HomePage() {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    api.get('/api/services')
      .then(res => {
        if (res.data?.length > 0) {
          setServices(res.data.map((s, i) => ({ ...s, icon: ['🔍','✨','🦷','🩺','⚕️','😁'][i % 6] })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen bg-navy overflow-hidden flex items-center">
        {/* Depth overlay — lighter so orbs punch through */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(18,38,64,0.55)' }} />

        {/* ── Floating orbs ──
            Key fix: use light-tinted colors, not steel-on-navy (same hue = invisible).
            Less blur = color stays concentrated and visible.
            Each animation is unique so they never sync. */}

        {/* Orb A — bright sky-blue, top-right, 20s */}
        <div
          data-orb=""
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 520, height: 520,
            top: '-10%', right: '-5%',
            background: 'radial-gradient(circle, rgba(120,185,240,0.85) 0%, rgba(80,150,220,0.50) 45%, transparent 72%)',
            filter: 'blur(48px)',
            willChange: 'transform',
            animation: 'orb-drift-a 20s ease-in-out infinite',
          }}
        />

        {/* Orb B — warm amber-gold, bottom-left, 27s */}
        <div
          data-orb=""
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 400, height: 400,
            bottom: '-8%', left: '-5%',
            background: 'radial-gradient(circle, rgba(0,188,212,0.82) 0%, rgba(0,150,170,0.45) 45%, transparent 72%)',
            filter: 'blur(44px)',
            willChange: 'transform',
            animation: 'orb-drift-b 27s ease-in-out infinite 2s',
          }}
        />

        {/* Orb C — softer cyan-blue, center-right, 16s */}
        <div
          data-orb=""
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 280, height: 280,
            top: '28%', right: '18%',
            background: 'radial-gradient(circle, rgba(100,190,230,0.78) 0%, rgba(60,155,210,0.42) 45%, transparent 72%)',
            filter: 'blur(38px)',
            willChange: 'transform',
            animation: 'orb-drift-c 16s ease-in-out infinite 5s',
          }}
        />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-32 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <h1 className="font-display font-800 text-white mb-6">
                <span className="block font-normal text-xl sm:text-2xl lg:text-[2rem] text-white tracking-wide mb-3 lg:mb-4">
                  Eat, Laugh &
                </span>
                <span className="block text-[2.5rem] sm:text-[3rem] lg:text-[4.25rem] tracking-tight leading-none mb-3 lg:mb-4">
                  Smile Without
                </span>
                <span className="block text-[2.6rem] sm:text-[3.5rem] lg:text-[4.75rem] text-gold italic tracking-tight leading-none">
                  Hesitation.
                </span>
              </h1>

              <p className="font-body text-white/65 text-base sm:text-lg leading-relaxed mb-9 max-w-md">
                Expert dental care for the whole family. Gentle, honest, and affordable. Book your appointment online in 2 minutes.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/book" className="inline-flex items-center gap-2 bg-steel text-white font-display font-700 px-6 py-3.5 rounded-lg hover:bg-steel-light transition-colors text-sm sm:text-base">
                  Book Appointment <ArrowRight size={15} />
                </Link>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 border border-white/25 text-white font-display font-600 px-6 py-3.5 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base">
                  <Phone size={15} /> Call Us
                </a>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 sm:gap-10 pt-6 border-t border-white/10">
                {[
                  { num: '15+', label: 'Years experience' },
                  { num: '8,000+', label: 'Patients treated' },
                  { num: '4.9★', label: 'Google rating' },
                ].map((s, i) => (
                  <div key={i}>
                    <p className="font-display font-800 text-white text-2xl sm:text-3xl leading-none">{s.num}</p>
                    <p className="font-body text-white/45 text-xs mt-1.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right cards — desktop only
                Two-wrapper trick: outer div handles the one-shot rise entrance,
                inner .hero-card handles the infinite float — no transform conflict. */}
            <div className="hidden lg:flex flex-col gap-5 pt-8">
              {[
                { icon: <Shield size={18} />, title: 'Sterilised Equipment', desc: 'Every instrument autoclaved. BDA certified facility.' },
                { icon: <Award size={18} />, title: 'MDS Qualified Team', desc: 'Specialists in all dental procedures — implants to whitening.' },
                { icon: <Users size={18} />, title: 'Family-Friendly', desc: 'Gentle care for children and adults. Zero anxiety approach.' },
              ].map((c, i) => (
                /* Outer: one-shot entrance slide-up */
                <div
                  key={i}
                  data-card-wrap=""
                  className={i === 1 ? 'ml-10' : ''}
                  style={{ animation: `card-rise 0.65s ease-out ${0.3 + i * 0.18}s both` }}
                >
                  {/* Inner: infinite float at different speeds per card */}
                  <div
                    data-card-float=""
                    className="hero-card rounded-2xl p-5 flex gap-4 items-start"
                    style={{ animation: `card-float ${3.4 + i * 0.6}s ease-in-out ${1.2 + i * 0.2}s infinite` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)' }}>
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-700 text-white text-sm mb-1">{c.title}</h3>
                      <p className="font-body text-white/65 text-xs leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Wave into marquee */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 55" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
            <path d="M0 55 L0 28 Q360 0 720 28 Q1080 55 1440 18 L1440 55 Z" fill="#28201A" />
          </svg>
        </div>
      </section>

      {/* ── TRUST MARQUEE ── */}
      <div className="bg-slate overflow-hidden py-3">
        <div className="flex whitespace-nowrap marquee-track">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="font-body text-xs text-white/50 mx-6 flex-shrink-0">{item}</span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section id="services" className="py-16 sm:py-24 bg-page">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="mb-12 sm:mb-16">
            <span className="font-body text-xs font-600 text-steel uppercase tracking-widest">What we treat</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl md:text-5xl mt-2 mb-3 leading-tight">Our Services</h2>
            <p className="font-body text-slate-mid text-base sm:text-lg max-w-xl">
              From routine checkups to advanced procedures — all under one roof. Transparent pricing, always.
            </p>
          </RevealDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s, i) => (
              <RevealDiv key={s.id || i} delay={i * 60}>
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 hover:shadow-warm hover:border-steel/25 transition-all group h-full flex flex-col">
                  <div className="w-12 h-12 bg-steel-pale rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-steel group-hover:text-white transition-colors">
                    {s.icon}
                  </div>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-display font-700 text-slate text-base">{s.name}</h3>
                    <span className="font-display font-700 text-steel text-sm flex-shrink-0">₹{s.price}</span>
                  </div>
                  <p className="font-body text-slate-mid text-sm leading-relaxed flex-1 mb-3">{s.description}</p>
                  <p className="font-body text-slate-muted text-xs">⏱ {s.duration_minutes} min appointment</p>
                </div>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="mt-12 text-center">
            <Link to="/book" className="inline-flex items-center gap-2 bg-steel text-white font-display font-700 px-7 py-3.5 rounded-lg hover:bg-steel-light transition-colors">
              Book an Appointment <ArrowRight size={16} />
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-16 sm:py-24 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <RevealDiv>
              <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #3870A8, transparent)' }} />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, #D4921C, transparent)' }} />
                <div className="relative">
                  <div className="text-5xl sm:text-6xl mb-5">🦷</div>
                  <h3 className="font-display font-800 text-2xl sm:text-3xl mb-3 leading-tight">
                    15 years of trusted<br />smiles in Bangalore.<br /><span className="text-gold">Built on honesty.</span>
                  </h3>
                  <p className="font-body text-white/65 text-sm leading-relaxed mb-6">
                    Dr. Arjun Mehta (MDS, Manipal) founded SmileCare in 2010 because he believed every patient deserves honest, painless, affordable dental care — without being pushed into unnecessary treatments.
                  </p>
                  <div className="flex gap-6 pt-5 border-t border-white/10">
                    {[{ num: '15+', label: 'Years' }, { num: '8K+', label: 'Patients' }, { num: '4.9', label: 'Rating' }].map((s, i) => (
                      <div key={i}>
                        <p className="font-display font-800 text-gold text-2xl leading-none">{s.num}</p>
                        <p className="font-body text-white/45 text-xs mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealDiv>

            <div>
              <RevealDiv delay={100}>
                <span className="font-body text-xs font-600 text-steel uppercase tracking-widest">Why SmileCare</span>
                <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2 mb-4 leading-tight">
                  We make dental care<br />feel less scary.
                </h2>
                <p className="font-body text-slate-mid text-base sm:text-lg leading-relaxed mb-7">
                  Most people avoid the dentist because of bad past experiences. We're here to change that — with clear communication, gentle techniques, and zero surprise bills.
                </p>
              </RevealDiv>
              <div className="space-y-4">
                {[
                  'BDA certified clinic with sterilised equipment',
                  'Transparent pricing — no surprise bills ever',
                  'Flexible slots: 9 AM to 7 PM, Mon–Sat',
                  'EMI available on treatments above ₹5,000',
                  'Free follow-up consultation within 7 days',
                ].map((point, i) => (
                  <RevealDiv key={i} delay={140 + i * 60}>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-steel-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle size={13} className="text-steel" />
                      </div>
                      <p className="font-body text-slate text-sm sm:text-base">{point}</p>
                    </div>
                  </RevealDiv>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-24 bg-page">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="mb-10 sm:mb-14">
            <span className="font-body text-xs font-600 text-steel uppercase tracking-widest">Patient reviews</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2">What our patients say</h2>
          </RevealDiv>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <RevealDiv key={i} delay={i * 70}>
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 h-full flex flex-col hover:shadow-warm transition-all relative overflow-hidden">
                  <span className="absolute top-3 right-4 font-display text-7xl text-[#E0D0BC] select-none pointer-events-none leading-none" aria-hidden="true">"</span>
                  <div className="flex gap-0.5 mb-4 relative">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={13} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="font-body text-slate-mid text-sm leading-relaxed flex-1 mb-5 relative">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border relative">
                    <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-700 text-white text-xs">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-display font-700 text-slate text-sm">{t.name}</p>
                      <p className="font-body text-slate-muted text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <RevealDiv className="text-center mb-12">
            <span className="font-body text-xs font-600 text-steel uppercase tracking-widest">Common questions</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2">Frequently Asked</h2>
          </RevealDiv>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <RevealDiv key={i} delay={i * 60}>
                <FAQ q={f.q} a={f.a} />
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-16 sm:py-24 bg-page">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="mb-10 sm:mb-14">
            <span className="font-body text-xs font-600 text-steel uppercase tracking-widest">Get in touch</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2">Find us in Bangalore</h2>
          </RevealDiv>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <MapPin size={18} />, label: 'Address', lines: ['14, MG Road, Near Central Mall', 'Bangalore – 560001'] },
              { icon: <Phone size={18} />, label: 'Phone', lines: ['+91 98765 43210', '+91 80 4567 8901'] },
              { icon: <Clock size={18} />, label: 'Hours', lines: ['Mon – Sat: 9 AM – 7 PM', 'Sunday: Closed'] },
              { icon: <Star size={18} />, label: 'Rating', lines: ['4.9 / 5.0 on Google', '620+ patient reviews'] },
            ].map((item, i) => (
              <RevealDiv key={i} delay={i * 60}>
                <div className="bg-card border border-border rounded-2xl p-5 h-full hover:shadow-warm hover:border-steel/25 transition-all">
                  <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white mb-3 flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="font-display font-700 text-slate text-sm mb-1.5">{item.label}</p>
                  {item.lines.map((l, j) => (
                    <p key={j} className="font-body text-slate-mid text-sm leading-relaxed">{l}</p>
                  ))}
                </div>
              </RevealDiv>
            ))}
          </div>

          {/* CTA banner */}
          <RevealDiv className="mt-10">
            <div className="bg-navy rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #3870A8, transparent)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-[0.12] pointer-events-none" style={{ background: 'radial-gradient(circle, #D4921C, transparent)' }} />
              <div className="relative">
                <h3 className="font-display font-800 text-white text-2xl sm:text-3xl mb-3">Stop putting it off.</h3>
                <p className="font-body text-white/60 text-base mb-7 max-w-md mx-auto">Your teeth won't fix themselves. Book now — slots fill fast.</p>
                <Link to="/book" className="inline-flex items-center gap-2 bg-gold text-slate font-display font-700 px-8 py-4 rounded-xl hover:bg-gold-light transition-colors text-base">
                  Book Your Appointment <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-navy rounded-xl flex items-center justify-center text-sm">🦷</div>
                <span className="font-display font-800 text-white text-lg">Smile<span className="text-gold">Care</span></span>
              </div>
              <p className="font-body text-white/45 text-sm leading-relaxed max-w-xs">
                Trusted dental care for the whole family. Serving Bangalore since 2010.
              </p>
            </div>
            <div>
              <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/35 mb-4">Navigate</h4>
              <ul className="space-y-2.5">
                {['Home', 'Services', 'About', 'Contact'].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="font-body text-sm text-white/55 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/35 mb-4">Contact</h4>
              <ul className="space-y-2.5 font-body text-sm text-white/55">
                <li>14, MG Road, Bangalore</li>
                <li>+91 98765 43210</li>
                <li>hello@smilecare.in</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-body text-xs text-white/30">© 2025 SmileCare Dental Clinic. All rights reserved.</p>
            <p className="font-body text-xs text-white/30">Bangalore, Karnataka</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
