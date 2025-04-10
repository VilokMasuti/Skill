import mongoose, { Schema, models } from "mongoose"
import { connectToDatabase } from "../mongodb"

if (mongoose.connection.readyState === 0) {
  connectToDatabase().catch(console.error)
}

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  bio: String,
  location: String,
  github: String,
  phone: String,
  skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
  needs: [String],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
})

export const User = models.User || mongoose.model("User", UserSchema)
