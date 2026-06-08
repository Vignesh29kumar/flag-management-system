const express = require("express");
const router = express.Router();

const { checkFlag, getOrganisations } = require("../../controllers/user/flagController");
const { validateCheckFlag } = require("../../validations/flagValidations");

// GET /api/user/organisations  — List all organisations (for dropdown)
router.get("/organisations", getOrganisations);

// POST /api/user/check-flag  — Check if a feature is enabled
router.post("/check-flag", validateCheckFlag, checkFlag);

module.exports = router;
