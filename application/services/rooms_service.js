// application/services/rooms_service.js
import Room from '../models/room.js';

const getRooms = async ({
  page = 1,
  per_page = 10,
  searchQuery = null,
  minCapacity = null,
  maxCapacity = null
} = {}) => {
  try {
    let query = {};

    // Aplicar filtro de búsqueda por nombre
    if (searchQuery && searchQuery.trim() !== '') {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Filtros por capacidad
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }

    // Calcular paginación
    const totalRooms = await Room.countDocuments(query);
    const totalPages = Math.ceil(totalRooms / per_page);
    const offset = (page - 1) * per_page;

    // Ordenar por nombre ascendente por defecto
    const sortOptions = { name: 1 };

    // Obtener rooms paginados
    const paginatedRooms = await Room.find(query)
      .sort(sortOptions)
      .skip(offset)
      .limit(per_page)
      .populate('reservationIds');

    const paginationData = {
      rooms: paginatedRooms,
      pagination: {
        page: page,
        per_page: per_page,
        records: totalRooms,
        pages: totalPages,
        start_record: offset + 1,
        end_record: Math.min(offset + per_page, totalRooms),
        has_prev: page > 1,
        has_next: page < totalPages
      }
    };

    return {
      success: true,
      data: paginationData,
      message: "Lista de salas obtenida exitosamente",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    const errorResponse = {
      success: false,
      message: `Error al obtener las salas: ${error.message}`,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack_trace = error.stack;
    }

    return errorResponse;
  }
};

const createRoom = async (roomData) => {

  try {
    const room = new Room({
      name: roomData.name,
      description: roomData.description,
      capacity: roomData.capacity,
      availabilities: roomData.availabilities,
      exceptions: roomData.exceptions,
      reservationIds: roomData.reservationIds
    });

    const savedRoom = await room.save();
    return savedRoom;
  } catch (error) {
    throw error;
  }
}

const updateRoom = async (roomId, updates) => {
  try {
    // { new: true } para devolver el documento actualizado
    const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, { new: true, runValidators: true });
    return updatedRoom;
  } catch (error) {
    throw error;
  }
}

export default {
  getRooms,
  createRoom,
  updateRoom,
};
 