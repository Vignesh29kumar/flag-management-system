const express = require("express");
const router = express.Router();

const { createFlag, getAllFlags, updateFlag, deleteFlag } = require("../../controllers/admin/flagController");
const { isOrgAdmin } = require("../../middlewares/authMiddleware");
const { validateCreateFlag, validateUpdateFlag } = require("../../validations/flagValidations");

// GET  /api/admin/flags  — List all flags for org
router.get("/flags", isOrgAdmin, getAllFlags);

// POST /api/admin/flags  — Create a new flag
router.post("/flags", isOrgAdmin, validateCreateFlag, createFlag);

// PATCH /api/admin/flags/:id  — Enable / Disable a flag
router.patch("/flags/:id", isOrgAdmin, validateUpdateFlag, updateFlag);

// DELETE /api/admin/flags/:id  — Delete a flag
router.delete("/flags/:id", isOrgAdmin, deleteFlag);

module.exports = router;
