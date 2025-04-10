import mongoose from "mongoose"

/**
 * MongoDB connection utility
 * Handles connection caching to prevent multiple connections
 */

// Check for MongoDB URI in environment variables
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Global variable to cache the MongoDB connection
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Connect to MongoDB
 * Returns the mongoose connection
 */
export async function connectToDatabase() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose.connection
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
