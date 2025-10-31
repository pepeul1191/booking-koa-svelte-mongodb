// models/room.js
import mongoose from 'mongoose';
import { Availability } from './availability.js';
import { Exception } from './exception.js';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    maxlength: [100, 'Room name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  capacity: {
    type: Number,
    required: true,
    min: [1, 'Capacity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Capacity must be an integer'
    }
  },
  availability: {
    type: [Availability],
    required: true,
    validate: {
      validator: function(availabilities) {
        // Validar que no haya días duplicados
        const days = availabilities.map(a => a.day);
        return new Set(days).size === days.length;
      },
      message: 'Duplicate days in availability schedule'
    }
  },
  exceptions: [Exception],
  reservationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }]
}, {
  timestamps: true,
  collection: 'rooms'
});

// Índices para mejor performance
roomSchema.index({ name: 1 });
roomSchema.index({ 'availability.day': 1 });
roomSchema.index({ 'exceptions.date': 1 });

// Método para verificar disponibilidad en una fecha/hora específica
roomSchema.methods.isAvailableAt = function(date, startMinutes, endMinutes) {
  const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
  
  // Primero verificar excepciones
  const exception = this.exceptions.find(exc => 
    exc.date.toDateString() === date.toDateString()
  );
  
  if (exception) {
    return startMinutes >= exception.open && endMinutes <= exception.close;
  }
  
  // Luego verificar disponibilidad regular
  const availability = this.availability.find(avail => avail.day === dayOfWeek);
  
  if (!availability) return false;
  
  return startMinutes >= availability.open && endMinutes <= availability.close;
};

const Room = mongoose.model('Room', roomSchema);
export default Room;