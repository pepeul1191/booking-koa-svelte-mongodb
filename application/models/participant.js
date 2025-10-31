// models/participant.js
import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  internal: {
    type: Boolean,
    required: true,
    default: false
  },
  code: {
    type: Number,
    required: function() {
      return this.internal === true;
    },
    validate: {
      validator: Number.isInteger,
      message: 'Code must be an integer'
    }
  },
  role: {
    type: String,
    required: function() {
      return this.internal === true;
    }
  },
  enterprise: {
    type: String,
    required: function() {
      return this.internal === false;
    }
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        // Regex mejorado para validación de email :cite[1]
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  _id: true,
  timestamps: false
});

export { participantSchema };