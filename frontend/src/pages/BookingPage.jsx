import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Calendar, Clock, User } from 'lucide-react';
import api from '../utils/api';

const STEPS = ['Service', 'Date & Time', 'Your Details', 'Confirm'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center mb-8 sm:mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-display font-700 transition-all ${
              i < current ? 'bg-navy text-white' :
              i === current ? 'bg-navy text-white ring-4 ring-sky' :
              'bg-gray-100 text-slate-light'
            }`}>
              {i < current ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`hidden sm:block text-xs font-body mt-1.5 ${i === current ? 'text-navy font-500' : 'text-slate-light'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-10 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-4 sm:mb-5 transition-colors ${i < current ? 'bg-navy' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Format time 24h → 12h
function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// Get today's date in YYYY-MM-DD
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Get max bookable date (90 days ahead)
function getMaxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().split('T')[0];
}

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsBlocked, setSlotsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    service: null,
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    api.get('/api/services')
      .then(res => setServices(res.data))
      .catch(() => setError('Could not load services. Please refresh.'));
  }, []);

  useEffect(() => {
    if (!form.date) return;
    setSlotsLoading(true);
    setSlotsBlocked(false);
    setForm(f => ({ ...f, time: '' }));

    api.get(`/api/slots?date=${form.date}`)
      .then(res => {
        if (res.data.blocked) {
          setSlotsBlocked(true);
          setBlockedReason(res.data.reason);
          setSlots([]);
        } else {
          setSlots(res.data.slots || []);
          setSlotsBlocked(false);
        }
      })
      .catch(() => setError('Could not load time slots.'))
      .finally(() => setSlotsLoading(false));
  }, [form.date]);

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const res = await api.post('/api/appointments', {
        patient_name: form.name,
        patient_email: form.email,
        patient_phone: form.phone,
        service_id: form.service.id,
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes,
      });
      setConfirmed(res.data.appointment);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ──
  if (confirmed) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-4 py-20">
        <div className="bg-white rounded-3xl shadow-lg p-8 sm:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="font-display font-800 text-slate text-2xl sm:text-3xl mb-2">Appointment Booked!</h2>
          <p className="font-body text-slate-mid text-sm mb-6">A confirmation has been sent to your email.</p>

          <div className="bg-sky rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-white" />
              </div>
              <div>
                <p className="font-body text-xs text-slate-light">Patient</p>
                <p className="font-display font-700 text-slate text-sm">{confirmed.patient_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-white" />
              </div>
              <div>
                <p className="font-body text-xs text-slate-light">Date</p>
                <p className="font-display font-700 text-slate text-sm">{formatDate(confirmed.appointment_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={14} className="text-white" />
              </div>
              <div>
                <p className="font-body text-xs text-slate-light">Time & Service</p>
                <p className="font-display font-700 text-slate text-sm">{formatTime(confirmed.appointment_time)} — {confirmed.service_name}</p>
              </div>
            </div>
          </div>

          <p className="font-body text-slate-light text-xs mb-6">Need to reschedule? Call us at +91 98765 43210</p>
          <Link to="/" className="block w-full bg-navy text-white font-display font-700 py-3.5 rounded-xl hover:bg-navy-dark transition-colors text-center">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-light hover:text-navy text-sm font-body transition-colors mb-4">
            <ArrowLeft size={15} /> Back to Home
          </Link>
          <h1 className="font-display font-800 text-slate text-2xl sm:text-3xl">Book an Appointment</h1>
          <p className="font-body text-slate-mid text-sm mt-1">SmileCare Dental Clinic — Bangalore</p>
        </div>

        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7">

          {/* ── STEP 0: Choose Service ── */}
          {step === 0 && (
            <div>
              <h2 className="font-display font-700 text-slate text-lg mb-1">Choose a Service</h2>
              <p className="font-body text-slate-light text-sm mb-5">Select the treatment you need.</p>

              {services.length === 0 ? (
                <div className="text-center py-10 text-slate-light text-sm">Loading services...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setForm(f => ({ ...f, service: s }))}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        form.service?.id === s.id
                          ? 'border-navy bg-sky'
                          : 'border-gray-100 hover:border-sky-dark'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-display font-700 text-slate text-sm">{s.name}</p>
                        <span className="font-display font-700 text-navy text-sm flex-shrink-0">₹{s.price}</span>
                      </div>
                      <p className="font-body text-slate-mid text-xs leading-relaxed">{s.description}</p>
                      <p className="font-body text-slate-light text-xs mt-1.5">⏱ {s.duration_minutes} min</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: Date & Time ── */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-700 text-slate text-lg mb-1">Pick a Date & Time</h2>
              <p className="font-body text-slate-light text-sm mb-5">Clinic open Mon–Sat, 9 AM – 7 PM.</p>

              <div className="mb-5">
                <label className="font-body text-slate text-sm font-500 block mb-2">Select Date</label>
                <input
                  type="date"
                  value={form.date}
                  min={getToday()}
                  max={getMaxDate()}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full sm:w-auto border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
                />
              </div>

              {form.date && (
                <div>
                  <label className="font-body text-slate text-sm font-500 block mb-3">Available Slots</label>
                  {slotsLoading && (
                    <div className="text-center py-8 text-slate-light text-sm">Loading slots...</div>
                  )}
                  {!slotsLoading && slotsBlocked && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm font-body">
                      🚫 {blockedReason}
                    </div>
                  )}
                  {!slotsLoading && !slotsBlocked && slots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map(slot => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => slot.available && setForm(f => ({ ...f, time: slot.time }))}
                          className={`py-2.5 rounded-xl text-xs sm:text-sm font-display font-600 transition-all ${
                            !slot.available
                              ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                              : form.time === slot.time
                              ? 'bg-navy text-white'
                              : 'bg-sky text-navy hover:bg-sky-dark'
                          }`}
                        >
                          {formatTime(slot.time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Patient Details ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-700 text-slate text-lg mb-1">Your Details</h2>
              <p className="font-body text-slate-light text-sm mb-5">We'll send your confirmation here.</p>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-slate text-sm font-500 block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
                  />
                </div>
                <div>
                  <label className="font-body text-slate text-sm font-500 block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="rahul@gmail.com"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
                  />
                </div>
                <div>
                  <label className="font-body text-slate text-sm font-500 block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
                  />
                </div>
                <div>
                  <label className="font-body text-slate text-sm font-500 block mb-1.5">Notes <span className="text-slate-light font-400">(optional)</span></label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any specific concerns or medical history we should know..."
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Confirm ── */}
          {step === 3 && (
            <div>
              <h2 className="font-display font-700 text-slate text-lg mb-1">Confirm Appointment</h2>
              <p className="font-body text-slate-light text-sm mb-5">Review your details before booking.</p>

              <div className="bg-sky rounded-2xl p-5 space-y-4 mb-5">
                {[
                  { label: 'Service', value: `${form.service?.name} — ₹${form.service?.price}` },
                  { label: 'Date', value: formatDate(form.date) },
                  { label: 'Time', value: formatTime(form.time) },
                  { label: 'Patient', value: form.name },
                  { label: 'Email', value: form.email },
                  { label: 'Phone', value: form.phone },
                ].map((row, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-body text-xs text-slate-light w-16 flex-shrink-0 pt-0.5">{row.label}</span>
                    <span className="font-body text-sm text-slate font-500">{row.value}</span>
                  </div>
                ))}
                {form.notes && (
                  <div className="flex gap-4 items-start">
                    <span className="font-body text-xs text-slate-light w-16 flex-shrink-0 pt-0.5">Notes</span>
                    <span className="font-body text-sm text-slate">{form.notes}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm font-body mb-4">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-7 pt-5 border-t border-gray-100">
            <button
              onClick={() => { setStep(s => s - 1); setError(''); }}
              className={`inline-flex items-center gap-1.5 font-display font-600 text-sm px-5 py-2.5 rounded-xl transition-colors ${
                step === 0 ? 'invisible' : 'text-slate hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={15} /> Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => {
                  setError('');
                  if (step === 0 && !form.service) { setError('Please select a service.'); return; }
                  if (step === 1) {
                    if (!form.date) { setError('Please select a date.'); return; }
                    if (!form.time) { setError('Please select a time slot.'); return; }
                  }
                  if (step === 2) {
                    if (!form.name.trim()) { setError('Please enter your name.'); return; }
                    if (!form.email.trim()) { setError('Please enter your email.'); return; }
                    if (!form.phone.trim()) { setError('Please enter your phone number.'); return; }
                  }
                  setStep(s => s + 1);
                }}
                className="inline-flex items-center gap-1.5 bg-navy text-white font-display font-700 text-sm px-6 py-2.5 rounded-xl hover:bg-navy-dark transition-colors"
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 bg-navy text-white font-display font-700 text-sm px-6 py-2.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
                {!submitting && <CheckCircle size={15} />}
              </button>
            )}
          </div>

          {error && step < 3 && (
            <p className="text-red-500 text-xs font-body mt-3 text-right">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
