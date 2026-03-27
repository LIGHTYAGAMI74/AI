module.exports = function (req, res, next) {
  if (req.user?.type !== "superadmin") {
    return res.status(403).json({ msg: "Admin access only" });
  }
  next();
};