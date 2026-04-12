import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public Pages
import Beranda from './pages/public/Beranda';
import Profil from './pages/public/Profil';
import AnggotaDPRD from './pages/public/AnggotaDPRD';
import Berita from './pages/public/Berita';
import DetailBerita from './pages/public/DetailBerita';
import Dokumen from './pages/public/Dokumen';
import Aspirasi from './pages/public/Aspirasi';
import Kontak from './pages/public/Kontak';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManajemenBerita from './pages/admin/ManajemenBerita';
import ManajemenAnggota from './pages/admin/ManajemenAnggota';
import ManajemenDokumen from './pages/admin/ManajemenDokumen';
import ManajemenAspirasi from './pages/admin/ManajemenAspirasi';

// Public Layout wrapper
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Admin Route protection
const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-60 transition-all duration-300 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/anggota" element={<AnggotaDPRD />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<DetailBerita />} />
        <Route path="/dokumen" element={<Dokumen />} />
        <Route path="/aspirasi" element={<Aspirasi />} />
        <Route path="/kontak" element={<Kontak />} />
      </Route>

      {/* Admin Auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Pages (Protected) */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/berita" element={<ManajemenBerita />} />
        <Route path="/admin/anggota" element={<ManajemenAnggota />} />
        <Route path="/admin/dokumen" element={<ManajemenDokumen />} />
        <Route path="/admin/aspirasi" element={<ManajemenAspirasi />} />
      </Route>

      {/* 404 Not Found Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
