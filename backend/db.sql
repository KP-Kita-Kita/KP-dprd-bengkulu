-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for dprd_bengkulu
DROP DATABASE IF EXISTS `dprd_bengkulu`;
CREATE DATABASE IF NOT EXISTS `dprd_bengkulu` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dprd_bengkulu`;

-- Dumping structure for table dprd_bengkulu.agenda
DROP TABLE IF EXISTS `agenda`;
CREATE TABLE IF NOT EXISTS `agenda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text,
  `waktu_mulai` datetime NOT NULL,
  `waktu_selesai` datetime NOT NULL,
  `lokasi` varchar(255) DEFAULT NULL,
  `kategori` enum('Agenda','Masa Sidang','Reses') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_streaming` varchar(500) DEFAULT NULL,
  `status` enum('Menunggu','Berlangsung','Selesai','Ditunda') DEFAULT 'Menunggu',
  `created_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `komisi` enum('Komisi I','Komisi II','Komisi III','Komisi IV') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.agenda: ~0 rows (approximately)
INSERT INTO `agenda` (`id`, `judul`, `deskripsi`, `waktu_mulai`, `waktu_selesai`, `lokasi`, `kategori`, `link_streaming`, `status`, `created_by`, `created_at`, `updated_at`, `komisi`) VALUES
	(1, 'Rapat Paripurna', 'Rapat Paripurna akan dilaksanakan hari ini.', '2026-04-13 09:00:00', '2026-04-13 12:00:00', 'Ruang Paripurna Gedung DPRD Provinsi Bengkulu', 'Masa Sidang', NULL, 'Menunggu', 1, '2026-04-13 08:16:25', '2026-04-13 09:50:07', 'Komisi IV'),
	(2, 'RDP', 'Pelaksanaan RDP', '2026-04-14 09:20:00', '2026-04-14 12:00:00', 'Ruang Rapat Paripurna Gedung DPRD Provinsi Bengkulu', 'Agenda', NULL, 'Menunggu', 1, '2026-04-13 08:22:07', '2026-04-13 09:49:52', 'Komisi III'),
	(3, 'Rapat Internal', 'Pelaksanaan Rapat Internal', '2026-04-23 08:22:00', '2026-04-23 12:22:00', 'Ruang Rapat Paripurna Gedung DPRD Provinsi Bengkulu', 'Agenda', NULL, 'Menunggu', 1, '2026-04-13 08:23:06', '2026-04-13 09:49:42', 'Komisi II'),
	(4, 'Rapat Kunker', 'Pelaksanaan Kunker', '2026-04-28 08:23:00', '2026-04-28 12:23:00', 'Ruang Rapat Paripurna Gedung DPRD Provinsi Bengkulu', 'Agenda', NULL, 'Menunggu', 1, '2026-04-13 08:23:47', '2026-04-13 09:49:35', 'Komisi I'),
	(5, 'Agenda', NULL, '2026-04-13 08:30:00', '2026-04-13 12:30:00', 'Ruang Rapat 1', 'Agenda', NULL, 'Berlangsung', 1, '2026-04-13 08:31:11', '2026-04-13 09:50:47', 'Komisi I');

