// models/reservation.js
import mongoose from 'mongoose';
import { participantSchema } from './participant.js';

const reservationSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Reservation subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: true
  },
  startTime: { // Cambié 'open' por 'startTime' para mayor claridad
    type: Number,
    required: true,
    min: 0,
    max: 1440
  },
  endTime: { // Cambié 'close' por 'endTime' para mayor claridad
    type: Number,
    required: true,
    min: 0,
    max: 1440,
    validate: {
      validator: function(value) {
        return value > this.startTime;
      },
      message: 'End time must be after start time'
    }
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  participants: {
    type: [participantSchema],
    required: true,
    validate: {
      validator: function(participants) {
        return participants.length > 0;
      },
      message: 'At least one participant is required'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Índices compuestos para mejor performance
reservationSchema.index({ roomId: 1, date: 1 });
reservationSchema.index({ date: 1, startTime: 1, endTime: 1 });
reservationSchema.index({ status: 1 });

// Middleware para actualizar la referencia en Room
reservationSchema.post('save', async function() {
  await mongoose.model('Room').findByIdAndUpdate(
    this.roomId,
    { $addToSet: { reservationIds: this._id } }
  );
});

reservationSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await mongoose.model('Room').findByIdAndUpdate(
      doc.roomId,
      { $pull: { reservationIds: doc._id } }
    );
  }
});

// Método para verificar conflictos de horario
reservationSchema.statics.checkAvailability = async function(roomId, date, startTime, endTime, excludeReservationId = null) {
  const query = {
    roomId,
    date,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
    ]
  };
  
  if (excludeReservationId) {
    query._id = { $ne: excludeReservationId };
  }
  
  const conflictingReservation = await this.findOne(query);
  return !conflictingReservation;
};

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;