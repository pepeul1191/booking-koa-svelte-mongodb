// application/routes/rooms_routes
import Router from 'koa-router';
import { 
  fetchAll, 
  fetchOneById, 
  create,
  update,
  deleteOne 
} from '../controllers/rooms_controller.js'; // Importaciones nombradas

const router = new Router();

// Definir las rutas utilizando las funciones importadas
router.get('/api/v1/rooms', fetchAll);
router.get('/api/v1/rooms/:id', fetchOneById);
router.post('/api/v1/rooms', create);
router.put('/api/v1/rooms/:id', update);
router.delete('/api/v1/rooms/:id', deleteOne);

export default router;