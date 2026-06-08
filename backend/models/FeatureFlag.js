const mongoose = require("mongoose");

const featureFlagSchema = new mongoose.Schema(
  {
    featureKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isEnabled: {
      type: Boolean,
      default: false,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// A feature key must be unique within an organisation
featureFlagSchema.index({ featureKey: 1, organisation: 1 }, { unique: true });

module.exports = mongoose.model("FeatureFlag", featureFlagSchema);
