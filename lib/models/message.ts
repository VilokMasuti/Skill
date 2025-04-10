import mongoose, { Schema, models } from "mongoose"

/**
 * Message Schema
 * Defines the structure for message documents in MongoDB
 */
const MessageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Export the model, checking if it already exists to prevent model overwrite errors
export const Message = models.Message || mongoose.model("Message", MessageSchema)
