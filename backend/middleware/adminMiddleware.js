

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    res.status(403).json({
      success: false,
      error: "Access denied. Admins only.",
    });
  }
};
