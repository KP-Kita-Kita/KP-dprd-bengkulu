import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FaComments, FaPaperPlane, FaCheckCircle, FaInfoCircle, FaMapMarkerAlt, FaPaperclip, FaExclamationTriangle } from 'react-icons/fa';

export default function Aspirasi() {
  const [form, setForm] = useState({
    nama: '', email: '', kategori: 'umum', isi: '',
    kabupaten_id: '', kabupaten_nama: '',
    kecamatan_id: '', kecamatan_nama: '',
    kelurahan_id: '', kelurahan_nama: ''
  });
  const [lampiran, setLampiran] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Data wilayah
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [loadingWilayah, setLoadingWilayah] = useState(false);

  // Load kabupaten on mount
  useEffect(() => {
    const fetchKabupaten = async () => {
      try {
        const res = await API.get('/wilayah/kabupaten');
        setKabupatenList(res.data || []);
      } catch (err) { console.error('Gagal load kabupaten:', err); }
    };
    fetchKabupaten();
  }, []);

  // Load kecamatan when kabupaten changes
  useEffect(() => {
    if (!form.kabupaten_id) { setKecamatanList([]); setKelurahanList([]); return; }
    const fetchKecamatan = async () => {
      setLoadingWilayah(true);
      try {
        const res = await API.get(`/wilayah/kecamatan/${form.kabupaten_id}`);
        setKecamatanList(res.data || []);
      } catch (err) { console.error('Gagal load kecamatan:', err); }
      finally { setLoadingWilayah(false); }
    };
    fetchKecamatan();
    setForm(prev => ({ ...prev, kecamatan_id: '', kecamatan_nama: '', kelurahan_id: '', kelurahan_nama: '' }));
    setKelurahanList([]);
  }, [form.kabupaten_id]);

  // Load kelurahan when kecamatan changes
  useEffect(() => {
    if (!form.kecamatan_id) { setKelurahanList([]); return; }
    const fetchKelurahan = async () => {
      setLoadingWilayah(true);
      try {
        const res = await API.get(`/wilayah/kelurahan/${form.kecamatan_id}`);
        setKelurahanList(res.data || []);
      } catch (err) { console.error('Gagal load kelurahan:', err); }
      finally { setLoadingWilayah(false); }
    };
    fetchKelurahan();
    setForm(prev => ({ ...prev, kelurahan_id: '', kelurahan_nama: '' }));
  }, [form.kecamatan_id]);

  const handleKabChange = (e) => {
    const id = e.target.value;
    const nama = kabupatenList.find(k => k.id === id)?.name || '';
    setForm(prev => ({ ...prev, kabupaten_id: id, kabupaten_nama: nama }));
  };

  const handleKecChange = (e) => {
    const id = e.target.value;
    const nama = kecamatanList.find(k => k.id === id)?.name || '';
    setForm(prev => ({ ...prev, kecamatan_id: id, kecamatan_nama: nama }));
  };

  const handleKelChange = (e) => {
    const id = e.target.value;
    const nama = kelurahanList.find(k => k.id === id)?.name || '';
    setForm(prev => ({ ...prev, kelurahan_id: id, kelurahan_nama: nama }));
  };

  const validateForm = () => {
    if (!form.nama.trim()) return 'Nama wajib diisi.';
    if (!form.isi.trim()) return 'Isi aspirasi wajib diisi.';
    if (!form.kabupaten_id) return 'Kabupaten/Kota wajib dipilih.';
    if (!form.kecamatan_id) return 'Kecamatan wajib dipilih.';
    if (!form.kelurahan_id) return 'Kelurahan wajib dipilih.';
    return null;
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }
    setError('');
    setShowConfirm(true);
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val) fd.append(key, val);
      });
      if (lampiran) fd.append('lampiran', lampiran);

      await API.post('/aspirasi', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setForm({
        nama: '', email: '', kategori: 'umum', isi: '',
        kabupaten_id: '', kabupaten_nama: '',
        kecamatan_id: '', kecamatan_nama: '',
        kelurahan_id: '', kelurahan_nama: ''
      });
      setLampiran(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim aspirasi.');
    } finally { setLoading(false); }
  };

  const kategoriOptions = [
    { value: 'umum', label: 'Umum' },
    { value: 'infrastruktur', label: 'Infrastruktur' },
    { value: 'pendidikan', label: 'Pendidikan' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'pengawasan', label: 'Pengawasan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  return (
    <div className="page-container">
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaComments className="text-secondary-400" /><span>Partisipasi Publik</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Aspirasi Masyarakat</h1>
            <p className="text-white/70 text-lg">Sampaikan aspirasi, keluhan, dan saran Anda untuk kemajuan Provinsi Bengkulu.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="content-container">
          <div className="max-w-2xl mx-auto">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8 flex gap-4">
              <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-semibold mb-1">Petunjuk Pengisian</p>
                <p>Aspirasi Anda akan secara otomatis diteruskan kepada anggota DPRD yang mewakili daerah pemilihan Anda. Pilih wilayah dengan benar agar aspirasi sampai ke perwakilan yang tepat.</p>
              </div>
            </div>

            {success ? (
              <div className="card p-12 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-primary-800 mb-3">Aspirasi Terkirim!</h2>
                <p className="text-gray-500 mb-8">Terima kasih atas partisipasi Anda. Aspirasi Anda akan kami proses dan diteruskan kepada anggota DPRD terkait.</p>
                <button onClick={() => setSuccess(false)} className="btn-primary">
                  Kirim Aspirasi Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handlePreSubmit} className="card p-8 space-y-6">
                <h2 className="text-xl font-bold text-primary-800 flex items-center gap-3">
                  <FaComments className="text-secondary-500" />
                  Formulir Aspirasi
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
                )}

                {/* Nama & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-field">Nama <span className="text-red-500">*</span></label>
                    <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" placeholder="Nama Anda" required />
                  </div>
                  <div>
                    <label className="label-field">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@contoh.com" />
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label className="label-field">Kategori <span className="text-red-500">*</span></label>
                  <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="select-field">
                    {kategoriOptions.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>

                {/* Wilayah */}
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary-500" /> Wilayah Anda <span className="text-red-500">*</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Kabupaten/Kota</label>
                      <select value={form.kabupaten_id} onChange={handleKabChange} className="select-field text-sm" required>
                        <option value="">-- Pilih --</option>
                        {kabupatenList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Kecamatan</label>
                      <select value={form.kecamatan_id} onChange={handleKecChange} className="select-field text-sm" required disabled={!form.kabupaten_id || loadingWilayah}>
                        <option value="">{loadingWilayah ? 'Memuat...' : '-- Pilih --'}</option>
                        {kecamatanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Kelurahan</label>
                      <select value={form.kelurahan_id} onChange={handleKelChange} className="select-field text-sm" required disabled={!form.kecamatan_id || loadingWilayah}>
                        <option value="">{loadingWilayah ? 'Memuat...' : '-- Pilih --'}</option>
                        {kelurahanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Isi Aspirasi */}
                <div>
                  <label className="label-field">Isi Aspirasi <span className="text-red-500">*</span></label>
                  <textarea value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} className="textarea-field" rows={6} placeholder="Tuliskan aspirasi, keluhan, atau saran Anda..." required />
                </div>

                {/* Lampiran */}
                <div>
                  <label className="label-field flex items-center gap-2">
                    <FaPaperclip className="text-gray-400" /> Lampiran <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setLampiran(e.target.files[0])}
                    className="input-field text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                  <p className="text-xs text-gray-400 mt-1">Format: gambar (JPEG, PNG) atau PDF. Maks 5MB.</p>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full gap-2 py-4">
                  {loading ? (
                    <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                  ) : (
                    <><FaPaperPlane /> Kirim Aspirasi</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Popup Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 mx-auto mb-5 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-2xl text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-primary-800 mb-2">Konfirmasi Pengiriman</h3>
            <p className="text-gray-500 text-sm mb-6">
              Pastikan <strong>kategori</strong> dan <strong>wilayah</strong> yang Anda pilih sudah benar. Aspirasi Anda akan diteruskan ke anggota DPRD berdasarkan wilayah tersebut.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Kategori:</span><span className="font-medium capitalize">{form.kategori}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kab/Kota:</span><span className="font-medium">{form.kabupaten_nama}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kecamatan:</span><span className="font-medium">{form.kecamatan_nama}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Kelurahan:</span><span className="font-medium">{form.kelurahan_nama}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="btn-outline flex-1">Kembali</button>
              <button onClick={handleSubmit} className="btn-primary flex-1">Ya, Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
