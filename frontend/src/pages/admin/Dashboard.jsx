import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FaNewspaper, FaUsers, FaFileAlt, FaComments, FaChartLine, FaClock } from 'react-icons/fa';

export default function Dashboard() {
  const [stats, setStats] = useState({ berita: 0, anggota: 0, dokumen: 0, aspirasi: 0, aspirasiMasuk: 0 });
  const [recentAspirasi, setRecentAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [beritaRes, anggotaRes, dokRes, aspRes] = await Promise.all([
        API.get('/berita?limit=1&admin=true'), API.get('/anggota'), API.get('/dokumen'), API.get('/aspirasi')
      ]);
      const aspirasi = aspRes.data.data || aspRes.data || [];
      setStats({
        berita: beritaRes.data.pagination?.total || (beritaRes.data.data || []).length || 0,
        anggota: (anggotaRes.data.data || anggotaRes.data || []).length,
        dokumen: (dokRes.data.data || dokRes.data || []).length,
        aspirasi: aspirasi.length,
        aspirasiMasuk: aspirasi.filter(a => a.status === 'masuk').length,
      });
      setRecentAspirasi(aspirasi.slice(0, 5));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const statCards = [
    { label: 'Total Berita', value: stats.berita, icon: FaNewspaper, color: 'from-blue-500 to-blue-700' },
    { label: 'Anggota DPRD', value: stats.anggota, icon: FaUsers, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Dokumen', value: stats.dokumen, icon: FaFileAlt, color: 'from-purple-500 to-purple-700' },
    { label: 'Aspirasi Masuk', value: stats.aspirasiMasuk, icon: FaComments, color: 'from-amber-500 to-amber-700' },
  ];

  const statusBadge = (status) => {
    const map = { masuk: 'badge-warning', diproses: 'badge-primary', selesai: 'badge-success', ditolak: 'badge-danger' };
    return map[status] || 'badge-primary';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang di panel administrasi DPRD Provinsi Bengkulu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((item, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl p-6 text-white">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <item.icon />
                </div>
                <FaChartLine className="text-white/30 text-xl" />
              </div>
              <p className="text-3xl font-bold">{loading ? '...' : item.value}</p>
              <p className="text-white/70 text-sm mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
          <FaClock className="text-secondary-500" /> Aspirasi Terbaru
        </h2>
        {recentAspirasi.length > 0 ? (
          <div className="space-y-3">
            {recentAspirasi.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-primary-800 text-sm">{item.nama || 'Anonim'}</p>
                    <span className={statusBadge(item.status)}>{item.status}</span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.isi}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(item.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm py-4 text-center">Belum ada aspirasi.</p>
        )}
      </div>
    </div>
  );
}
