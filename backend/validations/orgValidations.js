// Validate create organisation request body
const validateCreateOrg = (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Organisation name is required." });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({ message: "Organisation name must be at least 2 characters." });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({ message: "Organisation name must not exceed 100 characters." });
  }

  next();
};

module.exports = { validateCreateOrg };