-- Dumping structure for table dprd_bengkulu.anggota
DROP TABLE IF EXISTS `anggota`;
CREATE TABLE IF NOT EXISTS `anggota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `jabatan` varchar(100) DEFAULT NULL,
  `dapil` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `daerah_pemilihan` varchar(100) DEFAULT NULL,
  `fraksi` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `bio` text,
  `periode` varchar(20) DEFAULT '2024-2029',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.anggota: ~48 rows (approximately)
INSERT INTO `anggota` (`id`, `nama`, `jabatan`, `dapil`, `daerah_pemilihan`, `fraksi`, `foto`, `bio`, `periode`, `created_at`) VALUES
	(1, 'Drs. SUMARDI, MM', 'Ketua DPRD', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(2, 'SUPRISMAN', 'Wakil Ketua I', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(3, 'SONTI BAKARA', 'Wakil Ketua II', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi PDIP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(4, 'AGUS RIYADI', 'Wakil Ketua III', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(6, 'DWI RATNAWATI', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(7, 'SRI ASTUTI', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi PKS', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(8, 'H. SUHARTO, SE, M.BA', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(9, 'EDISON SIMBOLON', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi Demokrat', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(10, 'BAIDARI CITRA DEWI', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi Nasdem', '/uploads/anggota/1776067593664-32620589.jpeg', NULL, '2024-2029', '2026-04-13 02:06:00'),
	(11, 'USIN ABDISYAH P.SEMBIRING, SH', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi Hanura', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(12, 'TEUKU ZULKARNAIN', 'Anggota', 'Bengkulu 1', 'Kota Bengkulu', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(13, 'JUHAILI', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(14, 'SAMSIR ALAM', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(15, 'ROGER', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi PKB', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(16, 'BERLIAN UTAMA HARTA', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(17, 'SANTOSO', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi Hanura', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(18, 'H. IHSAN FAJRI, S.Sos, MM', 'Anggota', 'Bengkulu 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi PDIP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(19, 'M. ALI SAFTAINI', 'Anggota', 'Bengkulu 3', 'Mukomuko', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(20, 'NOVRI ARDIANTASARI', 'Anggota', 'Bengkulu 3', 'Mukomuko', 'Fraksi Hanura', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(21, 'ANDI SUHARY', 'Anggota', 'Bengkulu 3', 'Mukomuko', 'Fraksi PKS', '/uploads/anggota/1776067583774-97443032.jpg', NULL, '2024-2029', '2026-04-13 02:06:00'),
	(22, 'FITRI, SE', 'Anggota', 'Bengkulu 3', 'Mukomuko', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(23, 'SINTARA PUTRI UMARRO', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(24, 'ASWAR', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Demokrat', '/uploads/anggota/1776037344057-293876583.jpeg', NULL, '2024-2029', '2026-04-13 02:06:00'),
	(25, 'ARPANTONI', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi PKB', '/uploads/anggota/1776037330542-886122322.jpeg', NULL, '2024-2029', '2026-04-13 02:06:00'),
	(26, 'EPRIYA', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(27, 'ANITA ANDRIYANI', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi PDIP', '/uploads/anggota/1776037293701-860840559.jpeg', NULL, '2024-2029', '2026-04-13 02:06:00'),
	(28, 'ZULASMI OCTARINA, SE', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Nasdem', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(29, 'MAHDI HUSEN', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(30, 'EDY IRAWAN', 'Anggota', 'Bengkulu 4', 'Rejang Lebong-Lebong', 'Fraksi Demokrat', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(31, 'EDWAR SAMSI, S.IP, MM', 'Anggota', 'Bengkulu 5', 'Kepahiang', 'Fraksi PDIP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(32, 'Ir. DARMAWANSYAH, MT', 'Anggota', 'Bengkulu 5', 'Kepahiang', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(33, 'ZAINAL, S.Sos, M.Si', 'Anggota', 'Bengkulu 5', 'Kepahiang', 'Fraksi PKB', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(34, 'WINDRA PURNAWAN', 'Anggota', 'Bengkulu 5', 'Kepahiang', 'Fraksi Nasdem', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(35, 'SAMSU AMANAH, S.Sos, M.Si', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(36, 'M. ALFA MULYA', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi Nasdem', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(37, 'HIDAYAT', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(38, 'DARHAN', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi Demokrat', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(39, 'BARLI HALIM', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi PDIP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(40, 'SUSMANHADI', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(41, 'HERWIN SUBERHANI, SH, MH', 'Anggota', 'Bengkulu 6', 'Bengkulu Selatan-Kaur', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(42, 'JONAIDI, SP', 'Anggota', 'Bengkulu 7', 'Seluma', 'Fraksi Gerindra', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(43, 'MEGA SULASTRI, S.Sos', 'Anggota', 'Bengkulu 7', 'Seluma', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(44, 'HERWAN EFENDI', 'Anggota', 'Bengkulu 7', 'Seluma', 'Fraksi PPP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(45, 'SRIE REJEKI, SH', 'Anggota', 'Bengkulu 7', 'Seluma', 'Fraksi PDIP', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(46, 'BILLY DWITRATA SUNARDI, ST', 'Anggota', 'Bengkulu 7', 'Seluma', 'Fraksi PAN', NULL, NULL, '2024-2029', '2026-04-13 02:06:00'),
	(97, 'dewandap3', 'Anggota', 'Dapil 3', 'Mukomuko', 'Fraksi Gerinda', NULL, NULL, '2024-2029', '2026-04-13 01:29:49'),
	(98, 'dewandap2', 'Anggota', 'Dapil 2', 'Bengkulu Utara-Bengkulu Tengah', 'Fraksi Golkar', NULL, NULL, '2024-2029', '2026-04-13 01:28:41'),
	(99, 'dewan', 'Anggota', 'Dapil 1', 'Kota Bengkulu', 'Fraksi PPP', NULL, NULL, '2024-2029', '2026-04-13 00:33:19');

-- Dumping structure for table dprd_bengkulu.aspirasi
DROP TABLE IF EXISTS `aspirasi`;
CREATE TABLE IF NOT EXISTS `aspirasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT 'Anonim',
  `isi` text NOT NULL,
  `kategori` varchar(50) DEFAULT 'umum',
  `email` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'masuk',
  `catatan_admin` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `kabupaten_id` varchar(10) DEFAULT NULL,
  `kabupaten_nama` varchar(100) DEFAULT NULL,
  `kecamatan_id` varchar(10) DEFAULT NULL,
  `kecamatan_nama` varchar(100) DEFAULT NULL,
  `kelurahan_id` varchar(10) DEFAULT NULL,
  `kelurahan_nama` varchar(100) DEFAULT NULL,
  `lampiran` varchar(255) DEFAULT NULL,
  `dapil_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.aspirasi: ~8 rows (approximately)
INSERT INTO `aspirasi` (`id`, `nama`, `isi`, `kategori`, `email`, `status`, `catatan_admin`, `created_at`, `updated_at`, `kabupaten_id`, `kabupaten_nama`, `kecamatan_id`, `kecamatan_nama`, `kelurahan_id`, `kelurahan_nama`, `lampiran`, `dapil_id`) VALUES
	(1, 'Budi Santoso', 'Mohon diperhatikan kondisi jalan di Desa Tanjung Agung, Kabupaten Seluma yang sudah sangat rusak dan membahayakan pengendara.', 'infrastruktur', 'budi.s@email.com', 'selesai', NULL, '2026-04-07 19:03:17', '2026-04-09 08:23:20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(2, 'Siti Rahayu', 'Kami berharap puskesmas di kecamatan kami bisa mendapatkan tambahan tenaga medis, karena saat ini sangat kekurangan dokter.', 'kesehatan', 'siti.r@email.com', 'diproses', NULL, '2026-04-07 19:03:17', '2026-04-07 19:03:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(3, 'Anonim', 'Tolong awasi penggunaan anggaran dana desa di Kabupaten Lebong. Banyak proyek yang tidak sesuai dengan RAB.', 'pengawasan', NULL, 'ditolak', 'Pengawasan dilakukan oleh pihak yang berwewenang.', '2026-04-07 19:03:17', '2026-04-09 08:23:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(4, 'Ahmad Rizki', 'Mohon dibangun jembatan penyeberangan di depan SDN 5 Kota Bengkulu untuk keselamatan anak-anak sekolah.', 'infrastruktur', 'ahmad.r@email.com', 'selesai', NULL, '2026-04-07 19:03:17', '2026-04-07 19:03:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(5, 'Dewi Lestari', 'Saya mengapresiasi program beasiswa dari pemerintah provinsi. Namun, mohon kuota beasiswa ditambah untuk keluarga kurang mampu.', 'pendidikan', 'dewi.l@email.com', 'diproses', NULL, '2026-04-07 19:03:17', '2026-04-07 19:03:17', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(12, 'Primanda', 'test1', 'umum', NULL, 'ditolak', NULL, '2026-04-13 02:48:52', '2026-04-13 06:47:56', '1771', 'KOTA BENGKULU', '1771040', 'MUARA BANGKA HULU', '1771040001', 'BERINGIN RAYA', NULL, 1),
	(13, 'dtxet', 'rtdkur4dkuy', 'pendidikan', 'sre@gmail.com', 'diproses', NULL, '2026-04-13 15:12:55', '2026-04-13 15:13:46', '1771', 'KOTA BENGKULU', '1771020', 'GADING CEMPAKA', '1771020001', 'SIDO MULYO', '/uploads/aspirasi/1776067975596-407121108.jpeg', 1),
	(14, 'Primanda naff', 'cffc', 'umum', 'scgasg@gmail.com', 'pending', NULL, '2026-04-13 15:15:36', '2026-04-13 15:15:36', '1709', 'KABUPATEN BENGKULU TENGAH', '1709051', 'PONDOK KUBANG', '1709051008', 'PAKU HAJI', NULL, 2);

-- Dumping structure for table dprd_bengkulu.aspirasi_dewan
DROP TABLE IF EXISTS `aspirasi_dewan`;
CREATE TABLE IF NOT EXISTS `aspirasi_dewan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aspirasi_id` int NOT NULL,
  `anggota_id` int NOT NULL,
  `dibaca` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_aspirasi_anggota` (`aspirasi_id`,`anggota_id`),
  KEY `anggota_id` (`anggota_id`),
  CONSTRAINT `aspirasi_dewan_ibfk_1` FOREIGN KEY (`aspirasi_id`) REFERENCES `aspirasi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `aspirasi_dewan_ibfk_2` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.aspirasi_dewan: ~0 rows (approximately)
INSERT INTO `aspirasi_dewan` (`id`, `aspirasi_id`, `anggota_id`, `dibaca`, `created_at`) VALUES
	(5, 12, 1, 0, '2026-04-13 02:48:52'),
	(6, 12, 6, 0, '2026-04-13 02:48:52'),
	(7, 12, 7, 0, '2026-04-13 02:48:52'),
	(8, 12, 8, 0, '2026-04-13 02:48:52'),
	(9, 12, 9, 0, '2026-04-13 02:48:52'),
	(10, 12, 10, 0, '2026-04-13 02:48:52'),
	(11, 12, 11, 0, '2026-04-13 02:48:52'),
	(12, 12, 12, 0, '2026-04-13 02:48:52'),
	(13, 12, 99, 1, '2026-04-13 02:48:52'),
	(14, 13, 1, 0, '2026-04-13 15:12:55'),
	(15, 13, 6, 0, '2026-04-13 15:12:55'),
	(16, 13, 7, 0, '2026-04-13 15:12:55'),
	(17, 13, 8, 0, '2026-04-13 15:12:55'),
	(18, 13, 9, 0, '2026-04-13 15:12:55'),
	(19, 13, 10, 0, '2026-04-13 15:12:55'),
	(20, 13, 11, 0, '2026-04-13 15:12:55'),
	(21, 13, 12, 0, '2026-04-13 15:12:55'),
	(22, 13, 99, 0, '2026-04-13 15:12:55'),
	(23, 14, 3, 0, '2026-04-13 15:15:36'),
	(24, 14, 4, 0, '2026-04-13 15:15:36'),
	(25, 14, 13, 0, '2026-04-13 15:15:36'),
	(26, 14, 14, 0, '2026-04-13 15:15:36'),
	(27, 14, 15, 0, '2026-04-13 15:15:36'),
	(28, 14, 16, 0, '2026-04-13 15:15:36'),
	(29, 14, 17, 0, '2026-04-13 15:15:36'),
	(30, 14, 18, 0, '2026-04-13 15:15:36'),
	(31, 14, 98, 0, '2026-04-13 15:15:36');

-- Dumping structure for table dprd_bengkulu.berita
DROP TABLE IF EXISTS `berita`;
CREATE TABLE IF NOT EXISTS `berita` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `konten` text NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` varchar(50) DEFAULT 'umum',
  `author_id` int DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `berita_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.berita: ~7 rows (approximately)
INSERT INTO `berita` (`id`, `judul`, `konten`, `gambar`, `kategori`, `author_id`, `is_published`, `created_at`, `updated_at`) VALUES
	(1, 'DPRD Provinsi Bengkulu Gelar Rapat Paripurna Pembahasan RAPBD 2025', 'DPRD Provinsi Bengkulu menggelar Rapat Paripurna dalam rangka pembahasan Rancangan Anggaran Pendapatan dan Belanja Daerah (RAPBD) Tahun Anggaran 2025. Rapat yang dihadiri oleh seluruh anggota DPRD dan perwakilan Pemerintah Provinsi Bengkulu ini membahas berbagai aspek penting terkait alokasi anggaran untuk pembangunan daerah.\r\n\r\nKetua DPRD H. Muhammad Saleh menyampaikan bahwa pembahasan RAPBD ini harus mengutamakan kepentingan rakyat Bengkulu, khususnya dalam sektor pendidikan, kesehatan, dan infrastruktur. Beliau juga menekankan pentingnya transparansi dan akuntabilitas dalam pengelolaan keuangan daerah.\r\n\r\nRapat paripurna ini direncanakan akan berlangsung selama beberapa hari untuk memastikan setiap pos anggaran dibahas secara komprehensif.\r\n\r\nSelengkapnya: https://www.instagram.com/sekretariatdprdprovinsibkl/reel/DV-1DLDCa4l/', '/uploads/berita/1775566579800-968876653.jpeg', 'kegiatan', 1, 1, '2026-04-07 19:03:17', '2026-04-07 20:01:45'),
	(2, 'Komisi I DPRD Lakukan Kunjungan Kerja ke Kabupaten Seluma', 'Komisi I DPRD Provinsi Bengkulu melaksanakan kunjungan kerja ke Kabupaten Seluma dalam rangka meninjau pelaksanaan program pemerintah daerah di bidang hukum dan pemerintahan. Tim yang dipimpin oleh Ketua Komisi I Drs. Hendri Saputra melakukan pertemuan dengan jajaran pemerintah Kabupaten Seluma.\r\n\r\nDalam kunjungan ini, Komisi I menyoroti beberapa permasalahan yang dihadapi masyarakat setempat, termasuk pelayanan publik dan penegakan peraturan daerah. Anggota komisi juga menerima aspirasi langsung dari masyarakat melalui forum dialog yang diselenggarakan di Aula Kantor Bupati Seluma.\r\n\r\nHasil kunjungan kerja ini akan dijadikan bahan evaluasi dan rekomendasi untuk perbaikan pelayanan publik di Kabupaten Seluma.', '/uploads/berita/1775566758017-477145765.jpg', 'kegiatan', 1, 1, '2026-04-07 19:03:17', '2026-04-07 19:59:18'),
	(3, 'DPRD Bengkulu Dorong Percepatan Infrastruktur Jalan Trans-Bengkulu', 'DPRD Provinsi Bengkulu melalui Komisi III mendorong percepatan pembangunan infrastruktur jalan Trans-Bengkulu yang menghubungkan seluruh kabupaten/kota di Provinsi Bengkulu. Hal ini disampaikan dalam rapat kerja dengan Dinas Pekerjaan Umum dan Penataan Ruang Provinsi Bengkulu.\r\n\r\nDr. Rizal Firmansyah selaku anggota Komisi III menyatakan bahwa infrastruktur jalan merupakan urat nadi perekonomian masyarakat. "Kami berharap pemerintah provinsi dapat mengalokasikan anggaran yang memadai untuk perbaikan dan pembangunan jalan di seluruh wilayah Bengkulu," ujarnya.\r\n\r\nDPRD juga meminta agar proses pengadaan barang dan jasa terkait proyek infrastruktur dilaksanakan secara transparan dan akuntabel.', '/uploads/berita/1775566789168-672595761.jpg', 'umum', 1, 1, '2026-04-07 19:03:17', '2026-04-07 19:59:49'),
	(4, 'Reses Anggota DPRD: Mendengarkan Suara Rakyat Bengkulu', 'Anggota DPRD Provinsi Bengkulu memasuki masa reses untuk menyerap aspirasi masyarakat di masing-masing daerah pemilihan. Kegiatan reses ini merupakan amanat undang-undang yang mewajibkan setiap anggota legislatif untuk turun langsung ke masyarakat.\r\n\r\nSelama masa reses, para anggota DPRD mengunjungi berbagai desa dan kelurahan untuk mendengarkan langsung keluhan dan harapan masyarakat. Beberapa isu yang paling banyak disampaikan antara lain masalah pendidikan, kesehatan, bantuan sosial, dan infrastruktur.\r\n\r\nHj. Siti Aminah selaku Wakil Ketua I menyampaikan bahwa hasil reses akan diolah dan disampaikan kepada pemerintah provinsi sebagai bahan pertimbangan dalam penyusunan kebijakan dan program pembangunan.', '/uploads/berita/1775566564448-270904461.jpeg', 'kegiatan', 1, 1, '2026-04-07 19:03:17', '2026-04-07 19:56:04'),
	(5, 'Sosialisasi Peraturan Daerah Baru tentang Pengelolaan Lingkungan Hidup', 'DPRD Provinsi Bengkulu bersama Dinas Lingkungan Hidup dan Kehutanan mengadakan sosialisasi Peraturan Daerah terbaru tentang Pengelolaan Lingkungan Hidup dan Kehutanan. Acara ini dihadiri oleh perwakilan masyarakat, akademisi, dan pelaku usaha di Provinsi Bengkulu.\r\n\r\nPerda ini mengatur tentang pengelolaan sumber daya alam secara berkelanjutan, perlindungan kawasan hutan lindung, dan mekanisme pengawasan terhadap aktivitas yang berpotensi merusak lingkungan. DPRD berharap dengan adanya peraturan ini, kelestarian alam Bengkulu yang kaya akan keanekaragaman hayati dapat terjaga.\r\n\r\nMasyarakat diharapkan dapat berpartisipasi aktif dalam mengawasi implementasi peraturan daerah ini demi masa depan lingkungan yang lebih baik.', '/uploads/berita/1775566800075-459215836.jpg', 'umum', 1, 1, '2026-04-07 19:03:17', '2026-04-07 20:00:00'),
	(7, 'Judul berita', 'vnusafbihbsf', '/uploads/berita/1776064370480-268914907.jpeg', 'pengumuman', 1, 1, '2026-04-13 14:12:50', '2026-04-13 15:26:01');

-- Dumping structure for table dprd_bengkulu.dapil
DROP TABLE IF EXISTS `dapil`;
CREATE TABLE IF NOT EXISTS `dapil` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.dapil: ~7 rows (approximately)
INSERT INTO `dapil` (`id`, `nama`, `deskripsi`, `created_at`) VALUES
	(1, 'Bengkulu 1', 'Kota Bengkulu', '2026-04-12 23:16:32'),
	(2, 'Bengkulu 2', 'Kab. Bengkulu Utara & Kab. Bengkulu Tengah', '2026-04-12 23:16:32'),
	(3, 'Bengkulu 3', 'Kab. Mukomuko', '2026-04-12 23:16:32'),
	(4, 'Bengkulu 4', 'Kab. Rejang Lebong & Kab. Lebong', '2026-04-12 23:16:32'),
	(5, 'Bengkulu 5', 'Kab. Kepahiang', '2026-04-12 23:16:32'),
	(6, 'Bengkulu 6', 'Kab. Bengkulu Selatan & Kab. Kaur', '2026-04-12 23:16:32'),
	(7, 'Bengkulu 7', 'Kab. Seluma', '2026-04-12 23:16:32');

-- Dumping structure for table dprd_bengkulu.dapil_anggota
DROP TABLE IF EXISTS `dapil_anggota`;
CREATE TABLE IF NOT EXISTS `dapil_anggota` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dapil_id` int NOT NULL,
  `anggota_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_dapil_anggota` (`dapil_id`,`anggota_id`),
  KEY `anggota_id` (`anggota_id`),
  CONSTRAINT `dapil_anggota_ibfk_1` FOREIGN KEY (`dapil_id`) REFERENCES `dapil` (`id`) ON DELETE CASCADE,
  CONSTRAINT `dapil_anggota_ibfk_2` FOREIGN KEY (`anggota_id`) REFERENCES `anggota` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.dapil_anggota: ~0 rows (approximately)
