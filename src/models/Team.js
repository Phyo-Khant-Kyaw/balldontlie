// models/Team.js
import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: String,
  country: String,
  players: [playerSchema],
  player_count: { type: Number, default: 0 },
  created_by: { type: String, required: true },
});

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
