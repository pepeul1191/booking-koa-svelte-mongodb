// application/controllers/system_controller.js
import Router from 'koa-router';
import roomsService from '../services/rooms_service.js'; 

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

/*
router.get('/api/v1/systems/:id', async (ctx) => {
  const { id } = ctx.params; 
  const result = await systemsService.getSystemById(id); 
  ctx.status = result.status ? 200 : (result.error == 'NotFound' ? 404 : 500); 
  ctx.body = result; 
});
*/

export default router;