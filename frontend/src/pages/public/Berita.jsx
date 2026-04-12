import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import { FaNewspaper, FaCalendarAlt, FaSearch, FaArrowRight } from 'react-icons/fa';

export default function Berita() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('');
  const limit = 9;

  useEffect(() => {
    fetchBerita();
  }, [page, kategori]);

  const fetchBerita = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (kategori) params.kategori = kategori;
      if (search) params.search = search;
      const res = await API.get('/berita', { params });
      const data = res.data;
      setBerita(data.data || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBerita();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="page-container">
      {/* Header */}
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaNewspaper className="text-secondary-400" />
              <span>Informasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita & Kegiatan</h1>
            <p className="text-white/70 text-lg">
              Informasi terbaru seputar kegiatan dan berita DPRD Provinsi Bengkulu.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="content-container">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <select
              value={kategori}
              onChange={(e) => { setKategori(e.target.value); setPage(1); }}
              className="select-field md:w-48"
            >
              <option value="">Semua Kategori</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="umum">Umum</option>
              <option value="pengumuman">Pengumuman</option>
            </select>
            <button type="submit" className="btn-primary">Cari</button>
          </form>
        </div>
      </section>

      {/* Berita List */}
      <section className="py-16">
        <div className="content-container">
          {loading ? (
            <LoadingSpinner />
          ) : berita.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {berita.map((item, idx) => (
                  <Link
                    key={item.id}
                    to={`/berita/${item.id}`}
                    className="card-hover group overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                      {item.gambar ? (
                        <img src={item.gambar} alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaNewspaper className="text-4xl text-primary-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="badge-gold">{item.kategori || 'Umum'}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                        <FaCalendarAlt />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      <h3 className="font-bold text-primary-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {item.judul}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                        {item.konten?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                      <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-semibold group-hover:gap-2 transition-all">
                        Baca Selengkapnya <FaArrowRight className="text-xs" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <FaNewspaper className="text-5xl mx-auto mb-4" />
              <p className="text-lg">Belum ada berita yang tersedia.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
