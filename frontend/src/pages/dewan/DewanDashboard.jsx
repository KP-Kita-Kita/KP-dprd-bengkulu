import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FaComments, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelopeOpen } from 'react-icons/fa';

export default function DewanDashboard() {
  const [stats, setStats] = useState({ total: 0, belumDibaca: 0, byStatus: { pending: 0, diproses: 0, selesai: 0, ditolak: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/aspirasi/dewan/stats');
        setStats(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Aspirasi', value: stats.total, icon: FaComments, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Belum Dibaca', value: stats.belumDibaca, icon: FaEnvelopeOpen, color: 'from-blue-500 to-blue-700' },
    { label: 'Pending', value: stats.byStatus.pending, icon: FaClock, color: 'from-amber-500 to-amber-700' },
    { label: 'Diproses', value: stats.byStatus.diproses, icon: FaSpinner, color: 'from-purple-500 to-purple-700' },
    { label: 'Selesai', value: stats.byStatus.selesai, icon: FaCheckCircle, color: 'from-green-500 to-green-700' },
    { label: 'Ditolak', value: stats.byStatus.ditolak, icon: FaTimesCircle, color: 'from-red-500 to-red-700' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-emerald-800">Dashboard Dewan</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan aspirasi masyarakat untuk daerah pemilihan Anda.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {statCards.map((item, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl p-6 text-white">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <item.icon />
                </div>
              </div>
              <p className="text-3xl font-bold">{loading ? '...' : item.value}</p>
              <p className="text-white/70 text-sm mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
