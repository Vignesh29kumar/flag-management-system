const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Organisation = require("../../models/Organisation");

// Generate JWT for org admin
const generateAdminToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      organisationId: user.organisation,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

// POST /api/admin/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, organisationId } = req.body;

    // Check if organisation exists
    const organisation = await Organisation.findById(organisationId);
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found." });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: "org_admin",
      organisation: organisationId,
    });

    const token = generateAdminToken(user);

    res.status(201).json({
      message: "Admin account created successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation: organisation.name,
        organisationId: organisation._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed.", error: error.message });
  }
};

// POST /api/admin/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and ensure they are an org_admin
    const user = await User.findOne({ email: email.toLowerCase(), role: "org_admin" }).populate(
      "organisation",
      "name _id"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateAdminToken(user);

    res.status(200).json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organisation: user.organisation.name,
        organisationId: user.organisation._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

module.exports = { signup, login };
