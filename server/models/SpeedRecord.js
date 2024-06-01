import mongoose from "mongoose";

const SpeedRecordSchema = new mongoose.Schema({
  speed: { type: Number, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

const SpeedRecord = mongoose.model("SpeedRecord", SpeedRecordSchema);

export { SpeedRecord };