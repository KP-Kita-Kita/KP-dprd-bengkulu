import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaLandmark, FaTachometerAlt, FaComments,
  FaSignOutAlt, FaBars, FaTimes, FaExternalLinkAlt
} from 'react-icons/fa';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard', path: '/dewan/dashboard', icon: FaTachometerAlt },
  { label: 'Aspirasi Saya', path: '/dewan/aspirasi', icon: FaComments },
];

export default function DewanSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/dewan/login');
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
          </div>
          <div className="animate-fade-in">
            <h2 className="font-bold text-white text-sm">Panel Dewan</h2>
            <p className="text-[10px] text-emerald-300">DPRD Prov. Bengkulu</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
              isActive(item.path)
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-emerald-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            <item.icon className={`text-base flex-shrink-0 ${
              isActive(item.path) ? 'text-yellow-400' : 'text-emerald-300 group-hover:text-yellow-400'
            }`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User info & actions */}
      <div className="p-3 border-t border-emerald-700/50 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-emerald-300
                   hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <FaExternalLinkAlt className="text-xs flex-shrink-0" />
          <span>Lihat Website</span>
        </Link>

        {user && (
          <div className="px-3 py-2">
            <p className="text-xs text-emerald-300 truncate">Login sebagai:</p>
            <p className="text-sm font-semibold text-white truncate">{user.nama_lengkap}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
        >
          <FaSignOutAlt className="flex-shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-emerald-800 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-bold text-sm">Panel Dewan</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-white/10 rounded-lg">
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-emerald-800 z-50 transform transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full bg-emerald-800 z-40 w-60">
        <SidebarContent />
      </aside>
    </>
  );
}
