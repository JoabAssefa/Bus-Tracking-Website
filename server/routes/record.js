import express from "express";
import { SpeedRecord } from "../models/SpeedRecord.js";

const router = express.Router();

// Threshold speed
const SPEED_THRESHOLD = 30; // Example threshold speed in km/hr

// Route to record speed violations
router.post("/record-speed", async (req, res) => {
  const { speed, date, time } = req.body;

  if (speed > SPEED_THRESHOLD) {
    const newRecord = new SpeedRecord({ speed, date, time });
    await newRecord.save();
    return res.json({ status: true, message: "Speed violation recorded" });
  }

  return res.json({ status: false, message: "Speed within limits" });
});

// Route to get speed violation reports
router.get("/speed-violations", async (req, res) => {
  try {
    const records = await SpeedRecord.find();
    return res.json({ status: true, records });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error fetching records" });
  }
});

// Route to clear all speed violation records
router.delete("/clear", async (req, res) => { // Changed the path here
  try {
    await SpeedRecord.deleteMany({});
    return res.json({ status: true, message: "All records cleared." });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Error clearing records." });
  }
});

export { router as RecordRouter };
