import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaLandmark, FaTachometerAlt, FaNewspaper, FaUsers, FaFileAlt,
  FaComments, FaSignOutAlt, FaBars, FaTimes, FaExternalLinkAlt
} from 'react-icons/fa';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
  { label: 'Berita', path: '/admin/berita', icon: FaNewspaper },
  { label: 'Anggota DPRD', path: '/admin/anggota', icon: FaUsers },
  { label: 'Dokumen', path: '/admin/dokumen', icon: FaFileAlt },
  { label: 'Aspirasi', path: '/admin/aspirasi', icon: FaComments },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-primary-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-white text-sm">Admin Panel</h2>
              <p className="text-[10px] text-primary-300">DPRD Prov. Bengkulu</p>
            </div>
          )}
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
                : 'text-primary-200 hover:bg-white/10 hover:text-white'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className={`text-base flex-shrink-0 ${
              isActive(item.path) ? 'text-secondary-400' : 'text-primary-300 group-hover:text-secondary-400'
            }`} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User info & actions */}
      <div className="p-3 border-t border-primary-700/50 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-300
                   hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <FaExternalLinkAlt className="text-xs flex-shrink-0" />
          {!collapsed && <span>Lihat Website</span>}
        </Link>

        {!collapsed && user && (
          <div className="px-3 py-2">
            <p className="text-xs text-primary-300 truncate">Login sebagai:</p>
            <p className="text-sm font-semibold text-white truncate">{user.nama_lengkap}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
        >
          <FaSignOutAlt className="flex-shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary-800 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/Logo_DRPD.png" alt="Logo DPRD" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-bold text-sm">Admin Panel</span>
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
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-primary-800 z-50 transform transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:block fixed top-0 left-0 h-full bg-primary-800 z-40 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-primary-700 rounded-full text-white
                   flex items-center justify-center text-xs hover:bg-primary-600 shadow-lg transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </aside>
    </>
  );
}
