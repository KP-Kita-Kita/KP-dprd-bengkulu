const bcrypt = require('bcryptjs');
const { pool } = require('./config/db');

const args = process.argv.slice(2);

if (args.length < 4) {
  console.log('\n❌ ERROR: Parameter tidak lengkap!');
  console.log('Cara Menggunakan:');
  console.log('node create_dewan.js <username> <password> <nama_lengkap> <anggota_id>');
  console.log('\nContoh:');
  console.log('node create_dewan.js "bapak_dewan1" "rahasia123" "Bpk. Anggota Dewan" 1\n');
  process.exit(1);
}

const [username, password, nama_lengkap, anggotaIdString] = args;
const anggota_id = parseInt(anggotaIdString, 10);

const createDewan = async () => {
    try {
        console.log(`\n⏳ Sedang memproses pembuatan akun untuk: ${username}...`);

        // 1. Cek apakah username sudah ada
        const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            console.log('❌ Gagal: Username tersebut sudah digunakan!');
            process.exit(1);
        }

        // 2. Cek apakah anggota_id valid dan ada di tabel anggota
        const [existingAnggota] = await pool.query('SELECT nama FROM anggota WHERE id = ?', [anggota_id]);
        if (existingAnggota.length === 0) {
            console.log(`❌ Gagal: Anggota dengan ID ${anggota_id} tidak ditemukan di database!`);
            console.log('💡 Tips: Buka tabel "anggota" di HeidiSQL untuk melihat daftar ID yang tersedia.');
            process.exit(1);
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Masukkan ke database
        await pool.query(
            'INSERT INTO users (username, password, nama_lengkap, role, anggota_id) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nama_lengkap, 'dewan', anggota_id]
        );

        console.log('\n======================================================');
        console.log('✅ SUKSES! Akun Dewan berhasil ditambahkan ke database.');
        console.log('======================================================');
        console.log(`Username     : ${username}`);
        console.log(`Password     : ${password}`);
        console.log(`Nama Lengkap : ${nama_lengkap}`);
        console.log(`Role         : dewan`);
        console.log(`Anggota Terhubung : ${existingAnggota[0].nama} (ID: ${anggota_id})`);
        console.log('======================================================\n');
        
    } catch (error) {
        console.error('\n❌ Terjadi kesalahan:', error.message);
    } finally {
        process.exit(0);
    }
};

createDewan();
