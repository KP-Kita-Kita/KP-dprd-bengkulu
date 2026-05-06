import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaLandmark, FaBullseye, FaListUl, FaSitemap, FaHistory, FaUsers } from 'react-icons/fa';
import AnggotaTab from '../../components/public/AnggotaTab';

export default function Profil() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'sejarah';

  const [profil, setProfil] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['sejarah', 'visi-misi', 'anggota'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

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
    { id: 'sejarah', label: 'Profil', icon: FaHistory },
    { id: 'visi-misi', label: 'Fungsi & Kedudukan', icon: FaBullseye },
    { id: 'anggota', label: 'Anggota Dewan', icon: FaUsers },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil DPRD Provinsi Bengkulu</h1>
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
              <div className="card p-8 md:p-12 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <FaHistory className="text-xl text-secondary-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Profil DPRD Provinsi Bengkulu</h2>
                  </div>
                <div className="space-y-4">
                    {profil.sejarah ? (
                      profil.sejarah.split('\n').map((p, i) => (
                        <div key={i} className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/90 leading-relaxed text-lg">{p}</p>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/90 leading-relaxed text-lg">
                            Dewan Perwakilan Rakyat Daerah (DPRD) Provinsi Bengkulu merupakan lembaga perwakilan rakyat daerah yang berkedudukan sebagai mitra sejajar Pemerintah Provinsi. Secara sederhana, DPRD adalah parlemen (legislatif) tingkat provinsi yang bertugas mengawal jalannya roda pemerintahan.
                          </p>
                        </div>
                        <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10">
                          <p className="text-white/90 leading-relaxed text-lg">
                            Dengan membawa amanah langsung dari rakyat, kami berdedikasi untuk menjalankan tiga fungsi utama: merumuskan Peraturan Daerah (Legislasi), menetapkan Anggaran Daerah (Budgeting), serta mengawasi kinerja pemerintahan (Pengawasan), guna mewujudkan Provinsi Bengkulu yang lebih baik.
                          </p>
                        </div>
                      </div>
                    )}
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
                    <h2 className="text-2xl font-bold">Fungsi</h2>
                  </div>
                  <div className="space-y-4 mt-2">
                    {profil.visi?.split('\n').map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <div className="w-8 h-8 bg-secondary-400 text-primary-900 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-white/90 leading-relaxed">{item.replace(/^\d+\.\s*/, '')}</p>
                      </div>
                    )) || (
                      <>
                        <div className="flex gap-4 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                          <div className="w-8 h-8 bg-secondary-400 text-primary-900 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                          <p className="text-white/90 leading-relaxed"><strong className="text-white font-semibold">Fungsi Legislasi:</strong> Membentuk Peraturan Daerah (Perda) bersama Gubernur yang solutif dan berpihak pada kepentingan rakyat Bengkulu.</p>
                        </div>
                        <div className="flex gap-4 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                          <div className="w-8 h-8 bg-secondary-400 text-primary-900 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                          <p className="text-white/90 leading-relaxed"><strong className="text-white font-semibold">Fungsi Anggaran (Budgeting):</strong> Membahas, memberikan persetujuan, dan menetapkan Anggaran Pendapatan dan Belanja Daerah (APBD) secara transparan untuk pembangunan daerah.</p>
                        </div>
                        <div className="flex gap-4 items-start bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                          <div className="w-8 h-8 bg-secondary-400 text-primary-900 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                          <p className="text-white/90 leading-relaxed"><strong className="text-white font-semibold">Fungsi Pengawasan (Control):</strong> Mengawasi pelaksanaan Peraturan Daerah, APBD, serta kebijakan Pemerintah Provinsi demi terciptanya pemerintahan yang bersih dan akuntabel.</p>
                        </div>
                      </>
                    )}
                  </div>                </div>

                <div className="card p-8 md:p-12 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <FaListUl className="text-xl text-secondary-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Kedudukan</h2>
                  </div>
                  <div className="space-y-4">
                    {profil.misi ? (
                      profil.misi.split('\n').map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-200">
                          <p className="text-white/90 leading-relaxed text-lg">{item}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-4 items-start bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors duration-200">
                        <p className="text-white/90 leading-relaxed text-lg">
                          DPRD Provinsi Bengkulu berkedudukan sebagai unsur penyelenggara pemerintahan daerah yang menjadi mitra sejajar dengan Pemerintah Provinsi (Gubernur). Hubungan kemitraan ini bersifat saling mendukung dan mengimbangi (check and balances) guna merumuskan kebijakan terbaik demi kesejahteraan dan kemajuan seluruh masyarakat Provinsi Bengkulu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


            {activeTab === 'anggota' && (
              <AnggotaTab />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


