const jwt = require("jsonwebtoken");

// Verify JWT token and attach decoded payload to req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Only super admin can access
const isSuperAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Access denied. Super Admin only." });
    }
    next();
  });
};

// Only org admin can access
const isOrgAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== "org_admin") {
      return res.status(403).json({ message: "Access denied. Org Admin only." });
    }
    next();
  });
};

module.exports = { verifyToken, isSuperAdmin, isOrgAdmin };
