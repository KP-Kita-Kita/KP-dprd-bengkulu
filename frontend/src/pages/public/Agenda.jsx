import { useState, useEffect, useCallback, useMemo } from 'react';
import API from '../../api/axios';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTimes,
  FaVideo, FaExternalLinkAlt, FaChevronLeft, FaChevronRight,
  FaYoutube, FaUsers
} from 'react-icons/fa';

// ===== KONFIGURASI =====
const KATEGORI_CONFIG = {
  'Agenda':      { color: '#1d4ed8', bg: 'bg-blue-700',   light: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   dot: '#2563eb' },
  'Masa Sidang': { color: '#9333ea', bg: 'bg-purple-600', light: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', dot: '#a855f7' },
  'Reses':       { color: '#d97706', bg: 'bg-amber-600',  light: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  dot: '#f59e0b' },
};
const FALLBACK_CFG = { color: '#374151', bg: 'bg-gray-600', light: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: '#6b7280' };
const getKatCfg = (kategori) => KATEGORI_CONFIG[kategori] || FALLBACK_CFG;

const STATUS_CONFIG = {
  Menunggu:    { badge: 'bg-amber-100 text-amber-700' },
  Berlangsung: { badge: 'bg-green-100 text-green-700' },
  Selesai:     { badge: 'bg-gray-100 text-gray-500' },
  Ditunda:     { badge: 'bg-red-100 text-red-600' },
};
const FALLBACK_STATUS = { badge: 'bg-gray-100 text-gray-500' };
const getStatCfg = (status) => STATUS_CONFIG[status] || FALLBACK_STATUS;

const HARI  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

// ===== HELPERS =====
const toDateKey = (d) => {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth()    === b.getMonth()    &&
  a.getDate()     === b.getDate();

const formatTime = (dt) =>
  new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const formatDateHeader = (d) =>
  d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const patterns = [/youtube\.com\/watch\?v=([^&]+)/, /youtu\.be\/([^?]+)/, /youtube\.com\/live\/([^?]+)/];
  for (const p of patterns) { const m = url.match(p); if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=1`; }
  return null;
};

const getDaysInMonth = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  // Mulai dari Minggu (index 0)
  const startPad = firstDay.getDay(); // 0 = Minggu
  const days = [];

  // Padding awal (hari bulan sebelumnya)
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, currentMonth: false });
  }
  // Hari bulan ini
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), currentMonth: true });
  }
  // Padding akhir
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), currentMonth: false });
  }
  return days;
};

// ===== MODAL DETAIL =====
function AgendaModal({ agenda, onClose }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const cfg      = getKatCfg(agenda.kategori);
  const statCfg  = getStatCfg(agenda.status);
  const isLive   = agenda.status === 'Berlangsung';
  const embedUrl = getYouTubeEmbedUrl(agenda.link_streaming);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
        {/* Header berwarna */}
        <div className="p-6 text-white relative" style={{ backgroundColor: cfg.color }}>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
            <FaTimes className="text-sm" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">{agenda.kategori}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statCfg.badge}`}>{agenda.status}</span>
          </div>
          <h2 className="text-xl font-bold leading-snug pr-8">{agenda.judul}</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Waktu */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <FaClock className="text-gray-500 text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Waktu</p>
              <p className="font-semibold text-gray-800 text-sm">
                {new Date(agenda.waktu_mulai).toLocaleString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">s/d {formatTime(agenda.waktu_selesai)} WIB</p>
            </div>
          </div>

          {/* Lokasi */}
          {agenda.lokasi && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-gray-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Lokasi</p>
                <p className="font-semibold text-gray-800 text-sm">{agenda.lokasi}</p>
              </div>
            </div>
          )}

          {agenda.deskripsi && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed">{agenda.deskripsi}</div>
          )}

          {/* Streaming */}
          {agenda.link_streaming && (
            isLive ? (
              !showEmbed ? (
                <button
                  onClick={() => embedUrl ? setShowEmbed(true) : window.open(agenda.link_streaming, '_blank')}
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl
                             bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all
                             shadow-lg shadow-red-500/30 hover:-translate-y-0.5"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"/>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"/>
                  </span>
                  🔴 LIVE NOW — Tonton Sekarang
                  {embedUrl ? <FaYoutube className="text-lg"/> : <FaExternalLinkAlt className="text-xs"/>}
                </button>
              ) : (
                <div className="rounded-xl overflow-hidden bg-black">
                  <div className="flex items-center justify-between bg-red-600 px-4 py-2">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse"/> LIVE STREAMING
                    </span>
                    <button onClick={() => setShowEmbed(false)} className="text-white/80 hover:text-white text-xs">Tutup Player</button>
                  </div>
                  <div className="relative" style={{ paddingTop: '56.25%' }}>
                    <iframe src={embedUrl} className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen title="Live Streaming"/>
                  </div>
                </div>
              )
            ) : (
              <a href={agenda.link_streaming} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl
                           border-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100
                           font-semibold text-sm transition-all">
                <FaVideo className="text-blue-500"/> Lihat Link Streaming <FaExternalLinkAlt className="text-xs"/>
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ===== KOMPONEN KALENDER MINI KUSTOM =====
function MiniCalendar({ currentMonth, currentYear, agendaMap, selectedDate, onSelectDate, onPrevMonth, onNextMonth }) {
  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const today = new Date();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header bulan */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={onPrevMonth}
          className="w-8 h-8 rounded-lg border border-primary-200 text-primary-800 hover:bg-primary-50 flex items-center justify-center transition-colors">
          <FaChevronLeft className="text-xs"/>
        </button>
        <h3 className="font-bold text-primary-800 text-base">
          {BULAN[currentMonth]} {currentYear}
        </h3>
        <button onClick={onNextMonth}
          className="w-8 h-8 rounded-lg border border-primary-200 text-primary-800 hover:bg-primary-50 flex items-center justify-center transition-colors">
          <FaChevronRight className="text-xs"/>
        </button>
      </div>

      {/* Grid hari */}
      <div className="p-4">
        {/* Header hari */}
        <div className="grid grid-cols-7 mb-2">
          {HARI.map(h => (
            <div key={h} className="text-center text-xs font-bold text-gray-400 py-1">{h}</div>
          ))}
        </div>

        {/* Tanggal-tanggal */}
        <div className="grid grid-cols-7 gap-y-1">
          {days.map(({ date, currentMonth: isCurrent }, idx) => {
            const key        = toDateKey(date);
            const hasAgenda  = Boolean(agendaMap[key]?.length);
            const isToday    = sameDay(date, today);
            const isSelected = sameDay(date, selectedDate);
            const items      = agendaMap[key] || [];
            // Ambil warna dot dari kategori pertama
            const dotColor   = items[0] ? (KATEGORI_CONFIG[items[0].kategori]?.dot || '#6b7280') : null;

            return (
              <button
                key={idx}
                onClick={() => onSelectDate(date)}
                className={`
                  relative flex flex-col items-center justify-center h-10 w-full rounded-lg text-sm
                  font-medium transition-all duration-150
                  ${!isCurrent ? 'text-gray-300' : ''}
                  ${isCurrent && !isSelected && !isToday ? 'text-gray-700 hover:bg-gray-100' : ''}
                  ${isToday && !isSelected ? 'text-primary-800 font-bold' : ''}
                  ${isSelected ? 'bg-primary-800 text-white shadow-md' : ''}
                `}
              >
                <span className="leading-none">{date.getDate()}</span>
                {/* Dot indikator agenda */}
                {hasAgenda && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: isSelected ? 'white' : dotColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legenda */}
      <div className="px-5 py-3 border-t border-gray-100">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {Object.entries(KATEGORI_CONFIG).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: val.dot }}/>
              {key}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== KOMPONEN DAFTAR AGENDA HARIAN =====
function DailyAgendaList({ selectedDate, agendaMap, onClickAgenda, onPrevDay, onNextDay }) {
  const key   = toDateKey(selectedDate);
  const items = agendaMap[key] || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header tanggal */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={onPrevDay}
          className="w-8 h-8 rounded-lg border border-primary-200 text-primary-800 hover:bg-primary-50 flex items-center justify-center transition-colors">
          <FaChevronLeft className="text-xs"/>
        </button>
        <div className="text-center">
          <h3 className="font-bold text-primary-800 text-sm md:text-base">
            {formatDateHeader(selectedDate)}
          </h3>
        </div>
        <button onClick={onNextDay}
          className="w-8 h-8 rounded-lg border border-primary-200 text-primary-800 hover:bg-primary-50 flex items-center justify-center transition-colors">
          <FaChevronRight className="text-xs"/>
        </button>
      </div>

      {/* List agenda */}
      <div className="flex-1 overflow-y-auto">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item, idx) => {
              const cfg    = getKatCfg(item.kategori);
              const isLive = item.status === 'Berlangsung';

              return (
                <button
                  key={item.id}
                  onClick={() => onClickAgenda(item)}
                  className="w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors group"
                >
                  {/* Timeline dot + waktu */}
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-offset-2"
                      style={{ backgroundColor: cfg.dot, ringColor: cfg.dot }}
                    />
                    <span className="text-sm font-bold text-gray-700">
                      {formatTime(item.waktu_mulai)}
                    </span>
                    {isLive && item.link_streaming && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                        ● LIVE
                      </span>
                    )}
                    {item.link_streaming && !isLive && (
                      <FaVideo className="text-blue-400 text-xs"/>
                    )}
                  </div>

                  {/* Judul */}
                  <p className="text-sm font-semibold text-primary-800 leading-snug mb-2 group-hover:text-primary-600 transition-colors pl-6">
                    {item.judul}
                  </p>

                  {/* Badge kategori */}
                  <div className="flex items-center gap-2 pl-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${cfg.light} ${cfg.text} ${cfg.border}`}>
                      {item.kategori}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs ${getStatCfg(item.status).badge}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Lokasi */}
                  {item.lokasi && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5 pl-6">
                      <FaMapMarkerAlt className="text-gray-300 flex-shrink-0"/>
                      {item.lokasi}
                    </p>
                  )}
                  {/* Komisi */}
                  {item.komisi && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 pl-6">
                      <FaUsers className="text-gray-300 flex-shrink-0"/>
                      {item.komisi}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-2xl text-gray-300"/>
            </div>
            <p className="text-gray-400 font-medium text-sm">Tidak ada agenda</p>
            <p className="text-gray-300 text-xs mt-1">untuk tanggal ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== KOMPONEN HALAMAN UTAMA =====
export default function Agenda() {
  const today = new Date();
  const [allAgenda, setAllAgenda]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedDate, setSelectedDate]   = useState(today);
  const [calMonth, setCalMonth]           = useState(today.getMonth());
  const [calYear, setCalYear]             = useState(today.getFullYear());
  const [selectedAgenda, setSelectedAgenda] = useState(null);

  // Fetch semua agenda (satu bulan sesuai kalender)
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await API.get('/agenda/public');
        setAllAgenda(res.data || []);
      } catch (err) {
        console.error('Gagal fetch agenda:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Build agendaMap: { 'YYYY-MM-DD': [agenda, ...] }
  const agendaMap = useMemo(() => {
    const map = {};
    allAgenda.forEach(item => {
      const key = toDateKey(new Date(item.waktu_mulai));
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    // Sort per hari berdasarkan waktu mulai
    Object.keys(map).forEach(key => {
      map[key].sort((a, b) => new Date(a.waktu_mulai) - new Date(b.waktu_mulai));
    });
    return map;
  }, [allAgenda]);

  const handlePrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setCalMonth(date.getMonth());
    setCalYear(date.getFullYear());
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    handleSelectDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    handleSelectDate(next);
  };

  // Hitung total agenda bulan ini untuk subtitle
  const totalBulanIni = useMemo(() => {
    return allAgenda.filter(item => {
      const d = new Date(item.waktu_mulai);
      return d.getMonth() === calMonth && d.getFullYear() === calYear;
    }).length;
  }, [allAgenda, calMonth, calYear]);

  return (
    <div className="page-container">
      {/* HEADER */}
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90
                           px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaCalendarAlt className="text-secondary-400"/>
              <span>Jadwal Kegiatan</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Agenda &amp; Jadwal</h1>
            <p className="text-white/70 text-lg">Kalender kegiatan resmi DPRD Provinsi Bengkulu.</p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="content-container">

          {/* Subtitle bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-primary-800">
                Agenda <span className="text-secondary-500">{BULAN[calMonth]} {calYear}</span>
              </h2>
              {!loading && (
                <p className="text-sm text-gray-400 mt-0.5">
                  {totalBulanIni} kegiatan terjadwal bulan ini
                </p>
              )}
            </div>
            <button
              onClick={() => handleSelectDate(today)}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-primary-200 text-primary-700 bg-white hover:bg-primary-50 transition-colors"
            >
              Hari Ini
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto mb-4"/>
                <p className="text-gray-400 text-sm">Memuat agenda...</p>
              </div>
            </div>
          ) : (
            /* SPLIT LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

              {/* KIRI: Daftar Agenda Harian */}
              <div className="min-h-[520px]">
                <DailyAgendaList
                  selectedDate={selectedDate}
                  agendaMap={agendaMap}
                  onClickAgenda={setSelectedAgenda}
                  onPrevDay={handlePrevDay}
                  onNextDay={handleNextDay}
                />
              </div>

              {/* KANAN: Kalender Mini */}
              <div className="lg:sticky lg:top-24">
                <MiniCalendar
                  currentMonth={calMonth}
                  currentYear={calYear}
                  agendaMap={agendaMap}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                  onPrevMonth={handlePrevMonth}
                  onNextMonth={handleNextMonth}
                />

                {/* Upcoming summary */}
                {(() => {
                  const upcoming = allAgenda
                    .filter(a => new Date(a.waktu_mulai) >= today && a.status !== 'Selesai')
                    .slice(0, 3);
                  return upcoming.length > 0 ? (
                    <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Akan Datang</p>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {upcoming.map(item => {
                          const cfg = getKatCfg(item.kategori);
                          const d = new Date(item.waktu_mulai);
                          return (
                            <button
                              key={item.id}
                              onClick={() => { handleSelectDate(d); setSelectedAgenda(item); }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                            >
                              <div className="w-8 h-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-white"
                                style={{ backgroundColor: cfg.dot }}>
                                <span className="text-[11px] font-black leading-none">{d.getDate()}</span>
                                <span className="text-[8px] uppercase">{BULAN[d.getMonth()].slice(0,3)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{item.judul}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{formatTime(item.waktu_mulai)} WIB</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {selectedAgenda && (
        <AgendaModal agenda={selectedAgenda} onClose={() => setSelectedAgenda(null)}/>
      )}
    </div>
  );
}
