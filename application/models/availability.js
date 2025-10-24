// models/availability.js
import mongoose from 'mongoose';

const Availability = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
    validate: {
      validator: Number.isInteger,
      message: 'Day must be an integer between 0 (Sunday) and 6 (Saturday)'
    }
  },
  open: {
    type: Number,
    required: true,
    min: 0,
    max: 1440,
    validate: {
      validator: Number.isInteger,
      message: 'Open time must be in minutes from midnight (0-1440)'
    }
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
  }
}, {
  _id: true,
  timestamps: false
});

// No exportamos como modelo ya que es un esquema embebido
export { Availability };