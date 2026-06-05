# 🏛️ Website DPRD Provinsi Bengkulu

Aplikasi web portal resmi Dewan Perwakilan Rakyat Daerah (DPRD) Provinsi Bengkulu yang mengintegrasikan halaman informasi publik, publikasi dokumen kedewanan, agenda kerja legislatif, serta sistem penyaluran aspirasi masyarakat berbasis wilayah pemilihan (Dapil).

Aplikasi ini menggunakan arsitektur **Client-Server** dengan memisahkan bagian Frontend (React) dan Backend (Node.js/Express) secara modular.

---

## 🛠️ Tech Stack & Dependencies

### **1. Backend (API Server)**
* **Runtime**: Node.js (v18+)
* **Framework**: Express.js
* **Database**: MySQL / MariaDB (melalui package `mysql2/promise` dengan koneksi pool)
* **Autentikasi**: JSON Web Token (JWT) & `bcryptjs` untuk enkripsi password
* **File Uploader**: Multer (untuk upload foto anggota, lampiran aspirasi, berita, dan dokumen)
* **Dokumentasi & Export**: `exceljs` untuk rekapitulasi data

### **2. Frontend (Client)**
* **Build Tool & Bundler**: Vite (React JS)
* **Styling**: Tailwind CSS
* **Routing**: React Router Dom
* **Calendar Integration**: FullCalendar Suite (DayGrid, TimeGrid, Interaction)
* **Icons**: React Icons (Fa, Hi, Md, dll.)
* **HTTP Client**: Axios dengan interceptors untuk manajemen token JWT secara otomatis

---

## 📁 Struktur Folder Utama

```text
KP-dprd-bengkulu-main/
├── backend/                  # REST API Server (Node.js + Express)
│   ├── config/               # Konfigurasi database & inisialisasi tabel
│   ├── controllers/          # Kontrol logika bisnis API
│   ├── middleware/           # Autentikasi JWT & filter validasi
│   ├── routes/               # Routing endpoint API
│   ├── uploads/              # Penyimpanan file (berita, dokumen, foto)
│   ├── .env                  # Environment variables backend
│   ├── db.sql                # Dump database struktur & contoh data awal
│   ├── create_dewan.js       # Script CLI untuk menambahkan akun dewan
│   └── server.js             # Titik masuk utama (entrypoint) backend
│
├── frontend/                 # Client Application (React + Vite)
│   ├── public/               # Asset statik publik
│   ├── src/                  # Kode sumber frontend
│   │   ├── api/              # Konfigurasi Axios & base URL
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar, dll.)
│   │   ├── context/          # Context API untuk global state (AuthContext)
│   │   ├── pages/            # Halaman admin & halaman publik
│   │   ├── App.jsx           # Routing & layout utama
│   │   └── main.jsx          # Entrypoint React
│   ├── tailwind.config.js    # Konfigurasi utility framework Tailwind CSS
│   └── vite.config.js        # Konfigurasi Vite & proxy server
```

---

## ✨ Fitur Utama

1. **Sistem Aspirasi Publik Berbasis Wilayah**:
   * Masyarakat dapat mengirimkan aspirasi lengkap dengan data wilayah (Kabupaten, Kecamatan, Kelurahan) dan file lampiran.
   * Aspirasi otomatis dipetakan ke Dapil terkait dan diteruskan langsung ke dashboard Anggota Dewan yang mewakili Dapil tersebut.
2. **Dashboard Multi-Role (Admin & Dewan)**:
   * **Admin**: Mengelola berita, dokumen publik, profil DPRD, agenda kerja, dan master data anggota/Dapil.
   * **Dewan**: Dashboard khusus untuk membaca aspirasi dari konstituen di Dapil-nya masing-masing serta memperbarui status tindak lanjut.
3. **Agenda & Masa Sidang Terintegrasi**:
   * Kalender interaktif menggunakan FullCalendar untuk menampilkan agenda rapat paripurna, rapat dengar pendapat (RDP), kunker, maupun masa reses.
4. **Manajemen Dokumen Publik**:
   * Upload dan pengarsipan Perda, Keputusan DPRD, Laporan, Risalah Rapat, dll. lengkap dengan filter pencarian tahun dan kategori.
