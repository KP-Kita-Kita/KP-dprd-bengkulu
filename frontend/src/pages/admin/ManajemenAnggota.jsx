import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaPlus, FaEdit, FaTrash, FaUser, FaTimes, FaSave } from 'react-icons/fa';

export default function ManajemenAnggota() {
  const [anggota, setAnggota] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ nama: '', jabatan: 'Anggota', komisi: '', daerah_pemilihan: '', fraksi: '', bio: '', periode: '2024-2029' });
  const [foto, setFoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/anggota');
      setAnggota(res.data.data || res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama: '', jabatan: 'Anggota', komisi: '', daerah_pemilihan: '', fraksi: '', bio: '', periode: '2024-2029' });
    setFoto(null); setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ nama: item.nama, jabatan: item.jabatan, komisi: item.komisi || '', daerah_pemilihan: item.daerah_pemilihan || '', fraksi: item.fraksi || '', bio: item.bio || '', periode: item.periode || '2024-2029' });
    setFoto(null); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (foto) fd.append('foto', foto);
      if (editItem) await API.put(`/anggota/${editItem.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await API.post('/anggota', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModal(false); fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus anggota ini?')) return;
    try { await API.delete(`/anggota/${id}`); fetchData(); }
    catch { alert('Gagal menghapus.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Anggota</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola data anggota DPRD.</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2"><FaPlus /> Tambah Anggota</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-600">Nama</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Jabatan</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Fraksi</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Komisi</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {anggota.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.foto ? <img src={item.foto} className="w-full h-full object-cover" /> : <FaUser className="text-primary-400 text-xs" />}
                        </div>
                        <span className="font-medium text-primary-800">{item.nama}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{item.jabatan}</td>
                    <td className="p-4 text-gray-500 text-xs">{item.fraksi || '-'}</td>
                    <td className="p-4 text-gray-500">{item.komisi || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><FaEdit /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {anggota.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">Belum ada data anggota.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-800">{editItem ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div><label className="label-field">Nama Lengkap</label><input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-field">Jabatan</label>
                  <select value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} className="select-field">
                    <option>Ketua DPRD</option><option>Wakil Ketua I</option><option>Wakil Ketua II</option><option>Wakil Ketua III</option><option>Anggota</option>
                  </select>
                </div>
                <div><label className="label-field">Komisi</label>
                  <select value={form.komisi} onChange={(e) => setForm({ ...form, komisi: e.target.value })} className="select-field">
                    <option value="">-</option><option>Komisi I</option><option>Komisi II</option><option>Komisi III</option><option>Komisi IV</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label-field">Fraksi</label><input type="text" value={form.fraksi} onChange={(e) => setForm({ ...form, fraksi: e.target.value })} className="input-field" /></div>
                <div><label className="label-field">Daerah Pemilihan</label><input type="text" value={form.daerah_pemilihan} onChange={(e) => setForm({ ...form, daerah_pemilihan: e.target.value })} className="input-field" /></div>
              </div>
              <div><label className="label-field">Periode</label><input type="text" value={form.periode} onChange={(e) => setForm({ ...form, periode: e.target.value })} className="input-field" /></div>
              <div><label className="label-field">Foto</label><input type="file" accept="image/*" onChange={(e) => setFoto(e.target.files[0])} className="input-field" /></div>
              <div><label className="label-field">Bio</label><textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="textarea-field" rows={4} /></div>
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
