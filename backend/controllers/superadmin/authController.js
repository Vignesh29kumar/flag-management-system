const jwt = require("jsonwebtoken");

// Super admin credentials come from environment variables (static)
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

// Generate a JWT for super admin
const generateSuperAdminToken = () => {
  return jwt.sign(
    { role: "super_admin", email: SUPER_ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

// POST /api/superadmin/login
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== SUPER_ADMIN_EMAIL || password !== SUPER_ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid super admin credentials." });
    }

    const token = generateSuperAdminToken();

    res.status(200).json({
      message: "Super admin logged in successfully.",
      token,
      role: "super_admin",
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

module.exports = { login };
