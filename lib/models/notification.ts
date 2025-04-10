import mongoose, { Schema, models } from "mongoose"

/**
 * Notification Schema
 * Defines the structure for notification documents in MongoDB
 */
const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["message", "match", "system"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  relatedMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Export the model, checking if it already exists to prevent model overwrite errors
export const Notification = models.Notification || mongoose.model("Notification", NotificationSchema)
