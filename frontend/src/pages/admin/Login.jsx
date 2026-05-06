import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLandmark, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
  useEffect(() => {
    document.title = "Admin Panel Sistem Informasi DPRD Provinsi Bengkulu";
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Username dan password wajib diisi.'); return; }
    setLoading(true); setError('');
    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa username dan password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 overflow-hidden">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1.5" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">DPRD Provinsi Bengkulu</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <h2 className="text-xl font-bold text-primary-800 text-center">Masuk ke Akun</h2>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <div>
            <label className="label-field">Username</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field pl-11" placeholder="Masukkan username" />
            </div>
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-11" placeholder="Masukkan password" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 gap-2">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
            ) : (
              <><FaSignInAlt /> Masuk</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
