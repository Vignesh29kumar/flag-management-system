// Feature key must be snake_case or kebab-case alphanumeric
const featureKeyRegex = /^[a-z0-9_-]+$/;

// Validate create feature flag
const validateCreateFlag = (req, res, next) => {
  const { featureKey } = req.body;

  if (!featureKey || featureKey.trim() === "") {
    return res.status(400).json({ message: "Feature key is required." });
  }

  if (!featureKeyRegex.test(featureKey.trim())) {
    return res
      .status(400)
      .json({ message: "Feature key must be lowercase alphanumeric with underscores or hyphens only." });
  }

  if (featureKey.trim().length > 100) {
    return res.status(400).json({ message: "Feature key must not exceed 100 characters." });
  }

  next();
};

// Validate update feature flag
const validateUpdateFlag = (req, res, next) => {
  const { isEnabled } = req.body;

  if (isEnabled === undefined || isEnabled === null) {
    return res.status(400).json({ message: "isEnabled field is required." });
  }

  if (typeof isEnabled !== "boolean") {
    return res.status(400).json({ message: "isEnabled must be a boolean value." });
  }

  next();
};

// Validate check feature flag (end user)
const validateCheckFlag = (req, res, next) => {
  const { featureKey, organisationId } = req.body;

  if (!featureKey || featureKey.trim() === "") {
    return res.status(400).json({ message: "Feature key is required." });
  }

  if (!organisationId) {
    return res.status(400).json({ message: "Organisation ID is required." });
  }

  next();
};

module.exports = { validateCreateFlag, validateUpdateFlag, validateCheckFlag };
