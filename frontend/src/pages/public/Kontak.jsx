import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Kontak() {
  const contactInfo = [
    { icon: FaMapMarkerAlt, title: 'Alamat', content: 'Jl. Asahan No. 1, Padang Harapan, Gading Cempaka, Kota Bengkulu, Provinsi Bengkulu, 38221', color: 'bg-blue-50 text-blue-600' },
    { icon: FaPhone, title: 'Telepon', content: '+62-813-6051-648', color: 'bg-green-50 text-green-600' },
    { icon: FaEnvelope, title: 'Email', content: 'mediacenterdprd51@gmail.com', color: 'bg-amber-50 text-amber-600' },
    { icon: FaClock, title: 'Jam Operasional', content: 'Senin - Jumat: 07.30 - 16.15 WIB', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="page-container">
      <section className="page-header">
        <div className="content-container relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
              <FaPhone className="text-secondary-400" /><span>Hubungi Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontak</h1>
            <p className="text-white/70 text-lg">Hubungi Sekretariat DPRD Provinsi Bengkulu.</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-8">Informasi Kontak</h2>
              <div className="space-y-5">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="card p-5 flex items-start gap-4 hover:border-primary-200 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 text-sm mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-primary-800 mb-4">Media Sosial</h3>
                <div className="flex gap-3">
                  {[
                    { Icon: FaFacebook, href: 'https://www.facebook.com/share/1BPWSg7aA2/', label: 'Facebook' },
                    { Icon: FaInstagram, href: 'https://www.instagram.com/sekretariatdprdprovinsibkl', label: 'Instagram' },
                    { Icon: FaTiktok, href: 'https://www.tiktok.com/@sekretariatdprdprovbkl', label: 'Tiktok' },
                    { Icon: FaYoutube, href: 'https://youtube.com/@sekretariatdprdprovinsiben-h4w?si=7spckc-JFe0UuGGf', label: 'YouTube' }
                  ].map(({ Icon, href, label }, idx) => (
                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-800 hover:text-white transition-all duration-300">
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary-800 mb-8">Lokasi</h2>
              <div className="card overflow-hidden h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.1774091646616!2d102.2853635739953!3d-3.819882243642315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e36ba9cdc021833%3A0x199998c1c71585d1!2sDPRD%20Provinsi%20Bengkulu!5e1!3m2!1sid!2sid!4v1775486625651!5m2!1sid!2sid"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                  title="Lokasi DPRD Bengkulu"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
