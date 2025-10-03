export const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
};
