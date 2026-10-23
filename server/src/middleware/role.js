export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access denied. Administrative privileges are required to access this resource.'
    });
  }
  next();
};
