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

/*
router.get('/api/v1/systems/:id', async (ctx) => {
  const { id } = ctx.params; 
  const result = await systemsService.getSystemById(id); 
  ctx.status = result.status ? 200 : (result.error == 'NotFound' ? 404 : 500); 
  ctx.body = result; 
});
*/

export default router;