INSERT INTO `dapil_anggota` (`id`, `dapil_id`, `anggota_id`) VALUES
	(21, 1, 1),
	(22, 1, 6),
	(25, 1, 7),
	(24, 1, 8),
	(23, 1, 9),
	(20, 1, 10),
	(27, 1, 11),
	(26, 1, 12),
	(19, 1, 99),
	(65, 2, 3),
	(66, 2, 4),
	(67, 2, 13),
	(68, 2, 14),
	(69, 2, 15),
	(70, 2, 16),
	(71, 2, 17),
	(72, 2, 18),
	(73, 2, 98),
	(74, 3, 19),
	(75, 3, 20),
	(76, 3, 21),
	(77, 3, 22),
	(78, 3, 97),
	(47, 4, 2),
	(46, 4, 23),
	(42, 4, 24),
	(41, 4, 25),
	(44, 4, 26),
	(40, 4, 27),
	(48, 4, 28),
	(45, 4, 29),
	(43, 4, 30),
	(49, 5, 31),
	(50, 5, 32),
	(52, 5, 33),
	(51, 5, 34),
	(58, 6, 35),
	(57, 6, 36),
	(56, 6, 37),
	(54, 6, 38),
	(53, 6, 39),
	(59, 6, 40),
	(55, 6, 41),
	(62, 7, 42),
	(63, 7, 43),
	(61, 7, 44),
	(64, 7, 45),
	(60, 7, 46);

