const BANNED_WORDS = [
  // Hewan/Kasar (Standard)
  'anjing', 'anjingg', 'anjg', 'anjrit', 'anjrot', 'anjir', 'anjer', 'asu',
  'babi', 'babii', 'monyet', 'kampret', 'kunyuk', 'celeng',

  // Hinaan/Kasar
  'bangsat', 'bangsatt', 'bajingan', 'bajinggan', 'brengsek', 'brengsekk',
  'keparat', 'sialan', 'bedebah', 'goblok', 'goblokk', 'goblog', 'tolol',
  'tololl', 'bodoh', 'bego', 'begoo', 'dungu', 'idiot', 'geblek', 'sinting',
  'sarap', 'gila', 'gembel',

  // Seksual/Organ/Kotor
  'kontol', 'kontoll', 'kntl', 'memek', 'mmk', 'tempik', 'puki', 'pukimak',
  'kimak', 'pantek', 'peler', 'zakar', 'penis', 'vagina', 'jembut', 'peju',
  'tetek', 'toket', 'nenen', 'pantat', 'ngentot', 'ngentodt', 'ngewe', 'ewe',
  'coly', 'coli', 'colmek', 'colay', 'masturbasi', 'cabul', 'mesum', 'porno',
  'bokep', 'hentai', 'seks', 'sex', 'sodomi', 'perkosa', 'pemerkosaan', 'zina',

  // Pekerjaan/Karakter Negatif
  'lonte', 'lonthe', 'perek', 'sundal', 'lacur', 'pelacur', 'pecun', 'jablay',
  'germo', 'mucikari', 'pelakor', 'pebinor', 'banci', 'bencong', 'homo',
  'lesbi', 'maho',

  // Bahasa Daerah (Jawa/Sunda/dll)
  'jancok', 'jancuk', 'dancok', 'dancuk', 'cuk', 'coeg', 'ndasmu', 'raimu',
  'matamu', 'cangkemu', 'cocote', 'gatelan',

  // Agama/Mistik Negatif
  'setan', 'iblis', 'dajjal',

  // Bahasa Inggris & Lainnya
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'tai', 'taii'
];

/**
 * Mengecek apakah teks mengandung kata terlarang
 * @param {string} text - Teks yang akan dicek
 * @returns {{ hasBadWords: boolean, foundWords: string[] }}
 */
const checkBadWords = (text) => {
  if (!text) return { hasBadWords: false, foundWords: [] };

  const lowerText = text.toLowerCase();
  const foundWords = BANNED_WORDS.filter(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });

  return {
    hasBadWords: foundWords.length > 0,
    foundWords
  };
};

/**
 * Middleware Express untuk filter kata kasar pada request body
 * @param {string[]} fields - Nama field yang akan dicek
 */
const wordFilterMiddleware = (fields = ['isi', 'nama']) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field]) {
        const result = checkBadWords(req.body[field]);
        if (result.hasBadWords) {
          return res.status(400).json({
            message: 'Aspirasi mengandung kata-kata yang tidak pantas. Mohon gunakan bahasa yang sopan dan santun.'
          });
        }
      }
    }
    next();
  };
};

module.exports = { checkBadWords, wordFilterMiddleware };
