const BANNED_WORDS = [
  'anjing', 'babi', 'bangsat', 'bajingan', 'brengsek', 'keparat',
  'tolol', 'bodoh', 'goblok', 'idiot', 'dungu',
  'sialan', 'bedebah', 'kampret', 'monyet', 'setan',
  'bego', 'perek', 'lonte', 'sundal', 'lacur',
  'tai', 'kontol', 'memek', 'ngentot', 'jancok'
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
