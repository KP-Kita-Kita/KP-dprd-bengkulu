import { useState, useEffect } from 'react';
import API from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';
import {
  FaFileAlt, FaDownload, FaSearch, FaFilePdf, FaFileWord, FaFileExcel,
  FaFilePowerpoint, FaFileImage, FaFile, FaCalendarAlt, FaFolder,
  FaEye, FaTimes, FaSortAmountDown, FaChevronLeft, FaChevronRight,
  FaFileArchive
} from 'react-icons/fa';

// ====== UTILITAS DETEKSI FILE ======
const getFileInfo = (filePath) => {
  if (!filePath) return { icon: FaFile, color: 'text-gray-400', bg: 'bg-gray-50', label: 'File' };
  const ext = filePath.split('.').pop().toLowerCase();
  const map = {
    pdf:  { icon: FaFilePdf,        color: 'text-red-500',    bg: 'bg-red-50',    label: 'PDF' },
    doc:  { icon: FaFileWord,       color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'DOC' },
    docx: { icon: FaFileWord,       color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'DOCX' },
    xls:  { icon: FaFileExcel,      color: 'text-green-600',  bg: 'bg-green-50',  label: 'XLS' },
    xlsx: { icon: FaFileExcel,      color: 'text-green-600',  bg: 'bg-green-50',  label: 'XLSX' },
    ppt:  { icon: FaFilePowerpoint, color: 'text-orange-500', bg: 'bg-orange-50', label: 'PPT' },
    pptx: { icon: FaFilePowerpoint, color: 'text-orange-500', bg: 'bg-orange-50', label: 'PPTX' },
    jpg:  { icon: FaFileImage,      color: 'text-purple-500', bg: 'bg-purple-50', label: 'JPG' },
    jpeg: { icon: FaFileImage,      color: 'text-purple-500', bg: 'bg-purple-50', label: 'JPEG' },
    png:  { icon: FaFileImage,      color: 'text-purple-500', bg: 'bg-purple-50', label: 'PNG' },
    zip:  { icon: FaFileArchive,    color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'ZIP' },
    rar:  { icon: FaFileArchive,    color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'RAR' },
  };
  return map[ext] || { icon: FaFile, color: 'text-gray-500', bg: 'bg-gray-50', label: ext.toUpperCase() };
};

