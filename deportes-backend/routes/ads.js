import express from "express";
import Ad from "../models/Ad.js";

const router = express.Router();

router.get("/", async (req, res) => {

  const now = new Date();
  const { role } = req.query;
  const query = {
    isActive: true,
    $or: [
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: null, endDate: null }
    ]
  };
  if (role) {
    query.targetRoles = { $in: [role] };
  }
  const ads = await Ad.find(query);
  res.json(ads);
});

export default router;