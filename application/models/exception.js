// models/exception.js
import mongoose from 'mongoose';

const Exception = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  open: {
    type: Number,
    required: true,
    min: 0,
    max: 1440
  },
  close: {
    type: Number,
    required: true,
    min: 0,
    max: 1440,
    validate: {
      validator: function(value) {
        return value > this.open;
      },
      message: 'Close time must be after open time'
    }
  },
  reason: {
    type: String,
    default: 'Special schedule'
  }
}, {
  _id: true,
  timestamps: false
});

export { Exception };