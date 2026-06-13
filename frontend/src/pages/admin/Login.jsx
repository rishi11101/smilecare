import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-offwhite flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-7">
          <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center text-lg">🦷</div>
          <div>
            <p className="font-display font-800 text-slate text-base leading-none">SmileCare</p>
            <p className="font-body text-slate-light text-xs">Admin Panel</p>
          </div>
        </div>

        <h1 className="font-display font-800 text-slate text-xl mb-1">Sign in</h1>
        <p className="font-body text-slate-light text-sm mb-6">Use your admin credentials to continue.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm font-body mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-slate text-sm font-500 block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="admin@smilecare.in"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
            />
          </div>
          <div>
            <label className="font-body text-slate text-sm font-500 block mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              placeholder="••••••••"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-slate font-body text-sm focus:outline-none focus:border-navy transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white font-display font-700 py-3.5 rounded-xl hover:bg-navy-dark transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center font-body text-slate-light text-xs mt-6">
          Default: admin@smilecare.in / Admin@123
        </p>
      </div>
    </div>
  );
}
