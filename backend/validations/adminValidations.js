const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate admin signup
const validateAdminSignup = (req, res, next) => {
  const { name, email, password, organisationId } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required." });
  }

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  if (!organisationId) {
    return res.status(400).json({ message: "Organisation ID is required." });
  }

  next();
};

// Validate admin login
const validateAdminLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  next();
};

module.exports = { validateAdminSignup, validateAdminLogin };
