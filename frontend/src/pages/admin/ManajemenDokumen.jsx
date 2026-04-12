import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaFileAlt, FaTimes, FaSave, FaFilePdf } from 'react-icons/fa';

export default function ManajemenDokumen() {
  const [dokumen, setDokumen] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ judul: '', deskripsi: '', kategori_id: '', tahun: new Date().getFullYear().toString() });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [dokRes, katRes] = await Promise.all([API.get('/dokumen'), API.get('/dokumen/kategori')]);
      setDokumen(dokRes.data.data || dokRes.data || []);
      setKategori(katRes.data.data || katRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ judul: '', deskripsi: '', kategori_id: kategori[0]?.id || '', tahun: new Date().getFullYear().toString() });
    setFile(null); setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ judul: item.judul, deskripsi: item.deskripsi || '', kategori_id: item.kategori_id || '', tahun: item.tahun || '' });
    setFile(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      if (editItem) await API.put(`/dokumen/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else {
        if (!file) { alert('File dokumen wajib diupload.'); setSaving(false); return; }
        await API.post('/dokumen', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus dokumen ini?')) return;
    try { await API.delete(`/dokumen/${id}`); fetchData(); }
    catch { alert('Gagal menghapus.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Dokumen</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola dokumen publik DPRD.</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2"><FaPlus /> Upload Dokumen</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Judul</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Kategori</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Tahun</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dokumen.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaFilePdf className="text-red-500" />
                        </div>
                        <span className="font-medium text-primary-800 line-clamp-1">{item.judul}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className="badge-primary">{item.kategori_nama || '-'}</span></td>
                    <td className="p-4 text-gray-500">{item.tahun || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {dokumen.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-400">Belum ada dokumen.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-800">{editItem ? 'Edit Dokumen' : 'Upload Dokumen'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div><label className="label-field">Judul</label><input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} className="input-field" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-field">Kategori</label>
                  <select value={form.kategori_id} onChange={(e) => setForm({ ...form, kategori_id: e.target.value })} className="select-field">
                    <option value="">Pilih Kategori</option>
                    {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                </div>
                <div><label className="label-field">Tahun</label><input type="text" value={form.tahun} onChange={(e) => setForm({ ...form, tahun: e.target.value })} className="input-field" /></div>
              </div>
              <div><label className="label-field">File (PDF) {!editItem && <span className="text-red-500">*</span>}</label><input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="input-field" /></div>
              <div><label className="label-field">Deskripsi</label><textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="textarea-field" rows={3} /></div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline btn-sm">Batal</button>
                <button type="submit" disabled={saving} className="btn-primary btn-sm gap-2">{saving ? 'Menyimpan...' : <><FaSave /> Simpan</>}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
