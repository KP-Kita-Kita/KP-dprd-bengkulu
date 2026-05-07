import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import {
  FaLandmark, FaUsers, FaNewspaper, FaFileAlt, FaComments,
  FaArrowRight, FaCalendarAlt, FaChevronRight, FaGavel, FaHandshake,
  FaBalanceScale, FaEye, FaClock, FaMapMarkerAlt, FaVideo
} from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Kategori agenda → label + warna
const KATEGORI_STYLE = {
  'Agenda':      { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  'Masa Sidang': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Reses':       { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500' },
};

const STATUS_STYLE = {
  Menunggu:    { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200' },
  Berlangsung: { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200' },
  Selesai:     { bg: 'bg-gray-50',    text: 'text-gray-500',    border: 'border-gray-200' },
  Ditunda:     { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200' },
};

export default function Beranda() {
  const [berita, setBerita] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [stats, setStats] = useState({ anggota: 0, berita: 0, dokumen: 0, aspirasi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [beritaRes, anggotaRes, agendaRes] = await Promise.all([
        API.get('/berita?limit=3'),
        API.get('/anggota'),
        API.get('/agenda/public/terdekat'),
      ]);
      setBerita(beritaRes.data.data || beritaRes.data || []);
      const anggotaData = anggotaRes.data.data || anggotaRes.data || [];
      setStats(prev => ({ ...prev, anggota: anggotaData.length }));
      setAgenda(agendaRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const quickLinks = [
    { icon: FaGavel, label: 'Legislasi', desc: 'Peraturan & Keputusan Daerah', path: '/dokumen', color: 'from-primary-800 to-primary-900' },
    { icon: FaUsers, label: 'Anggota DPRD', desc: 'Profil Anggota Dewan', path: '/profil?tab=anggota', color: 'from-primary-800 to-primary-900' },
    { icon: FaComments, label: 'Aspirasi', desc: 'Sampaikan Aspirasi Anda', path: '/aspirasi', color: 'from-primary-800 to-primary-900' },
    { icon: FaBalanceScale, label: 'Transparansi', desc: 'Dokumen Publik', path: '/dokumen', color: 'from-primary-800 to-primary-900' },
  ];

  const fungsiDPRD = [
    { icon: FaGavel, title: 'Fungsi Legislasi', desc: 'Membentuk Peraturan Daerah bersama Gubernur untuk kepentingan masyarakat Bengkulu.' },
    { icon: FaEye, title: 'Fungsi Pengawasan', desc: 'Mengawasi pelaksanaan Peraturan Daerah dan kebijakan Pemerintah Daerah.' },
    { icon: FaBalanceScale, title: 'Fungsi Anggaran', desc: 'Membahas dan menyetujui RAPBD bersama Gubernur untuk kesejahteraan rakyat.' },
  ];

  return (
    <div className="page-container">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image Layer */}
        {/* Menggunakan bg-center untuk memastikan fokus di tengah (wajah/gedung), dan min-h-[75vh] agar proporsi mobile tidak terlalu memotong sisi kiri/kanan */}
        <div className="absolute inset-0 bg-hero-image bg-cover bg-center bg-no-repeat" />
        
        {/* Red Overlay Layer */}
        <div className="absolute inset-0 bg-hero-gradient opacity-85" />

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="content-container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-8 animate-fade-in border border-white/10">
              <FaLandmark className="text-secondary-400" />
              <span>Dewan Perwakilan Rakyat Daerah</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              DPRD Provinsi
              <span className="block mt-2 pb-2 bg-clip-text text-transparent bg-gold-gradient">Bengkulu</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Mewujudkan lembaga legislatif yang profesional, transparan, dan akuntabel dalam memperjuangkan kepentingan rakyat Bengkulu.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/profil" className="btn-secondary gap-2">
                <span>Tentang DPRD</span>
                <FaArrowRight className="text-sm" />
              </Link>
              <Link to="/aspirasi" className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary-800 gap-2">
                <FaComments />
                <span>Sampaikan Aspirasi</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== QUICK LINKS ===== */}
      <section className="py-16 -mt-8 relative z-10">
        <div className="content-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickLinks.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="group relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} transition-transform duration-500 group-hover:scale-110`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="text-xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                  <FaChevronRight className="absolute bottom-6 right-6 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FUNGSI DPRD ===== */}
      <section className="py-20 bg-gray-50">
        <div className="content-container">
          <div className="text-center mb-14">
            <p className="text-secondary-500 font-semibold text-sm uppercase tracking-wider mb-3">Tugas & Fungsi</p>
            <h2 className="section-title mx-auto">Fungsi Utama DPRD</h2>
            <p className="section-subtitle mx-auto mt-3">Tiga pilar utama dalam menjalankan tugas dan fungsi sebagai lembaga legislatif daerah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fungsiDPRD.map((item, idx) => (
              <div key={idx} className="card p-8 text-center group hover:-translate-y-2 transition-all duration-500">
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-50 rounded-2xl flex items-center justify-center
                             group-hover:bg-primary-800 transition-colors duration-500">
                  <item.icon className="text-2xl text-primary-800 group-hover:text-secondary-400 transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-primary-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BERITA TERKINI ===== */}
      <section className="py-20">
        <div className="content-container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-secondary-500 font-semibold text-sm uppercase tracking-wider mb-3">Informasi Terbaru</p>
              <h2 className="section-title">Berita & Kegiatan</h2>
            </div>
            <Link to="/berita" className="hidden md:flex items-center gap-2 text-primary-800 font-semibold hover:text-primary-600 transition-colors group">
              <span>Lihat Semua</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : berita.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {berita.map((item, idx) => (
                <Link key={item.id} to={`/berita/${item.id}`}
                  className="card-hover group overflow-hidden"
                  style={{ animationDelay: `${idx * 0.1}s` }}
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
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <FaCalendarAlt />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                    <h3 className="font-bold text-primary-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {item.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {item.konten?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FaNewspaper className="text-4xl mx-auto mb-3" />
              <p>Belum ada berita terbaru.</p>
            </div>
          )}

          <div className="md:hidden text-center mt-8">
            <Link to="/berita" className="btn-primary gap-2">
              Lihat Semua Berita <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AGENDA TERDEKAT ===== */}
      <section className="py-20 bg-gray-50">
        <div className="content-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-secondary-500 font-semibold text-sm uppercase tracking-wider mb-3">Jadwal Kegiatan</p>
              <h2 className="section-title">Agenda Terdekat</h2>
            </div>
            <Link to="/agenda" className="hidden md:flex items-center gap-2 text-primary-800 font-semibold hover:text-primary-600 transition-colors group">
              <span>Lihat Kalender</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="card p-5 animate-pulse flex gap-5">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : agenda.length > 0 ? (
            <div className="space-y-4">
              {agenda.map((item, idx) => {
                const katStyle  = KATEGORI_STYLE[item.kategori]  || { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-400' };
                const statStyle = STATUS_STYLE[item.status]  || { bg: 'bg-gray-50',    text: 'text-gray-500',   border: 'border-gray-200' };
                const tglMulai = new Date(item.waktu_mulai);
                const isLive = item.status === 'Berlangsung';

                return (
                  <div
                    key={item.id}
                    className={`card p-5 flex flex-col sm:flex-row sm:items-center gap-5
                      hover:border-primary-200 hover:-translate-y-0.5 hover:shadow-lg
                      transition-all duration-300 animate-fade-in-up
                      ${statStyle.bg} ${statStyle.border}`}
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    {/* Tanggal Box */}
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center flex-shrink-0 border border-gray-100">
                      <span className="text-2xl font-black text-primary-800 leading-none">
                        {tglMulai.getDate()}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        {tglMulai.toLocaleDateString('id-ID', { month: 'short' })}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${katStyle.bg} ${katStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${katStyle.dot}`} />
                          {item.kategori}
                        </span>
                        {isLive && item.link_streaming && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                            <FaVideo className="text-[10px]" /> LIVE
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-primary-800 text-sm leading-snug line-clamp-1">{item.judul}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaClock className="text-gray-300" />
                          {tglMulai.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                        {item.lokasi && (
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-gray-300" /> {item.lokasi}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 ${statStyle.text}`}>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14 text-gray-400">
              <FaCalendarAlt className="text-4xl mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Tidak ada agenda dalam waktu dekat.</p>
            </div>
          )}

          {/* Tombol Lihat Kalender Lengkap */}
          <div className="text-center mt-10">
            <Link to="/agenda" className="btn-primary gap-2 px-8 py-3.5">
              <FaCalendarAlt />
              <span>Lihat Kalender Lengkap</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ASPIRASI ===== */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="content-container relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FaHandshake className="text-3xl text-secondary-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Suara Anda Penting Bagi Kami
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Sampaikan aspirasi, keluhan, dan harapan Anda untuk pembangunan Provinsi Bengkulu yang lebih baik.
            </p>
            <Link to="/aspirasi" className="btn-secondary text-lg px-8 py-4 gap-2">
              <FaComments />
              <span>Kirim Aspirasi</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
