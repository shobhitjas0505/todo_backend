// models/Todo.js
// Mongoose model for Todo items.

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this todo
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('Todo', todoSchema);