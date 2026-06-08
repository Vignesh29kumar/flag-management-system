const express = require("express");
const router = express.Router();

const { login } = require("../../controllers/superadmin/authController");
const { validateSuperAdminLogin } = require("../../validations/superAdminValidations");

// POST /api/superadmin/login
router.post("/login", validateSuperAdminLogin, login);

module.exports = router;
