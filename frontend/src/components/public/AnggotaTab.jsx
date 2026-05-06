import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaUsers, FaUser, FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

export default function AnggotaTab() {
  const [anggota, setAnggota] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDapil, setFilterDapil] = useState('');
  const [filterFraksi, setFilterFraksi] = useState('');

  useEffect(() => {
    fetchAnggota();
  }, []);

  useEffect(() => {
    let result = anggota;
    if (search) {
      result = result.filter(a =>
        a.nama.toLowerCase().includes(search.toLowerCase()) ||
        a.jabatan.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterDapil) {
      result = result.filter(a => a.dapil === filterDapil);
    }
    if (filterFraksi) {
      result = result.filter(a => a.fraksi === filterFraksi);
    }
    setFiltered(result);
  }, [search, filterDapil, filterFraksi, anggota]);

  const fetchAnggota = async () => {
    try {
      const res = await API.get('/anggota');
      const data = res.data.data || res.data || [];
      setAnggota(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const dapilList = [...new Set(anggota.map(a => a.dapil).filter(Boolean))];
  const fraksiList = [...new Set(anggota.map(a => a.fraksi).filter(Boolean))];

  // Separate pimpinan and anggota
  const pimpinan = filtered.filter(a => a.jabatan !== 'Anggota');
  const anggotaBiasa = filtered.filter(a => a.jabatan === 'Anggota');

  return (
    <div className="animate-fade-in">
      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama anggota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 w-full bg-gray-50 border-gray-200"
            />
          </div>
          <select
            value={filterDapil}
            onChange={(e) => setFilterDapil(e.target.value)}
            className="select-field md:w-48 bg-gray-50 border-gray-200"
          >
            <option value="">Semua Dapil</option>
            {dapilList.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <select
            value={filterFraksi}
            onChange={(e) => setFilterFraksi(e.target.value)}
            className="select-field md:w-56 bg-gray-50 border-gray-200"
          >
            <option value="">Semua Fraksi</option>
            {fraksiList.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="bg-transparent">
        {loading ? (
          <div className="py-12"><LoadingSpinner /></div>
        ) : (
          <>
            {/* Pimpinan DPRD */}
            {pimpinan.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-secondary-500 rounded-full" />
                  Pimpinan DPRD
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pimpinan.map((item) => (
                    <AnggotaCard key={item.id} data={item} isPimpinan />
                  ))}
                </div>
              </div>
            )}

            {/* Anggota */}
            {anggotaBiasa.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-primary-800 mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-primary-500 rounded-full" />
                  Anggota DPRD
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {anggotaBiasa.map((item) => (
                    <AnggotaCard key={item.id} data={item} />
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
                <FaUsers className="text-5xl mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Tidak ada anggota yang ditemukan.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnggotaCard({ data, isPimpinan = false }) {
  return (
    <div className={`card-hover bg-white rounded-xl overflow-hidden group border border-gray-100 ${isPimpinan ? 'ring-2 ring-secondary-200 shadow-md' : 'shadow-sm'}`}>
      <div className={`h-52 relative overflow-hidden ${isPimpinan ? 'bg-gradient-to-br from-primary-700 to-primary-900' : 'bg-gradient-to-br from-primary-100 to-primary-200'}`}>
        {data.foto ? (
          <img src={data.foto} alt={data.nama}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaUser className={`text-5xl ${isPimpinan ? 'text-primary-400' : 'text-primary-300'}`} />
          </div>
        )}
        {isPimpinan && (
          <div className="absolute top-3 right-3">
            <span className="badge-gold text-xs shadow-lg">Pimpinan</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-primary-800 text-sm mb-1 line-clamp-1" title={data.nama}>{data.nama}</h3>
        <p className="text-secondary-600 font-semibold text-xs mb-3">{data.jabatan}</p>
        <div className="space-y-1.5 text-xs text-gray-500">
          {data.fraksi && (
            <div className="flex items-center gap-2">
              <FaBriefcase className="text-gray-400 flex-shrink-0" />
              <span className="truncate" title={data.fraksi}>{data.fraksi}</span>
            </div>
          )}
          {data.dapil && (
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400 flex-shrink-0" />
              <span>{data.dapil}</span>
            </div>
          )}
          {data.daerah_pemilihan && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
              <span className="truncate" title={data.daerah_pemilihan}>{data.daerah_pemilihan}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
