import { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarOff } from 'lucide-react';
import api from '../../utils/api';

function getToday() { return new Date().toISOString().split('T')[0]; }
function formatDate(d) { return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }); }

export default function AdminBlocked() {
  const [blocked, setBlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: '', reason: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBlocked = async () => {
    try { const res = await api.get('/api/slots/blocked'); setBlocked(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchBlocked(); }, []);

  const handleAdd = async () => {
    setError('');
    if (!form.date) { setError('Please select a date.'); return; }
    setSaving(true);
    try { await api.post('/api/slots/block', form); setForm({ date: '', reason: '' }); fetchBlocked(); }
    catch (err) { setError(err.response?.data?.error || 'Failed to block date.'); }
    finally { setSaving(false); }
  };

  const handleUnblock = async (date) => {
    if (!confirm(`Unblock ${formatDate(date)}?`)) return;
    try { await api.delete(`/api/slots/block/${date}`); fetchBlocked(); }
    catch { alert('Failed to unblock date.'); }
  };

  const upcoming = blocked.filter(b => b.date >= getToday());
  const past = blocked.filter(b => b.date < getToday());
  const inputCls = "border border-border rounded-xl px-4 py-2.5 text-slate font-body text-sm bg-card focus:outline-none focus:border-steel/50 transition";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display font-800 text-slate text-xl sm:text-2xl">Block Dates</h1>
        <p className="font-body text-slate-light text-sm mt-0.5">Mark holidays or days the clinic is closed</p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-6 shadow-sm">
        <h2 className="font-display font-700 text-slate text-base mb-4">Block a Date</h2>
        {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-red-600 text-sm mb-4">{error}</div>}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="font-body text-slate text-sm font-500 block mb-1.5">Date *</label>
            <input type="date" value={form.date} min={getToday()} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputCls} />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="font-body text-slate text-sm font-500 block mb-1.5">Reason</label>
            <input type="text" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. National Holiday" className={`${inputCls} w-full`} />
          </div>
          <button onClick={handleAdd} disabled={saving} className="inline-flex items-center gap-2 bg-navy text-white font-display font-700 text-sm px-5 py-2.5 rounded-xl hover:bg-navy-mid transition-colors disabled:opacity-60 whitespace-nowrap">
            <Plus size={15} /> {saving ? 'Blocking...' : 'Block Date'}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-5">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display font-700 text-slate text-base">Upcoming Blocked Dates</h2>
        </div>
        {loading ? (
          <div className="text-center py-10 text-slate-light text-sm">Loading...</div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-10">
            <CalendarOff size={28} className="text-border mx-auto mb-2" />
            <p className="font-body text-slate-light text-sm">No upcoming blocked dates.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {upcoming.map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarOff size={15} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-700 text-slate text-sm">{formatDate(b.date)}</p>
                  <p className="font-body text-slate-light text-xs">{b.reason || 'Clinic closed'}</p>
                </div>
                <button onClick={() => handleUnblock(b.date)} className="p-2 rounded-lg text-slate-light hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0" title="Unblock">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-700 text-slate-mid text-base">Past Blocked Dates ({past.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {past.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-display font-600 text-slate-mid text-sm">{formatDate(b.date)}</p>
                  <p className="font-body text-slate-muted text-xs">{b.reason || 'Clinic closed'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