-- Dumping structure for table dprd_bengkulu.dapil_wilayah
DROP TABLE IF EXISTS `dapil_wilayah`;
CREATE TABLE IF NOT EXISTS `dapil_wilayah` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dapil_id` int NOT NULL,
  `kabupaten_id` varchar(10) NOT NULL,
  `kabupaten_nama` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_kab` (`kabupaten_id`),
  KEY `dapil_id` (`dapil_id`),
  CONSTRAINT `dapil_wilayah_ibfk_1` FOREIGN KEY (`dapil_id`) REFERENCES `dapil` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.dapil_wilayah: ~10 rows (approximately)
INSERT INTO `dapil_wilayah` (`id`, `dapil_id`, `kabupaten_id`, `kabupaten_nama`) VALUES
	(1, 1, '1771', 'KOTA BENGKULU'),
	(2, 2, '1703', 'KABUPATEN BENGKULU UTARA'),
	(3, 2, '1709', 'KABUPATEN BENGKULU TENGAH'),
	(4, 3, '1706', 'KABUPATEN MUKOMUKO'),
	(5, 4, '1702', 'KABUPATEN REJANG LEBONG'),
	(6, 4, '1707', 'KABUPATEN LEBONG'),
	(7, 5, '1708', 'KABUPATEN KEPAHIANG'),
	(8, 6, '1701', 'KABUPATEN BENGKULU SELATAN'),
	(9, 6, '1704', 'KABUPATEN KAUR'),
	(10, 7, '1705', 'KABUPATEN SELUMA');

