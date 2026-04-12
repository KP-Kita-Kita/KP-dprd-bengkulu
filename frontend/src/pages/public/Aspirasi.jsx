import { useState } from 'react';
import API from '../../api/axios';
import { FaComments, FaPaperPlane, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

export default function Aspirasi() {
  const [form, setForm] = useState({ nama: '', email: '', kategori: 'umum', isi: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.isi.trim()) { setError('Isi aspirasi wajib diisi.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/aspirasi', form);
      setSuccess(true);
      setForm({ nama: '', email: '', kategori: 'umum', isi: '' });
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
                <p>Aspirasi Anda akan diteruskan kepada anggota DPRD terkait. Nama dan email bersifat opsional. Isi aspirasi dengan jelas dan sopan.</p>
              </div>
            </div>

            {success ? (
              <div className="card p-12 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-4xl text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-primary-800 mb-3">Aspirasi Terkirim!</h2>
                <p className="text-gray-500 mb-8">Terima kasih atas partisipasi Anda. Aspirasi Anda akan kami proses dan tindaklanjuti.</p>
                <button onClick={() => setSuccess(false)} className="btn-primary">
                  Kirim Aspirasi Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                <h2 className="text-xl font-bold text-primary-800 flex items-center gap-3">
                  <FaComments className="text-secondary-500" />
                  Formulir Aspirasi
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label-field">Nama <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="input-field" placeholder="Nama Anda" />
                  </div>
                  <div>
                    <label className="label-field">Email <span className="text-gray-400 font-normal">(opsional)</span></label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" placeholder="email@contoh.com" />
                  </div>
                </div>

                <div>
                  <label className="label-field">Kategori</label>
                  <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} className="select-field">
                    {kategoriOptions.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label-field">Isi Aspirasi <span className="text-red-500">*</span></label>
                  <textarea value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} className="textarea-field" rows={6} placeholder="Tuliskan aspirasi, keluhan, atau saran Anda..." required />
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
    </div>
  );
}
