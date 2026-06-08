const Organisation = require("../../models/Organisation");

// POST /api/superadmin/organisations
const createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if organisation name already exists
    const existing = await Organisation.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "An organisation with this name already exists." });
    }

    const organisation = await Organisation.create({
      name: name.trim(),
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      message: "Organisation created successfully.",
      organisation,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create organisation.", error: error.message });
  }
};

// GET /api/superadmin/organisations
const getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Organisations fetched successfully.",
      count: organisations.length,
      organisations,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch organisations.", error: error.message });
  }
};

module.exports = { createOrganisation, getAllOrganisations };
