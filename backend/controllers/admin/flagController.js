const FeatureFlag = require("../../models/FeatureFlag");
const Organisation = require("../../models/Organisation");

// POST /api/admin/flags  — Create a new feature flag
const createFlag = async (req, res) => {
  try {
    const { featureKey, description } = req.body;
    const organisationId = req.user.organisationId;
    const adminId = req.user.id;

    // Check organisation is active
    const org = await Organisation.findById(organisationId);
    if (!org || !org.isActive) {
      return res.status(403).json({ message: "Organisation is inactive. Contact super admin." });
    }

    // Check for duplicate key within same organisation
    const existing = await FeatureFlag.findOne({
      featureKey: featureKey.trim().toLowerCase(),
      organisation: organisationId,
    });

    if (existing) {
      return res.status(409).json({
        message: `Feature flag "${featureKey}" already exists in your organisation.`,
      });
    }

    const flag = await FeatureFlag.create({
      featureKey: featureKey.trim().toLowerCase(),
      description: description ? description.trim() : "",
      isEnabled: false,
      organisation: organisationId,
      createdBy: adminId,
    });

    res.status(201).json({
      message: "Feature flag created successfully.",
      flag,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create feature flag.", error: error.message });
  }
};

// GET /api/admin/flags  — Get all flags for the admin's organisation
const getAllFlags = async (req, res) => {
  try {
    const organisationId = req.user.organisationId;

    const flags = await FeatureFlag.find({ organisation: organisationId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Feature flags fetched successfully.",
      count: flags.length,
      flags,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feature flags.", error: error.message });
  }
};

// PATCH /api/admin/flags/:id  — Enable or disable a flag
const updateFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEnabled } = req.body;
    const organisationId = req.user.organisationId;

    // Ensure the flag belongs to the admin's organisation
    const flag = await FeatureFlag.findOne({ _id: id, organisation: organisationId });
    if (!flag) {
      return res.status(404).json({ message: "Feature flag not found." });
    }

    flag.isEnabled = isEnabled;
    await flag.save();

    res.status(200).json({
      message: `Feature flag "${flag.featureKey}" has been ${isEnabled ? "enabled" : "disabled"}.`,
      flag,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update feature flag.", error: error.message });
  }
};

// DELETE /api/admin/flags/:id  — Delete a flag
const deleteFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const organisationId = req.user.organisationId;

    // Ensure the flag belongs to the admin's organisation
    const flag = await FeatureFlag.findOne({ _id: id, organisation: organisationId });
    if (!flag) {
      return res.status(404).json({ message: "Feature flag not found." });
    }

    await flag.deleteOne();

    res.status(200).json({ message: `Feature flag "${flag.featureKey}" deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete feature flag.", error: error.message });
  }
};

module.exports = { createFlag, getAllFlags, updateFlag, deleteFlag };
