const BENGKULU_PROVINCE_ID = '17';
const BASE_URL = 'https://emsifa.github.io/api-wilayah-indonesia/api';

// Cache sederhana di memori
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 jam

const fetchWithCache = async (url) => {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Gagal mengambil data wilayah: ${response.statusText}`);
  const data = await response.json();

  cache.set(url, { data, timestamp: Date.now() });
  return data;
};

// GET /api/wilayah/kabupaten
exports.getKabupaten = async (req, res) => {
  try {
    const data = await fetchWithCache(`${BASE_URL}/regencies/${BENGKULU_PROVINCE_ID}.json`);
    res.json(data);
  } catch (error) {
    console.error('Get kabupaten error:', error);
    res.status(500).json({ message: 'Gagal mengambil data kabupaten/kota.' });
  }
};

// GET /api/wilayah/kecamatan/:kabId
exports.getKecamatan = async (req, res) => {
  try {
    const { kabId } = req.params;
    const data = await fetchWithCache(`${BASE_URL}/districts/${kabId}.json`);
    res.json(data);
  } catch (error) {
    console.error('Get kecamatan error:', error);
    res.status(500).json({ message: 'Gagal mengambil data kecamatan.' });
  }
};

// GET /api/wilayah/kelurahan/:kecId
exports.getKelurahan = async (req, res) => {
  try {
    const { kecId } = req.params;
    const data = await fetchWithCache(`${BASE_URL}/villages/${kecId}.json`);
    res.json(data);
  } catch (error) {
    console.error('Get kelurahan error:', error);
    res.status(500).json({ message: 'Gagal mengambil data kelurahan.' });
  }
};