-- Dumping structure for table dprd_bengkulu.dokumen
DROP TABLE IF EXISTS `dokumen`;
CREATE TABLE IF NOT EXISTS `dokumen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text,
  `file_path` varchar(255) NOT NULL,
  `kategori_id` int DEFAULT NULL,
  `tahun` varchar(4) DEFAULT NULL,
  `uploaded_by` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `kategori_id` (`kategori_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `dokumen_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_dokumen` (`id`) ON DELETE SET NULL,
  CONSTRAINT `dokumen_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.dokumen: ~11 rows (approximately)
INSERT INTO `dokumen` (`id`, `judul`, `deskripsi`, `file_path`, `kategori_id`, `tahun`, `uploaded_by`, `created_at`) VALUES
	(1, 'Daftar Nama Anggota DPRD Provinsi Bengkulu Tahun 2024-2029', 'Berikut adalah daftar anggota DPRD Kota Bengkulu periode 2024-2029 yang dilantik pada Agustus 2024, berdasarkan data hasil pemilihan legislatif.', '/uploads/dokumen/1775564809463-477201675.pdf', 5, '2024', 2, '2026-04-07 19:26:49'),
	(3, 'Test dokumen Excel', 'Testing upload dokumen format .xlsx (excel)', '/uploads/dokumen/1776039594194-107004854.xlsx', 5, '2026', 1, '2026-04-13 07:19:54'),
	(4, 'Test dokumen Word', 'Testing upload dokumen format .docx (word)\r\n', '/uploads/dokumen/1776039739599-33859267.docx', 5, '2026', 1, '2026-04-13 07:22:19'),
	(5, 'aTest banyak dokumen', '', '/uploads/dokumen/1776039796684-140463017.pdf', 2, '2026', 1, '2026-04-13 07:23:16'),
	(6, 'fTest banyak dokumen', '', '/uploads/dokumen/1776039816081-329644024.pdf', 3, '2026', 1, '2026-04-13 07:23:36'),
	(7, 'eTest banyak dokumen', '', '/uploads/dokumen/1776039827753-558239934.pdf', 1, '2026', 1, '2026-04-13 07:23:47'),
	(8, 'dTest banyak dokumen', '', '/uploads/dokumen/1776039840204-619805129.pdf', 4, '2026', 1, '2026-04-13 07:24:00'),
	(9, 'bTest banyak dokumen', '', '/uploads/dokumen/1776039851966-847383354.pdf', 3, '2026', 1, '2026-04-13 07:24:11'),
	(10, 'gTest banyak dokumen', '', '/uploads/dokumen/1776039869307-128906656.pdf', 4, '2026', 1, '2026-04-13 07:24:29'),
	(11, 'cTest banyak dokumen', '', '/uploads/dokumen/1776039879343-274782985.pdf', 1, '2026', 1, '2026-04-13 07:24:39'),
	(12, 'dr4dtrth4', 'rarw', '/uploads/dokumen/1776067840767-142247201.pdf', 2, '2026', 1, '2026-04-13 15:10:40');

-- Dumping structure for table dprd_bengkulu.kategori_dokumen
DROP TABLE IF EXISTS `kategori_dokumen`;
CREATE TABLE IF NOT EXISTS `kategori_dokumen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.kategori_dokumen: ~5 rows (approximately)
INSERT INTO `kategori_dokumen` (`id`, `nama`, `deskripsi`) VALUES
	(1, 'Peraturan Daerah', 'Peraturan daerah yang telah disahkan'),
	(2, 'Keputusan DPRD', 'Keputusan-keputusan DPRD'),
	(3, 'Laporan', 'Laporan kinerja dan kegiatan'),
	(4, 'Risalah Rapat', 'Risalah rapat-rapat DPRD'),
	(5, 'Lainnya', 'Dokumen lainnya');

