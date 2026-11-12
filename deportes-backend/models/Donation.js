const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema({
  athlete: { type: mongoose.Schema.Types.ObjectId, ref: "Deportista", required: true },
  category: {
    type: String,
    enum: [
      "nutrition",
      "equipment",
      "methodology",
      "sponsor_open",
      "sponsor_social_media",
      "sponsor_jersey",
    ],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "eur" },
  donorName: { type: String, default: "" },
  donorEmail: { type: String, default: "" },
  stripeSessionId: { type: String, required: true, unique: true },
  status: { type: String, default: "completed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Donation", DonationSchema);
