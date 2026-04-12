import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaComments, FaCheck, FaTimes, FaEye, FaClock, FaFilter } from 'react-icons/fa';

export default function ManajemenAspirasi() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [catatan, setCatatan] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/aspirasi');
      setAspirasi(res.data.data || res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/aspirasi/${id}/status`, { status, catatan_admin: catatan });
      fetchData();
      setDetail(null);
      setCatatan('');
    } catch (err) { alert('Gagal mengupdate status.'); }
  };

  const filtered = filter ? aspirasi.filter(a => a.status === filter) : aspirasi;

  const statusBadge = (status) => {
    const map = { masuk: 'badge-warning', diproses: 'badge-primary', selesai: 'badge-success', ditolak: 'badge-danger' };
    return map[status] || 'badge-primary';
  };

  const statusLabel = (status) => {
    const map = { masuk: 'Masuk', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
    return map[status] || status;
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Aspirasi</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola aspirasi dari masyarakat.</p>
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="select-field py-2 text-sm w-40">
            <option value="">Semua</option>
            <option value="masuk">Masuk</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="card p-5 hover:border-primary-200 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-primary-800">{item.nama || 'Anonim'}</h3>
                    <span className={statusBadge(item.status)}>{statusLabel(item.status)}</span>
                    <span className="badge-primary">{item.kategori}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.isi}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    {item.email && <span>{item.email}</span>}
                    <span className="flex items-center gap-1"><FaClock /> {formatDate(item.created_at)}</span>
                  </div>
                  {item.catatan_admin && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <strong>Catatan Admin:</strong> {item.catatan_admin}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setDetail(item); setCatatan(item.catatan_admin || ''); }}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Detail">
                    <FaEye />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FaComments className="text-4xl mx-auto mb-3" />
              <p>Tidak ada aspirasi{filter ? ` dengan status "${filter}"` : ''}.</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-primary-800">Detail Aspirasi</h2>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Pengirim</span>
                <p className="font-semibold text-primary-800">{detail.nama || 'Anonim'}</p>
                {detail.email && <p className="text-sm text-gray-500">{detail.email}</p>}
              </div>
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Kategori</span>
                <p className="font-medium">{detail.kategori}</p>
              </div>
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Isi Aspirasi</span>
                <p className="text-gray-700 text-sm leading-relaxed mt-1">{detail.isi}</p>
              </div>
              <div>
                <label className="label-field">Catatan Admin</label>
                <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} className="textarea-field" rows={3} placeholder="Tambahkan catatan..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(detail.id, 'diproses')} className="btn-primary btn-sm flex-1 gap-1"><FaClock /> Proses</button>
                <button onClick={() => updateStatus(detail.id, 'selesai')} className="btn-sm flex-1 gap-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"><FaCheck /> Selesai</button>
                <button onClick={() => updateStatus(detail.id, 'ditolak')} className="btn-danger btn-sm flex-1 gap-1"><FaTimes /> Tolak</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
