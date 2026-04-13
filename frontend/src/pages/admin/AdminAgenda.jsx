import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaCalendarAlt,
  FaMapMarkerAlt, FaClock, FaVideo, FaSearch, FaFilter,
  FaCircle, FaExternalLinkAlt
} from 'react-icons/fa';

// ===== KONSTANTA =====
const KATEGORI_OPTIONS = ['Agenda', 'Masa Sidang', 'Reses'];
const STATUS_OPTIONS    = ['Menunggu', 'Berlangsung', 'Selesai', 'Ditunda'];
const KOMISI_OPTIONS    = ['Komisi I', 'Komisi II', 'Komisi III', 'Komisi IV'];

const KATEGORI_STYLE = {
  'Agenda':      'bg-blue-100 text-blue-800 border border-blue-300',
  'Masa Sidang': 'bg-purple-100 text-purple-800 border border-purple-300',
  'Reses':       'bg-amber-100 text-amber-800 border border-amber-300',
};

const STATUS_STYLE = {
  Menunggu:    'bg-amber-100 text-amber-700',
  Berlangsung: 'bg-green-100 text-green-700',
  Selesai:     'bg-gray-100 text-gray-500',
  Ditunda:     'bg-red-100 text-red-600',
};

// ===== FORMAT HELPERS =====
const formatDateTimeLocal = (dt) => {
  if (!dt) return '';
  // Format untuk input datetime-local: YYYY-MM-DDTHH:mm
  const d = new Date(dt);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDisplay = (dt) =>
  new Date(dt).toLocaleString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const EMPTY_FORM = {
  judul: '', deskripsi: '', waktu_mulai: '', waktu_selesai: '',
  lokasi: '', kategori: 'Agenda', komisi: '', link_streaming: '', status: 'Menunggu',
};

// ===== KOMPONEN UTAMA =====
export default function AdminAgenda() {
  const [agenda, setAgenda]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // id yang akan dihapus

  const LIMIT = 15;

  useEffect(() => { fetchData(); }, [page, filterStatus, filterKategori]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filterStatus)   params.status   = filterStatus;
      if (filterKategori) params.kategori = filterKategori;
      if (search)         params.search   = search;

      const res = await API.get('/agenda', { params });
      setAgenda(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      judul:           item.judul,
      deskripsi:       item.deskripsi || '',
      waktu_mulai:     formatDateTimeLocal(item.waktu_mulai),
      waktu_selesai:   formatDateTimeLocal(item.waktu_selesai),
      lokasi:          item.lokasi || '',
      kategori:        item.kategori,
      komisi:          item.komisi || '',
      link_streaming:  item.link_streaming || '',
      status:          item.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.waktu_mulai || !form.waktu_selesai) {
      alert('Judul, waktu mulai, dan waktu selesai wajib diisi.');
      return;
    }
    if (new Date(form.waktu_selesai) <= new Date(form.waktu_mulai)) {
      alert('Waktu selesai harus setelah waktu mulai.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        link_streaming: form.link_streaming || null,
        deskripsi:      form.deskripsi      || null,
        lokasi:         form.lokasi         || null,
      };

      if (editItem) {
        await API.put(`/agenda/${editItem.id}`, payload);
      } else {
        await API.post('/agenda', payload);
      }
      setShowModal(false);
      setPage(1);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan agenda.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/agenda/${id}`);
      setDeleteConfirm(null);
      fetchData();
    } catch {
      alert('Gagal menghapus agenda.');
    }
  };

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Kelola Agenda</h1>
          <p className="text-gray-500 text-sm mt-1">Manajemen jadwal &amp; agenda kegiatan DPRD.</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2">
          <FaPlus /> Tambah Agenda
        </button>
      </div>

      {/* ===== FILTER BAR ===== */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <FaFilter className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="select-field py-2 text-sm w-36"
          >
            <option value="">Semua Status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterKategori}
            onChange={(e) => { setFilterKategori(e.target.value); setPage(1); }}
            className="select-field py-2 text-sm w-36"
          >
            <option value="">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[200px]">
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul / lokasi..."
              className="input-field py-2 text-sm flex-1"
            />
            <button type="submit" className="btn-primary btn-sm"><FaSearch /></button>
          </form>
        </div>
      </div>

      {/* ===== TABEL ===== */}
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Judul</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Waktu</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Lokasi</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Kategori</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Komisi</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                    <th className="text-center p-4 font-semibold text-gray-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agenda.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-primary-800 line-clamp-2 leading-snug">{item.judul}</p>
                            {item.link_streaming && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-500 mt-1">
                                <FaVideo className="text-[10px]" /> Streaming tersedia
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 text-xs whitespace-nowrap">
                        <div className="flex items-center gap-1 mb-0.5">
                          <FaClock className="text-gray-300" />
                          {formatDisplay(item.waktu_mulai)}
                        </div>
                        <div className="text-gray-400 pl-4">
                          s/d {new Date(item.waktu_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </div>
                      </td>
                      <td className="p-4 text-gray-500">
                        {item.lokasi ? (
                          <span className="flex items-center gap-1 text-xs">
                            <FaMapMarkerAlt className="text-gray-300" /> {item.lokasi}
                          </span>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${KATEGORI_STYLE[item.kategori] || 'bg-gray-100 text-gray-600'}`}>
                          {item.kategori}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.komisi
                          ? <span className="px-2 py-1 rounded text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-700">{item.komisi}</span>
                          : <span className="text-gray-300 text-xs">-</span>}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_STYLE[item.status] || 'bg-gray-100 text-gray-500'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {agenda.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-400">
                        <FaCalendarAlt className="text-3xl mx-auto mb-3 text-gray-300" />
                        <p>Belum ada agenda. Klik "+ Tambah Agenda" untuk membuat baru.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === i + 1
                      ? 'bg-primary-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== MODAL FORM ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-primary-800">
                  {editItem ? 'Edit Agenda' : 'Tambah Agenda Baru'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editItem ? 'Perbarui detail agenda yang ada.' : 'Isi detail agenda baru.'}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Judul */}
              <div>
                <label className="label-field">
                  Judul Agenda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.judul}
                  onChange={(e) => updateField('judul', e.target.value)}
                  className="input-field"
                  placeholder="contoh: Rapat Paripurna DPRD"
                  required
                />
              </div>

              {/* Waktu Mulai & Selesai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.waktu_mulai}
                    onChange={(e) => updateField('waktu_mulai', e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-field">
                    Waktu Selesai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={form.waktu_selesai}
                    onChange={(e) => updateField('waktu_selesai', e.target.value)}
                    className="input-field"
                    required
                    min={form.waktu_mulai}
                  />
                </div>
              </div>

              {/* Kategori & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => updateField('kategori', e.target.value)}
                    className="select-field"
                  >
                    {KATEGORI_OPTIONS.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Agenda · Masa Sidang · Reses
                  </p>
                </div>
                <div>
                  <label className="label-field">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    className="select-field"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Set ke "Berlangsung" untuk aktifkan tombol LIVE
                  </p>
                </div>
              </div>

              {/* Lokasi & Komisi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">
                    Tempat / Lokasi
                    <span className="text-xs font-normal text-gray-400 ml-1">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.lokasi}
                    onChange={(e) => updateField('lokasi', e.target.value)}
                    className="input-field"
                    placeholder="contoh: Ruang Paripurna Gedung DPRD"
                  />
                </div>
                <div>
                  <label className="label-field">
                    Komisi
                    <span className="text-xs font-normal text-gray-400 ml-1">(opsional)</span>
                  </label>
                  <select
                    value={form.komisi}
                    onChange={(e) => updateField('komisi', e.target.value)}
                    className="select-field"
                  >
                    <option value="">— Tidak Ada —</option>
                    {KOMISI_OPTIONS.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link Streaming */}
              <div>
                <label className="label-field flex items-center gap-2">
                  <FaVideo className="text-blue-500" /> Link Streaming
                  <span className="text-xs font-normal text-gray-400">(opsional)</span>
                </label>
                <input
                  type="url"
                  value={form.link_streaming}
                  onChange={(e) => updateField('link_streaming', e.target.value)}
                  className="input-field"
                  placeholder="https://youtube.com/live/... atau URL streaming lainnya"
                />
                {form.link_streaming && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 rounded-lg p-2.5">
                    <FaExternalLinkAlt className="flex-shrink-0" />
                    <span>Tombol LIVE akan muncul di halaman publik saat status = "Berlangsung"</span>
                  </div>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="label-field">Deskripsi / Keterangan</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => updateField('deskripsi', e.target.value)}
                  className="textarea-field"
                  rows={3}
                  placeholder="Agenda tambahan, informasi teknis, dst."
                />
              </div>

              {/* Preview */}
              {form.status && form.kategori && (
                <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-2 border border-gray-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${KATEGORI_STYLE[form.kategori] || 'bg-gray-100 text-gray-700'}`}>
                    {form.kategori}
                  </span>
                  {form.komisi && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                      {form.komisi}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[form.status]}`}>
                    {form.status}
                  </span>
                  <span className="text-xs text-gray-400">Preview badge di kalender publik</span>
                </div>
              )}

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline btn-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary btn-sm gap-2 min-w-[100px]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan...
                    </span>
                  ) : (
                    <><FaSave /> Simpan</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== KONFIRMASI HAPUS ===== */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Hapus Agenda?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Agenda ini akan dihapus permanen dan tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline btn-sm flex-1"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-danger btn-sm flex-1 gap-2"
              >
                <FaTrash /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
