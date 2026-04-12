import { useState, useEffect } from 'react';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaLandmark, FaBullseye, FaListUl, FaSitemap, FaHistory } from 'react-icons/fa';

export default function Profil() {
  const [profil, setProfil] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sejarah');

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const res = await API.get('/profil');
      const data = {};
      (res.data.data || res.data || []).forEach(item => {
        data[item.key] = item.value;
      });
      setProfil(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'sejarah', label: 'Sejarah', icon: FaHistory },
    { id: 'visi-misi', label: 'Visi & Misi', icon: FaBullseye },
    { id: 'struktur', label: 'Struktur', icon: FaSitemap },
  ];

  if (loading) return <div className="page-container"><LoadingSpinner /></div>;

  return (
    <div className="page-container">
      {/* Header */}
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaLandmark className="text-secondary-400" />
              <span>Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil DPRD</h1>
            <p className="text-white/70 text-lg">
              Mengenal lebih dekat Dewan Perwakilan Rakyat Daerah Provinsi Bengkulu.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="content-container">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 bg-gray-50 p-2 rounded-2xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-800 shadow-md'
                    : 'text-gray-500 hover:text-primary-800 hover:bg-white/50'
                }`}
              >
                <tab.icon />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'sejarah' && (
              <div className="card p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FaHistory className="text-xl text-primary-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-800">Sejarah DPRD Provinsi Bengkulu</h2>
                </div>
                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                  {profil.sejarah?.split('\n').map((p, i) => (
                    <p key={i} className="mb-4">{p}</p>
                  )) || <p>Data sejarah belum tersedia.</p>}
                </div>
              </div>
            )}

            {activeTab === 'visi-misi' && (
              <div className="space-y-8">
                <div className="card p-8 md:p-12 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <FaBullseye className="text-xl text-secondary-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Visi</h2>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed italic">
                    "{profil.visi || 'Data visi belum tersedia.'}"
                  </p>
                </div>

                <div className="card p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                      <FaListUl className="text-xl text-primary-800" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-800">Misi</h2>
                  </div>
                  <div className="space-y-4">
                    {profil.misi?.split('\n').map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors duration-200">
                        <div className="w-8 h-8 bg-primary-800 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{item.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    )) || <p className="text-gray-500">Data misi belum tersedia.</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'struktur' && (
              <div className="card p-8 md:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <FaSitemap className="text-xl text-primary-800" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-800">Struktur Organisasi</h2>
                </div>
                <div className="space-y-4">
                  {profil.struktur_organisasi?.split('\n').map((item, idx) => {
                    const parts = item.split(':');
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 p-5 rounded-xl bg-gray-50 border-l-4 border-primary-800 hover:bg-primary-50 transition-colors duration-200">
                        <span className="font-semibold text-primary-800 sm:w-48 flex-shrink-0">{parts[0]?.trim()}</span>
                        <span className="text-gray-600">{parts[1]?.trim()}</span>
                      </div>
                    );
                  }) || <p className="text-gray-500">Data struktur organisasi belum tersedia.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
