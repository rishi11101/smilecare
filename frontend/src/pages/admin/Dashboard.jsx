import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-slate-light text-sm mb-1">{label}</p>
          <p className="font-display font-800 text-slate text-3xl">{value ?? '—'}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function statusBadge(status) {
  const map = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    confirmed: 'bg-green-50 text-green-700 border border-green-100',
    cancelled: 'bg-red-50 text-red-600 border border-red-100',
  };
  return (
    <span className={`text-xs font-body font-500 px-2.5 py-1 rounded-full capitalize ${map[status] || ''}`}>
      {status}
    </span>
  );
}

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/appointments/stats'),
      api.get('/api/appointments?limit=5'),
    ])
      .then(([statsRes, apptRes]) => {
        setStats(statsRes.data);
        setRecent(apptRes.data.appointments);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-800 text-slate text-xl sm:text-2xl">Dashboard</h1>
        <p className="font-body text-slate-light text-sm mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        <StatCard label="Total Appointments" value={stats?.total} icon={<Calendar size={18} className="text-navy" />} color="bg-sky" />
        <StatCard label="Today" value={stats?.today} icon={<Clock size={18} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Pending" value={stats?.pending} icon={<AlertCircle size={18} className="text-yellow-600" />} color="bg-yellow-50" />
        <StatCard label="Confirmed" value={stats?.confirmed} icon={<CheckCircle size={18} className="text-green-600" />} color="bg-green-50" />
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-display font-700 text-slate text-base">Recent Appointments</h2>
          <Link to="/admin/appointments" className="text-sm font-body text-navy hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-light text-sm">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="text-center py-10 text-slate-light text-sm">No appointments yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recent.map(a => (
              <div key={a.id} className="px-5 py-3.5 flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-700 text-white text-xs">
                    {a.patient_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-700 text-slate text-sm truncate">{a.patient_name}</p>
                  <p className="font-body text-slate-light text-xs truncate">{a.service_name}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="font-body text-slate text-xs">{formatDate(a.appointment_date)}</p>
                  <p className="font-body text-slate-light text-xs">{formatTime(a.appointment_time)}</p>
                </div>
                <div className="flex-shrink-0">{statusBadge(a.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
