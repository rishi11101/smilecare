import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Phone, MapPin, Clock, CheckCircle, Shield, Award, Users } from 'lucide-react';
import api from '../utils/api';

function useReveal() {
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) ref.current?.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const defaultServices = [
  { name: 'General Checkup', description: 'Full oral examination, X-ray review and treatment plan', duration_minutes: 30, price: 500, emoji: '🔍' },
  { name: 'Teeth Cleaning', description: 'Professional scaling and polishing for healthy gums', duration_minutes: 45, price: 800, emoji: '✨' },
  { name: 'Tooth Filling', description: 'Composite resin filling for cavities and tooth decay', duration_minutes: 45, price: 1200, emoji: '🦷' },
  { name: 'Tooth Extraction', description: 'Safe removal of damaged or wisdom teeth', duration_minutes: 30, price: 1500, emoji: '🩺' },
  { name: 'Root Canal', description: 'Complete root canal treatment with permanent filling', duration_minutes: 60, price: 4500, emoji: '⚕️' },
  { name: 'Teeth Whitening', description: 'Professional in-clinic whitening for a brighter smile', duration_minutes: 60, price: 3500, emoji: '😁' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Software Engineer', initials: 'PS', text: "Best dental experience I've had in Bangalore. Dr. Mehta was thorough, gentle, and explained everything clearly. Booking online was super easy.", rating: 5 },
  { name: 'Rohit Nair', role: 'Business Owner', initials: 'RN', text: 'The clinic is spotless and the staff is professional. Got my root canal done here — painless procedure. Would highly recommend SmileCare.', rating: 5 },
  { name: 'Anita Krishnamurthy', role: 'Teacher', initials: 'AK', text: "My kids love coming here! Dr. Mehta is amazing with children. The online booking system is very convenient — I book slots at 11pm after the kids sleep!", rating: 5 },
];

export default function HomePage() {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    api.get('/api/services')
      .then(res => {
        if (res.data?.length > 0) {
          const withEmoji = res.data.map((s, i) => ({
            ...s,
            emoji: ['🔍','✨','🦷','🩺','⚕️','😁'][i % 6]
          }));
          setServices(withEmoji);
        }
      })
      .catch(() => {}); // use defaults silently
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen bg-navy overflow-hidden flex items-center">
        {/* Background shapes */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] rounded-full bg-navy-light opacity-20 translate-x-1/2 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 rounded-full bg-sky opacity-5 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pt-28 sm:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-body px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              Bangalore's trusted dental care since 2010
            </div>

            <h1 className="font-display font-800 text-white leading-[1.1] mb-5">
              <span className="block text-4xl sm:text-5xl lg:text-6xl">Your Smile</span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl">Deserves <span className="text-gold italic">the Best.</span></span>
            </h1>

            <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed mb-7 max-w-md">
              Expert dental care for the whole family. Book your appointment online in under 2 minutes — no waiting, no hassle.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-gold text-slate font-display font-700 px-6 py-3 sm:py-3.5 rounded-lg hover:bg-gold-light transition-colors text-sm sm:text-base"
              >
                Book Appointment <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-display font-600 px-6 py-3 sm:py-3.5 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                <Phone size={15} /> Call Us
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 pt-6 border-t border-white/10">
              {[
                { num: '15+', label: 'Years experience' },
                { num: '8,000+', label: 'Patients treated' },
                { num: '4.9★', label: 'Google rating' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="font-display font-800 text-white text-lg sm:text-xl leading-none">{s.num}</p>
                  <p className="font-body text-white/50 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — info cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {[
              { icon: <Shield size={20} />, title: 'Sterilised Equipment', desc: 'Every instrument autoclaved before use. Certified by BDA.' },
              { icon: <Award size={20} />, title: 'Qualified Dentists', desc: 'MDS qualified team with specialisation in all dental procedures.' },
              { icon: <Users size={20} />, title: 'Family-Friendly', desc: 'Gentle care for kids and adults. We make every visit comfortable.' },
            ].map((c, i) => (
              <div key={i} className={`bg-white/10 border border-white/15 rounded-2xl p-5 flex gap-4 items-start ${i === 1 ? 'ml-8' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <h3 className="font-display font-700 text-white text-sm mb-1">{c.title}</h3>
                  <p className="font-body text-white/60 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
            <path d="M0 50 L0 25 Q360 0 720 25 Q1080 50 1440 15 L1440 50 Z" fill="#F7F9FC" />
          </svg>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-14 sm:py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="text-center mb-10 sm:mb-14">
            <span className="font-body text-xs font-500 text-gold uppercase tracking-widest">What we treat</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl md:text-5xl mt-2 mb-3">Our Services</h2>
            <p className="font-body text-slate-mid text-base sm:text-lg max-w-xl mx-auto">
              From routine checkups to advanced procedures — all under one roof.
            </p>
          </RevealDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {services.map((s, i) => (
              <RevealDiv key={s.id || i} delay={i * 60}>
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-md hover:border-sky-dark transition-all group">
                  <div className="w-12 h-12 bg-sky rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                    {s.emoji}
                  </div>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="font-display font-700 text-slate text-base">{s.name}</h3>
                    <span className="font-display font-700 text-navy text-sm flex-shrink-0">₹{s.price}</span>
                  </div>
                  <p className="font-body text-slate-mid text-sm leading-relaxed mb-3">{s.description}</p>
                  <p className="font-body text-slate-light text-xs">⏱ {s.duration_minutes} min</p>
                </div>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="text-center mt-10">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-navy text-white font-display font-700 px-7 py-3.5 rounded-lg hover:bg-navy-dark transition-colors"
            >
              Book an Appointment <ArrowRight size={16} />
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left card */}
            <RevealDiv>
              <div className="bg-navy rounded-3xl p-6 sm:p-8 text-white relative">
                <div className="text-5xl sm:text-6xl mb-4">🦷</div>
                <h3 className="font-display font-800 text-2xl sm:text-3xl mb-3 leading-tight">
                  15 years of<br />trusted smiles<br /><span className="text-gold">in Bangalore.</span>
                </h3>
                <p className="font-body text-white/70 text-sm leading-relaxed">
                  Dr. Arjun Mehta (MDS, Manipal) founded SmileCare in 2010 with a simple belief: every patient deserves honest, painless, affordable dental care.
                </p>
                {/* Inline stats for mobile */}
                <div className="flex gap-4 mt-6 pt-5 border-t border-white/10">
                  <div>
                    <p className="font-display font-800 text-gold text-2xl">15+</p>
                    <p className="font-body text-white/50 text-xs">Years</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="font-display font-800 text-gold text-2xl">8K+</p>
                    <p className="font-body text-white/50 text-xs">Patients</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="font-display font-800 text-gold text-2xl">4.9</p>
                    <p className="font-body text-white/50 text-xs">Rating</p>
                  </div>
                </div>
              </div>
            </RevealDiv>

            {/* Right */}
            <div>
              <RevealDiv delay={100}>
                <span className="font-body text-xs font-500 text-gold uppercase tracking-widest">Why SmileCare</span>
                <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2 mb-4 sm:mb-5 leading-tight">
                  We make dental care<br />feel less scary.
                </h2>
                <p className="font-body text-slate-mid text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  We know most people avoid the dentist. That's why we focus on clear communication, gentle techniques, and fair pricing — so you actually want to come back.
                </p>
              </RevealDiv>

              <div className="space-y-4">
                {[
                  'BDA certified clinic with sterilised equipment',
                  'Transparent pricing — no surprise bills',
                  'Flexible slots: 9 AM to 7 PM, Mon–Sat',
                  'EMI available on treatments above ₹5,000',
                  'Free follow-up consultation within 7 days',
                ].map((point, i) => (
                  <RevealDiv key={i} delay={150 + i * 60}>
                    <div className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-navy flex-shrink-0 mt-0.5" />
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
      <section className="py-14 sm:py-20 bg-offwhite">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="text-center mb-10 sm:mb-12">
            <span className="font-body text-xs font-500 text-gold uppercase tracking-widest">Patient reviews</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2">What our patients say</h2>
          </RevealDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <RevealDiv key={i} delay={i * 70}>
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={13} className="text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="font-body text-slate-mid text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-700 text-white text-xs">{t.initials}</span>
                    </div>
                    <div>
                      <p className="font-display font-700 text-slate text-sm">{t.name}</p>
                      <p className="font-body text-slate-light text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <RevealDiv className="text-center mb-10 sm:mb-12">
            <span className="font-body text-xs font-500 text-gold uppercase tracking-widest">Get in touch</span>
            <h2 className="font-display font-800 text-slate text-3xl sm:text-4xl mt-2">Find us in Bangalore</h2>
          </RevealDiv>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <MapPin size={20} />, label: 'Address', lines: ['14, MG Road, Near Central Mall', 'Bangalore – 560001'] },
              { icon: <Phone size={20} />, label: 'Phone', lines: ['+91 98765 43210', '+91 80 4567 8901'] },
              { icon: <Clock size={20} />, label: 'Hours', lines: ['Mon – Sat: 9 AM – 7 PM', 'Sunday: Closed'] },
              { icon: <Star size={20} />, label: 'Rating', lines: ['4.9 / 5.0 on Google', '620+ patient reviews'] },
            ].map((item, i) => (
              <RevealDiv key={i} delay={i * 60}>
                <div className="bg-offwhite rounded-2xl p-5 border border-gray-100 h-full">
                  <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white mb-3 flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="font-display font-700 text-slate text-sm mb-1">{item.label}</p>
                  {item.lines.map((l, j) => (
                    <p key={j} className="font-body text-slate-mid text-sm">{l}</p>
                  ))}
                </div>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="mt-8 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 bg-navy text-white font-display font-700 px-8 py-4 rounded-xl hover:bg-navy-dark transition-colors text-base"
            >
              Book Your Appointment Now <ArrowRight size={16} />
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-sm">🦷</div>
                <span className="font-display font-800 text-lg">SmileCare <span className="text-gold">Dental</span></span>
              </div>
              <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs">
                Trusted dental care for the whole family. Serving Bangalore since 2010.
              </p>
            </div>
            <div>
              <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/40 mb-3">Navigate</h4>
              <ul className="space-y-2">
                {['Home', 'Services', 'About', 'Contact'].map(l => (
                  <li key={l}><a href={`#${l.toLowerCase()}`} className="font-body text-sm text-white/60 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-700 text-xs uppercase tracking-widest text-white/40 mb-3">Contact</h4>
              <ul className="space-y-2 font-body text-sm text-white/60">
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
