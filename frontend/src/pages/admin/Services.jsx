import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../../utils/api';

const emptyForm = { name: '', description: '', duration_minutes: 30, price: '', is_active: true };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      const res = await api.get('/api/services/all');
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, description: s.description || '', duration_minutes: s.duration_minutes, price: s.price, is_active: s.is_active });
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.name.trim()) { setError('Service name is required.'); return; }
    if (!form.price) { setError('Price is required.'); return; }

    setSaving(true);
    try {
      if (editId) {
        await api.put(`/api/services/${editId}`, form);
      } else {
        await api.post('/api/services', form);
      }
      await fetchServices();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this service? It won\'t appear in booking.')) return;
    try {
      await api.delete(`/api/services/${id}`);
      fetchServices();
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-800 text-slate text-xl sm:text-2xl">Services</h1>
          <p className="font-body text-slate-light text-sm mt-0.5">Manage what patients can book</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-navy text-white font-display font-700 text-sm px-4 py-2.5 rounded-xl hover:bg-navy-dark transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-700 text-slate text-base">{editId ? 'Edit Service' : 'Add New Service'}</h2>
            <button onClick={() => setShowForm(false)} className="text-slate-light hover:text-slate p-1">
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-red-600 text-sm font-body mb-4">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="font-body text-slate text-sm font-500 block mb-1.5">Service Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Teeth Cleaning"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-body text-slate text-sm font-500 block mb-1.5">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Brief description for patients"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
              />
            </div>
            <div>
              <label className="font-body text-slate text-sm font-500 block mb-1.5">Duration (minutes) *</label>
              <select
                value={form.duration_minutes}
                onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-slate font-body text-sm focus:outline-none focus:border-navy transition bg-white"
              >
                {[15, 30, 45, 60, 90].map(m => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-body text-slate text-sm font-500 block mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="500"
                min="0"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
              />
            </div>
            {editId && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-navy"
                />
                <label htmlFor="is_active" className="font-body text-slate text-sm">Active (visible in booking)</label>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-navy text-white font-display font-700 text-sm px-5 py-2.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-60"
            >
              <Check size={15} /> {saving ? 'Saving...' : 'Save Service'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-slate font-body text-sm hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Services list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-light text-sm">Loading services...</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-slate-light text-sm">No services found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map(s => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-display font-700 text-slate text-sm">{s.name}</p>
                    {!s.is_active && (
                      <span className="text-xs font-body bg-gray-100 text-slate-light px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="font-body text-slate-light text-xs">{s.description}</p>
                  <p className="font-body text-slate-light text-xs mt-0.5">⏱ {s.duration_minutes} min</p>
                </div>
                <p className="font-display font-700 text-navy text-sm flex-shrink-0">₹{s.price}</p>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-2 rounded-lg text-slate-light hover:bg-sky hover:text-navy transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 rounded-lg text-slate-light hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