-- Dumping structure for table dprd_bengkulu.profil
DROP TABLE IF EXISTS `profil`;
CREATE TABLE IF NOT EXISTS `profil` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL,
  `value` text,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.profil: ~7 rows (approximately)
INSERT INTO `profil` (`id`, `key`, `value`, `updated_at`) VALUES
	(1, 'sejarah', 'Dewan Perwakilan Rakyat Daerah (DPRD) Provinsi Bengkulu merupakan lembaga perwakilan rakyat daerah yang berkedudukan sebagai unsur penyelenggara pemerintahan daerah Provinsi Bengkulu. DPRD Provinsi Bengkulu pertama kali dibentuk sejak Provinsi Bengkulu resmi menjadi provinsi tersendiri berdasarkan Undang-Undang Nomor 9 Tahun 1967. Sejak saat itu, DPRD Provinsi Bengkulu telah menjalankan fungsi legislasi, pengawasan, dan anggaran dalam rangka mewujudkan pemerintahan yang baik dan bersih di Provinsi Bengkulu. Seiring berjalannya waktu, DPRD terus berkembang dan beradaptasi dengan tuntutan demokrasi dan kebutuhan masyarakat Bengkulu yang semakin kompleks.', '2026-04-07 19:03:17'),
	(2, 'visi', 'Terwujudnya Lembaga Legislatif yang Profesional, Transparan, dan Akuntabel dalam Memperjuangkan Kepentingan Rakyat Bengkulu.', '2026-04-07 19:03:17'),
	(3, 'misi', '1. Meningkatkan kualitas legislasi yang berpihak pada kepentingan rakyat Bengkulu.\n2. Melaksanakan fungsi pengawasan secara efektif terhadap penyelenggaraan pemerintahan daerah.\n3. Mengoptimalkan fungsi anggaran untuk kesejahteraan masyarakat Bengkulu.\n4. Meningkatkan transparansi dan akuntabilitas kelembagaan DPRD.\n5. Memperkuat hubungan antara DPRD dengan masyarakat melalui aspirasi dan partisipasi publik.\n6. Mendorong tata kelola pemerintahan yang baik dan bersih di Provinsi Bengkulu.', '2026-04-07 19:03:17'),
	(4, 'alamat', 'Jl. Pembangunan No. 1, Kota Bengkulu, Provinsi Bengkulu, 38221', '2026-04-07 19:03:17'),
	(5, 'telepon', '(0736) 21234', '2026-04-07 19:03:17'),
	(6, 'email', 'sekretariat@dprd-bengkuluprov.go.id', '2026-04-07 19:03:17'),
	(7, 'struktur_organisasi', 'Ketua DPRD: H. Muhammad Saleh, S.H., M.H.\nWakil Ketua I: Hj. Siti Aminah, S.E., M.M.\nWakil Ketua II: Ir. Bambang Hermanto, M.Si.\nWakil Ketua III: Dr. Ahmad Fauzi, S.Pd., M.Pd.', '2026-04-07 19:03:17');

