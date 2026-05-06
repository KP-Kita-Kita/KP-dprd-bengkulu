import { Link } from 'react-router-dom';
import { FaLandmark, FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';

const quickLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Profil DPRD', path: '/profil' },
  { label: 'Berita & Kegiatan', path: '/berita' },
  { label: 'Agenda', path: '/agenda' },
  { label: 'Dokumen Publik', path: '/dokumen' },
  { label: 'Aspirasi', path: '/aspirasi' },
  { label: 'Kontak', path: '/kontak' },
];

const socialLinks = [
  { icon: FaFacebook, href: 'https://www.facebook.com/share/1BPWSg7aA2/', label: 'Facebook' },
  { icon: FaInstagram, href:'https://www.instagram.com/sekretariatdprdprovinsibkl', label: 'Instagram' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@sekretariatdprdprovbkl', label: 'Tiktok' },
  { icon: FaYoutube, href: 'https://youtube.com/@sekretariatdprdprovinsiben-h4w?si=7spckc-JFe0UuGGf', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-1 bg-gold-gradient" />

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="content-container relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center">
                <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <h3 className="font-bold text-lg">DPRD</h3>
                <p className="text-xs text-gray-400 tracking-wider uppercase">Provinsi Bengkulu</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Dewan Perwakilan Rakyat Daerah Provinsi Bengkulu — Lembaga legislatif yang berkomitmen
              mewujudkan aspirasi rakyat Bengkulu untuk kesejahteraan bersama.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center
                           hover:bg-secondary-500 transition-all duration-300 group"
                >
                  <social.icon className="text-gray-400 group-hover:text-white transition-colors" size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Tautan Cepat</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-secondary-400 text-sm transition-colors duration-200
                             hover:translate-x-1 inline-block transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <FaMapMarkerAlt className="text-secondary-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">Jl. Asahan No. 1, Padang Harapan, Gading Cempaka, Kota Bengkulu, Provinsi Bengkulu, 38221</span>
              </li>
              <li className="flex gap-3 text-sm">
                <FaPhone className="text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">+62-813-6051-648</span>
              </li>
              <li className="flex gap-3 text-sm">
                <FaEnvelope className="text-secondary-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">mediacenterdprd51@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Operating Hours */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Jam Operasional</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Senin - Jumat</span>
                <span className="text-white font-medium">07.30 - 16.15</span>
              </li>
              <li className="flex justify-between">
                <span>Sabtu - Minggu</span>
                <span className="text-red-400 font-medium">Tutup</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 relative z-10 bg-navy">
        <div className="content-container py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} DPRD Provinsi Bengkulu. Seluruh hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
