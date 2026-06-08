const FeatureFlag = require("../../models/FeatureFlag");
const Organisation = require("../../models/Organisation");

// POST /api/user/check-flag  — Check if a feature flag is enabled for a given organisation
const checkFlag = async (req, res) => {
  try {
    const { featureKey, organisationId } = req.body;

    // Verify the organisation exists
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found." });
    }

    // Find the feature flag
    const flag = await FeatureFlag.findOne({
      featureKey: featureKey.trim().toLowerCase(),
      organisation: organisationId,
    });

    if (!flag) {
      return res.status(200).json({
        featureKey: featureKey.trim().toLowerCase(),
        organisation: organisation.name,
        isEnabled: false,
        message: `Feature "${featureKey}" does not exist for organisation "${organisation.name}".`,
        exists: false,
      });
    }

    res.status(200).json({
      featureKey: flag.featureKey,
      organisation: organisation.name,
      isEnabled: flag.isEnabled,
      message: `Feature "${flag.featureKey}" is ${flag.isEnabled ? "ENABLED" : "DISABLED"} for organisation "${organisation.name}".`,
      exists: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to check feature flag.", error: error.message });
  }
};

// GET /api/user/organisations  — Get all organisations for the dropdown
const getOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.find({ isActive: true }, "name _id").sort({ name: 1 });
    res.status(200).json({ organisations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organisations.", error: error.message });
  }
};

module.exports = { checkFlag, getOrganisations };
