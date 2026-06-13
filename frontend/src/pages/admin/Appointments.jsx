import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'cancelled'];
function formatDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function formatTime(t) { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`; }

function StatusBadge({ status }) {
  const map = { pending: 'bg-amber-50 text-amber-700 border-amber-100', confirmed: 'bg-green-50 text-green-700 border-green-100', cancelled: 'bg-red-50 text-red-600 border-red-100' };
  return <span className={`text-xs font-body font-500 px-2.5 py-1 rounded-full capitalize border ${map[status] || ''}`}>{status}</span>;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [updating, setUpdating] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (dateFilter) params.set('date', dateFilter);
      const res = await api.get(`/api/appointments?${params}`);
      setAppointments(res.data.appointments); setTotal(res.data.total);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, [statusFilter, dateFilter]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/api/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) { alert(err.response?.data?.error || 'Update failed.'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-800 text-slate text-xl sm:text-2xl">Appointments</h1>
        <p className="font-body text-slate-light text-sm mt-0.5">{total} total appointments</p>
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 overflow-x-auto">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-display font-600 capitalize transition-colors whitespace-nowrap ${statusFilter === s ? 'bg-navy text-white' : 'text-slate-mid hover:text-slate'}`}>
              {s}
            </button>
          ))}
        </div>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="border border-border rounded-xl px-3 py-2 text-slate font-body text-sm bg-white focus:outline-none focus:border-steel/40 transition" />
        {dateFilter && <button onClick={() => setDateFilter('')} className="text-sm font-body text-slate-light hover:text-slate transition-colors">Clear</button>}
      </div>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-light text-sm">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 text-slate-light text-sm">No appointments found.</div>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-page">
                    {['Patient', 'Service', 'Date', 'Time', 'Phone', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-body text-xs text-slate-light font-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-page/50 transition-colors">
                      <td className="px-5 py-3.5"><p className="font-display font-700 text-slate text-sm">{a.patient_name}</p><p className="font-body text-slate-light text-xs">{a.patient_email}</p></td>
                      <td className="px-5 py-3.5 font-body text-slate-mid text-sm">{a.service_name}</td>
                      <td className="px-5 py-3.5 font-body text-slate-mid text-sm whitespace-nowrap">{formatDate(a.appointment_date)}</td>
                      <td className="px-5 py-3.5 font-body text-slate-mid text-sm whitespace-nowrap">{formatTime(a.appointment_time)}</td>
                      <td className="px-5 py-3.5 font-body text-slate-mid text-sm">{a.patient_phone}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          {a.status === 'pending' && <button onClick={() => updateStatus(a.id, 'confirmed')} disabled={updating === a.id} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50" title="Confirm"><CheckCircle size={15} /></button>}
                          {a.status !== 'cancelled' && <button onClick={() => updateStatus(a.id, 'cancelled')} disabled={updating === a.id} className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50" title="Cancel"><XCircle size={15} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden divide-y divide-border">
              {appointments.map(a => (
                <div key={a.id} className="p-4">
                  <div className="flex items-start justify-between mb-2"><div><p className="font-display font-700 text-slate text-sm">{a.patient_name}</p><p className="font-body text-slate-light text-xs">{a.patient_phone}</p></div><StatusBadge status={a.status} /></div>
                  <p className="font-body text-slate-mid text-sm mb-1">{a.service_name}</p>
                  <p className="font-body text-slate-light text-xs mb-3">{formatDate(a.appointment_date)} · {formatTime(a.appointment_time)}</p>
                  {a.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(a.id, 'confirmed')} disabled={updating === a.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-body rounded-lg hover:bg-green-100 transition-colors"><CheckCircle size={13} /> Confirm</button>
                      <button onClick={() => updateStatus(a.id, 'cancelled')} disabled={updating === a.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-body rounded-lg hover:bg-red-100 transition-colors"><XCircle size={13} /> Cancel</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
