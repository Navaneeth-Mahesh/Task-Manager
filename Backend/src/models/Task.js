import mongoose from 'mongoose'
import { TASK_STATUS, TASK_PRIORITY } from '../constants/index.js'

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public_id for deletion
  mimetype: { type: String },
  size: { type: Number },
  uploadedAt: { type: Date, default: Date.now },
})

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },

    status: {
      type: String,
      enum: {
        values: Object.values(TASK_STATUS),
        message: '{VALUE} is not a valid status',
      },
      default: TASK_STATUS.TODO,
    },

    priority: {
      type: String,
      enum: {
        values: Object.values(TASK_PRIORITY),
        message: '{VALUE} is not a valid priority',
      },
      default: TASK_PRIORITY.MEDIUM,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'Tasks cannot have more than 10 tags',
      },
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // Auto-set when status changes to 'completed'
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ── Indexes for query performance ─────────────────────────────────────────────
taskSchema.index({ createdBy: 1, status: 1 })
taskSchema.index({ assignedTo: 1, status: 1 })
taskSchema.index({ dueDate: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ title: 'text', description: 'text', tags: 'text' }) // Full-text search

// ── Pre-save: auto-set completedAt ───────────────────────────────────────────
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date()
      this.progress = 100
    } else if (this.status !== 'completed') {
      this.completedAt = null
    }
  }
  next()
})

// ── Virtual: isOverdue ────────────────────────────────────────────────────────
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'completed') return false
  return new Date(this.dueDate) < new Date()
})

// ── Virtual: daysLeft ─────────────────────────────────────────────────────────
taskSchema.virtual('daysLeft').get(function () {
  if (!this.dueDate) return null
  const diff = new Date(this.dueDate) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const Task = mongoose.model('Task', taskSchema)
export default Task
