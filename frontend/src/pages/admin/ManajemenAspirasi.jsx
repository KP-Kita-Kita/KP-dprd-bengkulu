import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaComments, FaCheck, FaTimes, FaEye, FaClock, FaFilter, FaSearch, FaFileExcel, FaMapMarkerAlt, FaPaperclip, FaTrash } from 'react-icons/fa';

export default function ManajemenAspirasi() {
  const [aspirasi, setAspirasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', kategori: '', dapil_id: '', search: '', date_from: '', date_to: '' });
  const [detail, setDetail] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [dapilList, setDapilList] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [exporting, setExporting] = useState(false);

  useEffect(() => { fetchData(); }, [page, filter.status, filter.kategori, filter.dapil_id]);
  useEffect(() => { fetchDapil(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filter.status) params.append('status', filter.status);
      if (filter.kategori) params.append('kategori', filter.kategori);
      if (filter.dapil_id) params.append('dapil_id', filter.dapil_id);
      if (filter.search) params.append('search', filter.search);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);

      const res = await API.get(`/aspirasi?${params}`);
      setAspirasi(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDapil = async () => {
    try {
      const res = await API.get('/dapil');
      setDapilList(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/aspirasi/${id}/status`, { status, catatan_admin: catatan });
      fetchData();
      setDetail(null);
      setCatatan('');
    } catch (err) { alert('Gagal mengupdate status.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus aspirasi ini? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        await API.delete(`/aspirasi/${id}`);
        fetchData();
      } catch (err) { alert('Gagal menghapus aspirasi.'); }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.dapil_id) params.append('dapil_id', filter.dapil_id);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);

      const res = await API.get(`/aspirasi/export?${params}`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aspirasi_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Gagal mengekspor data.'); }
    finally { setExporting(false); }
  };

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', masuk: 'badge-warning', diproses: 'badge-primary', selesai: 'badge-success', ditolak: 'badge-danger' };
    return map[status] || 'badge-primary';
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Aspirasi</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola aspirasi dari masyarakat.</p>
        </div>
        <button onClick={handleExport} disabled={exporting} className="btn-sm gap-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
          <FaFileExcel /> {exporting ? 'Mengekspor...' : 'Export Excel'}
        </button>
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
          <select value={filter.dapil_id} onChange={(e) => { setFilter({ ...filter, dapil_id: e.target.value }); setPage(1); }} className="select-field py-2 text-sm w-40">
            <option value="">Semua Dapil</option>
            {dapilList.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
          </select>
          <input type="date" value={filter.date_from} onChange={(e) => setFilter({ ...filter, date_from: e.target.value })} className="input-field py-2 text-sm w-36" />
          <span className="text-gray-400 text-sm">s/d</span>
          <input type="date" value={filter.date_to} onChange={(e) => setFilter({ ...filter, date_to: e.target.value })} className="input-field py-2 text-sm w-36" />
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input type="text" value={filter.search} onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="input-field py-2 text-sm flex-1" placeholder="Cari..." />
            <button type="submit" className="btn-primary btn-sm"><FaSearch /></button>
          </form>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {aspirasi.map((item) => (
            <div key={item.id} className="card p-5 hover:border-primary-200 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold text-primary-800">{item.nama || 'Anonim'}</h3>
                    <span className={statusBadge(item.status)}>{item.status}</span>
                    <span className="badge-primary">{item.kategori}</span>
                    {item.dapil_nama && <span className="badge-gold">{item.dapil_nama}</span>}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.isi}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                    {item.kabupaten_nama && (
                      <span className="flex items-center gap-1"><FaMapMarkerAlt /> {item.kabupaten_nama}{item.kecamatan_nama ? `, ${item.kecamatan_nama}` : ''}</span>
                    )}
                    <span className="flex items-center gap-1"><FaClock /> {formatDate(item.created_at)}</span>
                    {item.lampiran && <span className="flex items-center gap-1"><FaPaperclip /> Lampiran</span>}
                  </div>
                  {item.catatan_admin && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      <strong>Catatan Admin:</strong> {item.catatan_admin}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setDetail(item); setCatatan(item.catatan_admin || ''); }}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Detail">
                    <FaEye />
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Hapus">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {aspirasi.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <FaComments className="text-4xl mx-auto mb-3" />
              <p>Tidak ada aspirasi ditemukan.</p>
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
                page === i + 1 ? 'bg-primary-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{i + 1}</button>
          ))}
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
              {detail.dapil_nama && (
                <div><span className="text-xs text-gray-400 uppercase tracking-wider">Dapil</span>
                  <p className="font-medium text-sm">{detail.dapil_nama}</p>
                </div>
              )}
              <div><span className="text-xs text-gray-400 uppercase tracking-wider">Isi Aspirasi</span>
                <p className="text-gray-700 text-sm leading-relaxed mt-1">{detail.isi}</p>
              </div>
              {detail.lampiran && (
                <div><span className="text-xs text-gray-400 uppercase tracking-wider">Lampiran</span>
                  <a href={detail.lampiran} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-1 text-sm text-primary-600 hover:text-primary-800 font-medium">
                    <FaPaperclip /> Lihat Lampiran
                  </a>
                </div>
              )}
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
