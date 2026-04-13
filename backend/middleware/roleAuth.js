/**
 * Middleware untuk membatasi akses berdasarkan role user
 * Digunakan setelah authMiddleware
 * @param  {...string} allowedRoles - Role yang diizinkan (contoh: 'admin', 'dewan')
 */
const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Akses ditolak. Silakan login terlebih dahulu.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Anda tidak memiliki izin untuk mengakses fitur ini.' });
    }

    next();
  };
};

module.exports = roleAuth;
