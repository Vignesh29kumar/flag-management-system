const express = require("express");
const router = express.Router();

const { signup, login } = require("../../controllers/admin/authController");
const { validateAdminSignup, validateAdminLogin } = require("../../validations/adminValidations");

// POST /api/admin/signup
router.post("/signup", validateAdminSignup, signup);

// POST /api/admin/login
router.post("/login", validateAdminLogin, login);

module.exports = router;
