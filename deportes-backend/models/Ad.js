const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const adSchema = new mongoose.Schema({
  title: {type: String, required: true },
  imageUrl: {type: String, required: true },
  link: {type: String },
  isActive: {type: Boolean, default: true },
  startDate: {type: Date, default: null  },
  endDate: {type: Date, default: null  },
  targetRoles: {type: [String], enum: Object.values(ROLES), default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);