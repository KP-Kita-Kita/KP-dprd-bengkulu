import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaMapMarkedAlt, FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUsers } from 'react-icons/fa';

export default function ManajemenDapil() {
  const [dapilList, setDapilList] = useState([]);
  const [anggotaList, setAnggotaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ nama: '', deskripsi: '', anggota_ids: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); fetchAnggota(); }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/dapil');
      setDapilList(res.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchAnggota = async () => {
    try {
      const res = await API.get('/anggota');
      let data = res.data.data || res.data || [];
      
      // Mengurutkan berdasarkan dapil lalu nama
      data.sort((a, b) => {
        const dapilA = a.dapil || 'ZZZ'; // yang kosong taruh di bawah
        const dapilB = b.dapil || 'ZZZ';
        if (dapilA !== dapilB) return dapilA.localeCompare(dapilB);
        return (a.nama || '').localeCompare(b.nama || '');
      });
      
      setAnggotaList(data);
    } catch (err) { console.error(err); }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ nama: '', deskripsi: '', anggota_ids: [] });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      nama: item.nama,
      deskripsi: item.deskripsi || '',
      anggota_ids: item.anggota ? item.anggota.map(a => a.id) : []
    });
    setShowModal(true);
  };

  const toggleAnggota = (id) => {
    setForm(prev => ({
      ...prev,
      anggota_ids: prev.anggota_ids.includes(id)
        ? prev.anggota_ids.filter(a => a !== id)
        : [...prev.anggota_ids, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nama: form.nama,
        deskripsi: form.deskripsi,
        anggota_ids: form.anggota_ids
      };

      if (editItem) {
        await API.put(`/dapil/${editItem.id}`, payload);
      } else {
        await API.post('/dapil', payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus dapil ini?')) return;
    try { await API.delete(`/dapil/${id}`); fetchData(); }
    catch (err) { alert('Gagal menghapus.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-800">Manajemen Dapil</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola daerah pemilihan dan mapping anggota DPRD.</p>
        </div>
        <button onClick={openCreate} className="btn-primary gap-2"><FaPlus /> Tambah Dapil</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {dapilList.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-primary-800 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-secondary-500" /> {item.nama}
                  </h3>
                  {item.deskripsi && <p className="text-gray-500 text-sm mt-1">{item.deskripsi}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><FaTrash /></button>
                </div>
              </div>

              {/* Wilayah */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Wilayah</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.wilayah && item.wilayah.map(w => (
                    <span key={w.id} className="badge-primary text-[11px]">{w.kabupaten_nama}</span>
                  ))}
                  {(!item.wilayah || item.wilayah.length === 0) && <span className="text-xs text-gray-400">Belum ada wilayah</span>}
                </div>
              </div>

              {/* Anggota */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Anggota Dewan ({item.anggota?.length || 0})</p>
                <div className="space-y-1.5">
                  {item.anggota && item.anggota.map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-sm">
                      <FaUsers className="text-gray-400 text-xs" />
                      <span className="font-medium text-gray-700">{a.nama}</span>
                      <span className="text-xs text-gray-400">({a.fraksi})</span>
                    </div>
                  ))}
                  {(!item.anggota || item.anggota.length === 0) && <span className="text-xs text-gray-400">Belum ada anggota</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-800">{editItem ? 'Edit Dapil' : 'Tambah Dapil'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="label-field">Nama Dapil</label>
                <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" required placeholder="Contoh: Bengkulu 1" />
              </div>
              <div>
                <label className="label-field">Deskripsi</label>
                <input type="text" value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} className="input-field" placeholder="Keterangan wilayah dapil" />
              </div>

              {/* Pilih Anggota */}
              <div>
                <label className="label-field">Anggota Dewan</label>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {anggotaList.map(a => (
                    <label key={a.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg">
                      <input type="checkbox" checked={form.anggota_ids.includes(a.id)}
                        onChange={() => toggleAnggota(a.id)}
                        className="w-4 h-4 text-primary-600 rounded" />
                      <div>
                        <span className="text-sm font-medium">{a.nama}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {a.dapil ? <strong className="text-primary-600">[{a.dapil}]</strong> : ''} {a.fraksi} · {a.jabatan}
                        </span>
                      </div>
                    </label>
                  ))}
                  {anggotaList.length === 0 && <p className="text-sm text-gray-400">Belum ada data anggota.</p>}
                </div>
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
