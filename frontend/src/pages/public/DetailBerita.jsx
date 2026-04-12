import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft, FaShareAlt } from 'react-icons/fa';

export default function DetailBerita() {
  const { id } = useParams();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBerita();
  }, [id]);

  const fetchBerita = async () => {
    try {
      const res = await API.get(`/berita/${id}`);
      setBerita(res.data.data || res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => 
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-secondary-500 hover:text-secondary-600 underline break-all">
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: berita.judul,
          text: 'Baca berita ini di DPRD Provinsi Bengkulu',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Batal bagikan', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan berita berhasil disalin ke clipboard!');
    }
  };

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  if (!berita) {
    return (
      <div className="page-container">
        <div className="content-container py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Berita tidak ditemukan</h2>
          <Link to="/berita" className="btn-primary">Kembali ke Daftar Berita</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <section className="page-header">
        <div className="content-container relative z-10">
          <Link to="/berita" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
            <FaArrowLeft /> Kembali ke Berita
          </Link>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="badge-gold">{berita.kategori || 'Umum'}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">{berita.judul}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-secondary-400" />
                {formatDate(berita.created_at)}
              </span>
              {berita.author_name && (
                <span className="flex items-center gap-2">
                  <FaUser className="text-secondary-400" />
                  {berita.author_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="content-container">
          <div className="max-w-3xl mx-auto">
            {berita.gambar && (
              <div className="rounded-2xl overflow-hidden mb-10 shadow-lg -mt-16 relative z-10">
                <img src={berita.gambar} alt={berita.judul}
                  className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}

            <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {berita.konten?.split('\n').map((paragraph, idx) => (
                paragraph.trim() && <p key={idx} className="mb-5">{renderTextWithLinks(paragraph)}</p>
              ))}
            </article>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-500 hover:text-secondary-500 transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-secondary-50 transition-colors">
                    <FaShareAlt />
                  </div>
                  <span className="text-sm font-medium">Bagikan berita ini</span>
                </button>
                <Link to="/berita" className="btn-outline btn-sm gap-2">
                  <FaArrowLeft className="text-xs" />
                  Berita Lainnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
