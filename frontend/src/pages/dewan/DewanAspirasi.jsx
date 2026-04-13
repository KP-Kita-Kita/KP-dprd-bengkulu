import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaComments, FaEye, FaTimes, FaCheck, FaClock, FaFilter, FaSearch, FaMapMarkerAlt, FaPaperclip } from 'react-icons/fa';

export default function DewanAspirasi() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', kategori: '', search: '' });
  const [detail, setDetail] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  useEffect(() => { fetchData(); }, [page, filter.status, filter.kategori]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filter.status) params.append('status', filter.status);
      if (filter.kategori) params.append('kategori', filter.kategori);
      if (filter.search) params.append('search', filter.search);

      const res = await API.get(`/aspirasi/dewan?${params}`);
      setAspirasi(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/aspirasi/${id}/dewan-status`, { status });
      fetchData();
      setDetail(null);
    } catch (err) { alert(err.response?.data?.message || 'Gagal mengupdate status.'); }
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', diproses: 'badge-primary', selesai: 'badge-success', ditolak: 'badge-danger' };
    return map[status] || 'badge-primary';
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">Aspirasi Saya</h1>
          <p className="text-gray-500 text-sm mt-1">Aspirasi yang masuk dari daerah pemilihan Anda.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <FaFilter className="text-gray-400" />
          <select value={filter.status} onChange={(e) => { setFilter({ ...filter, status: e.target.value }); setPage(1); }} className="select-field py-2 text-sm w-36">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="selesai">Selesai</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <select value={filter.kategori} onChange={(e) => { setFilter({ ...filter, kategori: e.target.value }); setPage(1); }} className="select-field py-2 text-sm w-36">
            <option value="">Semua Kategori</option>
            <option value="umum">Umum</option>
            <option value="infrastruktur">Infrastruktur</option>
            <option value="pendidikan">Pendidikan</option>
            <option value="kesehatan">Kesehatan</option>
            <option value="pengawasan">Pengawasan</option>
            <option value="lainnya">Lainnya</option>
          </select>
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input type="text" value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input-field py-2 text-sm flex-1" placeholder="Cari aspirasi..." />
            <button type="submit" className="btn-primary btn-sm"><FaSearch /></button>
          </form>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {aspirasi.map((item) => (
            <div key={item.id} className={`card p-5 hover:border-emerald-200 transition-all duration-300 ${!item.dibaca ? 'border-l-4 border-l-emerald-500' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-emerald-800">{item.nama || 'Anonim'}</h3>
                    <span className={statusBadge(item.status)}>{item.status}</span>
                    <span className="badge-primary">{item.kategori}</span>
                    {!item.dibaca && <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">Baru</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.isi}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    {item.kabupaten_nama && (
                      <span className="flex items-center gap-1"><FaMapMarkerAlt /> {item.kabupaten_nama}{item.kecamatan_nama ? `, ${item.kecamatan_nama}` : ''}</span>
                    )}
                    <span className="flex items-center gap-1"><FaClock /> {formatDate(item.created_at)}</span>
                    {item.lampiran && <span className="flex items-center gap-1"><FaPaperclip /> Lampiran</span>}
                  </div>
                </div>
                <button onClick={() => setDetail(item)}
                  className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Detail">
                  <FaEye />
                </button>
              </div>
            </div>
          ))}
          {aspirasi.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FaComments className="text-4xl mx-auto mb-3" />
              <p>Belum ada aspirasi yang masuk.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1 ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-bold text-emerald-800">Detail Aspirasi</h2>
              <button onClick={() => setDetail(null)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Pengirim</span>
                <p className="font-semibold text-emerald-800">{detail.nama || 'Anonim'}</p>
                {detail.email && <p className="text-sm text-gray-500">{detail.email}</p>}
              </div>
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Kategori</span>
                <p className="font-medium capitalize">{detail.kategori}</p>
              </div>
              {detail.kabupaten_nama && (
                <div><span className="text-xs text-gray-400 uppercase tracking-wider">Lokasi</span>
                  <p className="font-medium text-sm">
                    {detail.kelurahan_nama && `${detail.kelurahan_nama}, `}
                    {detail.kecamatan_nama && `${detail.kecamatan_nama}, `}
                    {detail.kabupaten_nama}
                  </p>
                </div>
              )}
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Isi Aspirasi</span>
                <p className="text-gray-700 text-sm leading-relaxed mt-1">{detail.isi}</p>
              </div>
              {detail.lampiran && (
                <div><span className="text-xs text-gray-400 uppercase tracking-wider">Lampiran</span>
                  <a href={detail.lampiran} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 text-sm text-emerald-600 hover:text-emerald-800 font-medium">
                    <FaPaperclip /> Lihat Lampiran
                  </a>
                </div>
              )}
              {detail.dapil_nama && (
                <div><span className="text-xs text-gray-400 uppercase tracking-wider">Dapil</span>
                  <p className="font-medium text-sm">{detail.dapil_nama}</p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Ubah Status</p>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(detail.id, 'diproses')} className="btn-sm flex-1 gap-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"><FaClock /> Proses</button>
                  <button onClick={() => updateStatus(detail.id, 'selesai')} className="btn-sm flex-1 gap-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"><FaCheck /> Selesai</button>
                  <button onClick={() => updateStatus(detail.id, 'ditolak')} className="btn-danger btn-sm flex-1 gap-1"><FaTimes /> Tolak</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
