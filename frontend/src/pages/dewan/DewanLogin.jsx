import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLandmark, FaSignInAlt } from 'react-icons/fa';

export default function DewanLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userData = await login(username, password);
      if (userData.role !== 'dewan') {
        setError('Akun ini bukan akun dewan. Silakan gunakan halaman login yang sesuai.');
        return;
      }
      navigate('/dewan/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-2xl font-bold text-white">Panel Dewan</h1>
          <p className="text-emerald-300 text-sm mt-1">DPRD Provinsi Bengkulu</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 space-y-6 border border-white/20">
          <h2 className="text-lg font-semibold text-white text-center">Login Anggota Dewan</h2>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40
                         focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
              placeholder="Masukkan username" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-200 mb-1.5">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40
                         focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all"
              placeholder="Masukkan password" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg
                       transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
            ) : (
              <><FaSignInAlt /> Masuk</>
            )}
          </button>
        </form>

        <p className="text-center text-emerald-400/60 text-xs mt-6">
          © {new Date().getFullYear()} DPRD Provinsi Bengkulu
        </p>
      </div>
    </div>
  );
}
