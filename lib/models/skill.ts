import mongoose, { Schema, models, model, Document } from 'mongoose';

/**
 * Interface for Skill documents
 */
export interface ISkill extends Document {
  title: string;
  description: string;
  category: string;
  user: mongoose.Types.ObjectId;
  contactPreference: 'email' | 'whatsapp' | 'both';
  whatsapp?: string;
  createdAt: Date;
}

/**
 * Skill Schema - Defines structure for skills
 */
const SkillSchema = new Schema<ISkill>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactPreference: {
    type: String,
    enum: ['email', 'whatsapp', 'both'],
    default: 'email',
  },
  whatsapp: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export with type-safe model
export const Skill = models.Skill || model<ISkill>('Skill', SkillSchema);
