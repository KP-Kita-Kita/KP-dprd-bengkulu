import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaLandmark, FaChevronDown } from 'react-icons/fa';

const navLinks = [
  { label: 'Beranda', path: '/' },
  { label: 'Profil', path: '/profil' },
  { label: 'Anggota DPRD', path: '/anggota' },
  { label: 'Berita', path: '/berita' },
  { label: 'Agenda', path: '/agenda' },
  { label: 'Dokumen', path: '/dokumen' },
  { label: 'Aspirasi', path: '/aspirasi' },
  { label: 'Kontak', path: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-nav py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="content-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 ${
              scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
            }`}>
              <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
            </div>
            <div>
              <h1 className={`text-lg font-bold leading-tight transition-colors duration-300 ${
                scrolled ? 'text-primary-800' : 'text-white'
              }`}>
                DPRD
              </h1>
              <p className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${
                scrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                Provinsi Bengkulu
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? scrolled
                      ? 'text-primary-800 bg-primary-50'
                      : 'text-white bg-white/20'
                    : scrolled
                      ? 'text-gray-600 hover:text-primary-800 hover:bg-gray-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full ${
                    scrolled ? 'bg-secondary-500' : 'bg-white'
                  }`} />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
              scrolled
                ? 'text-primary-800 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-4 space-y-1 border border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-primary-800 text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
