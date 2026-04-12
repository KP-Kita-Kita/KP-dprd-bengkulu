import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaFileAlt, FaDownload, FaSearch, FaFilePdf, FaCalendarAlt, FaFolder } from 'react-icons/fa';

export default function Dokumen() {
  const [dokumen, setDokumen] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, [selectedKategori]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dokRes, katRes] = await Promise.all([
        API.get('/dokumen', { params: { kategori_id: selectedKategori || undefined } }),
        API.get('/dokumen/kategori'),
      ]);
      setDokumen(dokRes.data.data || dokRes.data || []);
      setKategori(katRes.data.data || katRes.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filtered = search ? dokumen.filter(d => d.judul.toLowerCase().includes(search.toLowerCase())) : dokumen;
  const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="page-container">
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaFileAlt className="text-secondary-400" /><span>Transparansi Publik</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Dokumen Publik</h1>
            <p className="text-white/70 text-lg">Akses dokumen resmi DPRD Provinsi Bengkulu secara transparan.</p>
          </div>
        </div>
      </section>

      <section className="py-6 bg-gray-50 border-b">
        <div className="content-container flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari dokumen..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-11" />
          </div>
          <select value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="select-field md:w-56">
            <option value="">Semua Kategori</option>
            {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
      </section>

      <section className="py-16">
        <div className="content-container">
          {loading ? <LoadingSpinner /> : filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((doc, idx) => (
                <div key={doc.id} className="card p-5 flex flex-col md:flex-row md:items-center gap-4 group hover:border-primary-200 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${idx * 0.03}s` }}>
                  <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaFilePdf className="text-2xl text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary-800 mb-1 text-sm">{doc.judul}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      {doc.kategori_nama && <span className="flex items-center gap-1"><FaFolder /> {doc.kategori_nama}</span>}
                      {doc.tahun && <span>{doc.tahun}</span>}
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </div>
                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm gap-2 flex-shrink-0">
                    <FaDownload /><span>Unduh</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <FaFileAlt className="text-5xl mx-auto mb-4" />
              <p className="text-lg">Belum ada dokumen tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
