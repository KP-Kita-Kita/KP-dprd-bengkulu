# 🏛️ Website DPRD Provinsi Bengkulu

Portal resmi Dewan Perwakilan Rakyat Daerah (DPRD) Provinsi Bengkulu — menyediakan informasi publik, publikasi dokumen legislatif, agenda kerja, serta sistem penyaluran aspirasi masyarakat berbasis wilayah pemilihan (Dapil).

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MySQL / MariaDB
- **Autentikasi**: JSON Web Token (JWT)
- **File Upload**: Multer
- **Export Data**: ExcelJS

### Frontend
- **Build Tool**: Vite + React
- **Styling**: Tailwind CSS
- **Routing**: React Router Dom
- **Kalender**: FullCalendar (DayGrid, TimeGrid, Interaction)
- **Icons**: React Icons
- **HTTP Client**: Axios (dengan JWT interceptor otomatis)

---

## 📁 Struktur Proyek

```
KP-dprd-bengkulu-main/
├── backend/
│   ├── config/           # Konfigurasi database & inisialisasi tabel
│   ├── controllers/      # Logika bisnis API
│   ├── middleware/        # Autentikasi & validasi
│   ├── routes/           # Endpoint API
│   ├── uploads/          # Penyimpanan file (berita, dokumen, foto)
│   ├── .env.example      # Template environment variables
│   ├── db.sql            # Skema & data awal database
│   ├── create_dewan.js   # Script CLI pembuatan akun dewan
│   └── server.js         # Entrypoint backend
│
└── frontend/
    ├── public/
    └── src/
        ├── api/          # Konfigurasi Axios & base URL
        ├── components/   # Komponen UI (Navbar, Sidebar, dll.)
        ├── context/      # Global state (AuthContext)
        ├── pages/        # Halaman admin & publik
        ├── App.jsx
        └── main.jsx
```

---

## ✨ Fitur Utama

**Aspirasi Publik Berbasis Dapil**
Masyarakat dapat mengirim aspirasi lengkap dengan data wilayah (Kabupaten/Kecamatan/Kelurahan) dan lampiran file. Aspirasi secara otomatis dipetakan ke Dapil dan diteruskan ke dashboard anggota dewan yang bersangkutan.

**Dashboard Multi-Role**
- **Admin** — Mengelola berita, dokumen, profil DPRD, agenda, dan master data anggota/Dapil.
- **Dewan** — Membaca aspirasi konstituen di Dapil masing-masing dan memperbarui status tindak lanjut.

**Agenda & Kalender Sidang**
Kalender interaktif berbasis FullCalendar untuk rapat paripurna, RDP, kunker, dan masa reses.

**Manajemen Dokumen Publik**
Upload dan pengarsipan Perda, Keputusan DPRD, Laporan, Risalah Rapat, dengan filter tahun dan kategori.