-- Dumping structure for table dprd_bengkulu.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `anggota_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table dprd_bengkulu.users: ~4 rows (approximately)
INSERT INTO `users` (`id`, `username`, `password`, `nama_lengkap`, `role`, `created_at`, `anggota_id`) VALUES
	(1, 'admin', '$2a$10$xc.KbK3YZyvgQjelKIBrAOUanZj536b.YcrS9/sRa3JPQA0yj442q', 'Administrator DPRD', 'admin', '2026-04-07 19:03:17', NULL),
	(2, 'adminn', '$2a$10$pSziV4LhU2axsbqUvsqac.672QZ7Z.3W6H/RbevD6lqUFmwaNYK8m', 'Administrator DPRD Prov', 'admin', '2026-04-07 19:18:22', NULL),
	(100, 'dewan', '$2a$10$/44LDat4RAt4P0wBbO2aoO0apUuB8Kocx6apzsOwFGPysPmTSjV5C', 'Dewan', 'dewan', '2026-04-13 00:49:01', 99),
	(101, 'dewandap2', '$2a$10$iNR7l09ZtQT9y7xtqRVwHu.T7GQEg2XRNjTQF86tvAikFFNEj2VF.', 'Dewan', 'dewan', '2026-04-13 01:30:41', 98),
	(102, 'dewandap3', '$2a$10$9JOh63EViKp0Sw3FQ0i7b.UacMin1uJmnTXUCwFT0fzch/h2tSfvW', 'Dewan', 'dewan', '2026-04-13 01:31:03', 97);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