const formatFileSize = (bytes) => {
  if (!bytes) return null;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

// ====== SKELETON LOADING ======
function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col md:flex-row md:items-center gap-4 animate-pulse">
      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-100 rounded w-20" />
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <div className="h-9 w-24 bg-gray-200 rounded-lg" />
        <div className="h-9 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

// ====== KOMPONEN UTAMA ======
export default function Dokumen() {
  const [dokumen, setDokumen] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [previewDoc, setPreviewDoc] = useState(null);

  const debouncedSearch = useDebounce(search, 500);
  const LIMIT = 10;

  // Reset page saat filter berubah
  useEffect(() => { setPage(1); }, [selectedKategori, debouncedSearch, sort]);

  // Fetch dokumen saat dependency berubah
  useEffect(() => {
    fetchDokumen();
  }, [page, selectedKategori, debouncedSearch, sort]);

  // Fetch kategori hanya sekali
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await API.get('/dokumen/kategori');
        setKategori(res.data.data || res.data || []);
      } catch (err) { console.error(err); }
    };
    fetchKategori();
  }, []);

  const fetchDokumen = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (selectedKategori) params.kategori_id = selectedKategori;
      if (debouncedSearch) params.search = debouncedSearch;
      if (sort === 'oldest') params.sort = 'oldest';
      else if (sort === 'title') params.sort = 'title';

      const res = await API.get('/dokumen', { params });
      setDokumen(res.data.data || []);
      setPagination(res.data.pagination || { total: 0, totalPages: 0 });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const canPreview = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="page-container">
      {/* ====== HEADER ====== */}
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

      {/* ====== FILTER BAR ====== */}
      <section className="py-6 bg-gray-50 border-b sticky top-0 z-20">
        <div className="content-container">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
            {/* Kategori */}
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="select-field md:w-52"
            >
              <option value="">Semua Kategori</option>
              {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-field md:w-44"
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="title">Judul (A-Z)</option>
            </select>
          </div>
          {/* Result count */}
          {!loading && (
            <p className="text-xs text-gray-400 mt-3">
              Menampilkan {dokumen.length} dari {pagination.total} dokumen
              {debouncedSearch && <span> untuk "<strong className="text-gray-600">{debouncedSearch}</strong>"</span>}
            </p>
          )}
        </div>
      </section>

      {/* ====== DOCUMENT LIST ====== */}
      <section className="py-12">
        <div className="content-container">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : dokumen.length > 0 ? (
            <>
              <div className="space-y-4">
                {dokumen.map((doc, idx) => {
                  const fileInfo = getFileInfo(doc.file_path);
                  const FileIcon = fileInfo.icon;

                  return (
                    <div
                      key={doc.id}
                      className="card p-5 flex flex-col md:flex-row md:items-center gap-4 group
                                 hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5
                                 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      {/* Icon */}
                      <div className={`w-14 h-14 ${fileInfo.bg} rounded-xl flex items-center justify-center flex-shrink-0
                                       group-hover:scale-110 transition-transform duration-300`}>
                        <FileIcon className={`text-2xl ${fileInfo.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-primary-800 mb-1.5 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">
                          {doc.judul}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          {doc.kategori_nama && (
                            <span className="flex items-center gap-1"><FaFolder className="text-gray-300" /> {doc.kategori_nama}</span>
                          )}
                          {doc.tahun && <span>{doc.tahun}</span>}
                          <span className="flex items-center gap-1"><FaCalendarAlt className="text-gray-300" /> {formatDate(doc.created_at)}</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${fileInfo.bg} ${fileInfo.color}`}>
                            {fileInfo.label}
                          </span>
                          {doc.file_size && (
                            <span className="text-gray-400">{formatFileSize(doc.file_size)}</span>
                          )}
                        </div>
                        {doc.deskripsi && (
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{doc.deskripsi}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {canPreview(doc.file_path) && (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium
                                       border border-primary-200 text-primary-700 bg-primary-50
                                       hover:bg-primary-100 hover:border-primary-300
                                       transition-all duration-200"
                          >
                            <FaEye className="text-xs" /> Lihat
                          </button>
                        )}
                        <a
                          href={doc.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary btn-sm gap-2"
                          download
                        >
                          <FaDownload /> Unduh
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ====== PAGINATION ====== */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm
                               border border-gray-200 text-gray-500
                               hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700
                               disabled:opacity-40 disabled:cursor-not-allowed
                               transition-all duration-200"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>

                  {generatePageNumbers(page, pagination.totalPages).map((p, idx) => (
                    p === '...' ? (
                      <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                          page === p
                            ? 'bg-primary-800 text-white shadow-md shadow-primary-800/30'
                            : 'border border-gray-200 text-gray-600 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  ))}

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm
                               border border-gray-200 text-gray-500
                               hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700
                               disabled:opacity-40 disabled:cursor-not-allowed
                               transition-all duration-200"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaFileAlt className="text-4xl text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Tidak Ada Dokumen</h3>
              <p className="text-sm text-gray-400">
                {debouncedSearch
                  ? `Dokumen dengan kata kunci "${debouncedSearch}" tidak ditemukan.`
                  : 'Belum ada dokumen yang tersedia saat ini.'
                }
              </p>
              {(debouncedSearch || selectedKategori) && (
                <button onClick={() => { setSearch(''); setSelectedKategori(''); }}
                  className="mt-4 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors">
                  Reset filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ====== PDF PREVIEW MODAL ====== */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaFilePdf className="text-red-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-primary-800 text-sm truncate">{previewDoc.judul}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    {previewDoc.kategori_nama && <span>{previewDoc.kategori_nama}</span>}
                    {previewDoc.file_size && <span>· {formatFileSize(previewDoc.file_size)}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a href={previewDoc.file_path} target="_blank" rel="noopener noreferrer" download
                  className="btn-primary btn-sm gap-1.5">
                  <FaDownload className="text-xs" /> Unduh
                </a>
                <button onClick={() => setPreviewDoc(null)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500">
                  <FaTimes />
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <div className="flex-1 bg-gray-100">
              <iframe
                src={previewDoc.file_path}
                className="w-full h-full border-0"
                title={`Preview: ${previewDoc.judul}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====== HELPER: Generate page numbers with ellipsis ======
function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...', total);
  } else if (current >= total - 3) {
    pages.push(1, '...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, '...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...', total);
  }
  return pages;
}
