import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaNewspaper, FaTimes, FaSave } from 'react-icons/fa';

export default function ManajemenBerita() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', konten: '', kategori: 'umum', is_published: true });
  const [gambar, setGambar] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/berita?limit=100&admin=true');
      setBerita(res.data.data || res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ judul: '', konten: '', kategori: 'umum', is_published: true });
    setGambar(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ judul: item.judul, konten: item.konten, kategori: item.kategori || 'umum', is_published: item.is_published });
    setGambar(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('judul', form.judul);
      fd.append('konten', form.konten);
      fd.append('kategori', form.kategori);
      fd.append('is_published', form.is_published);
      if (gambar) fd.append('gambar', gambar);

      if (editItem) {
        await API.put(`/berita/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await API.post('/berita', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;
    try { await API.delete(`/berita/${id}`); fetchData(); }
    catch (err) { alert('Gagal menghapus.'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Berita</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola berita dan kegiatan DPRD.</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2"><FaPlus /> Tambah Berita</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Judul</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Kategori</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Tanggal</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {berita.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.gambar ? <img src={item.gambar} className="w-10 h-10 rounded-lg object-cover" /> : <FaNewspaper className="text-primary-400" />}
                        </div>
                        <span className="font-medium text-primary-800 line-clamp-1 max-w-xs">{item.judul}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="badge-primary">{item.kategori}</span></td>
                    <td className="p-4"><span className={item.is_published ? 'badge-success' : 'badge-warning'}>{item.is_published ? 'Publikas' : 'Draft'}</span></td>
                    <td className="p-4 text-gray-500">{formatDate(item.created_at)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {berita.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada berita.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-800">{editItem ? 'Edit Berita' : 'Tambah Berita'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="label-field">Judul</label>
                <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Kategori</label>
                  <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="select-field">
                    <option value="umum">Umum</option><option value="kegiatan">Kegiatan</option><option value="pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="label-field">Status</label>
                  <select value={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.value === 'true' })} className="select-field">
                    <option value="true">Publikasi</option><option value="false">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label-field">Gambar</label>
                <input type="file" accept="image/*" onChange={(e) => setGambar(e.target.files[0])} className="input-field" />
              </div>
              <div>
                <label className="label-field">Konten</label>
                <textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} className="textarea-field" rows={8} required />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline btn-sm">Batal</button>
                <button type="submit" disabled={saving} className="btn-primary btn-sm gap-2">
                  {saving ? 'Menyimpan...' : <><FaSave /> Simpan</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
