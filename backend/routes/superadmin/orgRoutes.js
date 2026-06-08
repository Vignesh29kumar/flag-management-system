const express = require("express");
const router = express.Router();

const { createOrganisation, getAllOrganisations } = require("../../controllers/superadmin/orgController");
const { isSuperAdmin } = require("../../middlewares/authMiddleware");
const { validateCreateOrg } = require("../../validations/orgValidations");

// POST /api/superadmin/organisations
router.post("/organisations", isSuperAdmin, validateCreateOrg, createOrganisation);

// GET /api/superadmin/organisations
router.get("/organisations", isSuperAdmin, getAllOrganisations);

module.exports = router;
