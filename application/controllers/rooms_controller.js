// application/controllers/system_controller.js
import Router from 'koa-router';
import roomsService from '../services/rooms_service.js'; 
import mongoose from 'mongoose';

const router = new Router();

router.get('/api/v1/rooms', async (ctx) => {
  try {
    // Obtener query params en snake_case y convertirlos a camelCase
    const {
      page = 1,
      per_page = 10,
      search, // Mantener como search (snake_case del query param)
      min_capacity,
      max_capacity
    } = ctx.query;

    // Llamar al servicio con los parámetros convertidos
    const result = await roomsService.getRooms({
      page: parseInt(page),
      per_page: parseInt(per_page),
      searchQuery: search, // Pasar como searchQuery que espera el servicio
      minCapacity: min_capacity ? parseInt(min_capacity) : null,
      maxCapacity: max_capacity ? parseInt(max_capacity) : null
    });

    // CORRECCIÓN: El servicio devuelve 'success', no 'status'
    ctx.status = result.success ? 200 : 400; 
    ctx.body = result;

  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      timestamp: new Date().toISOString()
    };
  }
});

router.get('/api/v1/rooms/:id', async (ctx) => {
  try {
    const { id } = ctx.params;  // Obtén el room ID
    const { month } = ctx.query;  // Obtén el parámetro de mes (opcional)

    // Verificar si el mes está presente y es válido
    const monthFilter = month ? parseInt(month) : null;

    // Buscar la habitación por ID
    const room = await roomsService.getRoomById(id, monthFilter);

    if (!room) {
      ctx.status = 404;
      ctx.body = { success: false, message: 'Room not found' };
      return;
    }

    ctx.status = 200;
    ctx.body = { success: true, room };

  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    };
  }
});

router.post('/api/v1/rooms', async (ctx) => {
  try {
    const roomData = ctx.request.body;

    // Validar que los datos requeridos estén presentes
    if (!roomData.name || !roomData.description || !roomData.capacity) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Faltan campos requeridos: name, description o capacity',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Preparar los datos para el modelo Room
    const roomToCreate = {
      name: roomData.name.trim(),
      description: roomData.description.trim(),
      capacity: parseInt(roomData.capacity),
      availabilities: roomData.availabilities || [],
      exceptions: (roomData.exceptions || []).map(exp => ({
        ...exp,
        date: new Date(exp.date) // Convertir string a Date
      })),
      reservationIds: [] // Mapear reservations a reservationIds
    };

    // Validar que capacity sea un número entero válido
    if (isNaN(roomToCreate.capacity) || roomToCreate.capacity < 1) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Capacity debe ser un número entero mayor o igual a 1',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Crear la sala usando el servicio
    const createdRoom = await roomsService.createRoom(roomToCreate);

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: createdRoom,
      message: 'Sala creada exitosamente',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.log(error)
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Error de validación',
        errors: errors,
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Manejar errores de duplicados u otros errores
    if (error.code === 11000 || error.message.includes('duplicate')) {
      ctx.status = 409;
      ctx.body = {
        success: false,
        message: 'Ya existe una sala con ese nombre',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    };
  }
});

router.put('/api/v1/rooms/:id', async (ctx) => {
  try {
    const roomId = ctx.params.id;
    const roomData = ctx.request.body;

    // Validar que el ID sea válido
    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de sala no válido',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Preparar los datos para la actualización
    const updates = {};

    if (roomData.name !== undefined) {
      updates.name = roomData.name.trim();
    }
    if (roomData.description !== undefined) {
      updates.description = roomData.description.trim();
    }
    if (roomData.capacity !== undefined) {
      updates.capacity = parseInt(roomData.capacity);
      // Validar que capacity sea un número entero válido
      if (isNaN(updates.capacity) || updates.capacity < 1) {
        ctx.status = 400;
        ctx.body = {
          success: false,
          message: 'Capacity debe ser un número entero mayor o igual a 1',
          timestamp: new Date().toISOString()
        };
        return;
      }
    }
    if (roomData.availabilities !== undefined) {
      updates.availabilities = roomData.availabilities;
    }
    if (roomData.exceptions !== undefined) {
      updates.exceptions = roomData.exceptions.map(exp => ({
        ...exp,
        date: new Date(exp.date) // Convertir string a Date
      }));
    }
    // Nota: reservationIds no se actualiza normalmente por esta vía, pero si se envía, se actualiza.
    if (roomData.reservationIds !== undefined) {
      updates.reservationIds = roomData.reservationIds;
    }

    // Actualizar la sala usando el servicio
    const updatedRoom = await roomsService.updateRoom(roomId, updates);

    // Si no se encontró la sala para actualizar, el servicio devuelve null
    if (!updatedRoom) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Sala no encontrada',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: updatedRoom,
      message: 'Sala actualizada exitosamente',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.log(error);
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Error de validación',
        errors: errors,
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Manejar errores de duplicados
    if (error.code === 11000 || error.message.includes('duplicate')) {
      ctx.status = 409;
      ctx.body = {
        success: false,
        message: 'Ya existe una sala con ese nombre',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    };
  }
});

router.delete('/api/v1/rooms/:id', async (ctx) => {
  try {
    const roomId = ctx.params.id;

    // Validar que el ID esté presente
    if (!roomId) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de sala es requerido',
        timestamp: new Date().toISOString()
      };
      return;
    }

    // Eliminar la sala usando el servicio
    const deletedRoom = await roomsService.deleteRoom(roomId);

    // Si no se encontró la sala
    if (!deletedRoom) {
      ctx.status = 404;
      ctx.body = {
        success: false,
        message: 'Sala no encontrada',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: deletedRoom,
      message: 'Sala eliminada exitosamente',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.log(error);
    
    // Manejar error de ID inválido de MongoDB
    if (error.name === 'CastError') {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'ID de sala inválido',
        timestamp: new Date().toISOString()
      };
      return;
    }

    ctx.status = 500;
    ctx.body = {
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    };
  }
});

export default router;