//configs/bootstrap.js
import Router from 'koa-router';
import commonRoutes from '../application/routes/common_routes.js';
import roomRoutes from '../application/routes/rooms_routes.js'; 
import reportController from '../application/controllers/reports_controller.js';
import './models.js';

const router = new Router();

// Montar las rutas
router.use(commonRoutes.routes()).use(commonRoutes.allowedMethods());
router.use(reportController.routes()).use(reportController.allowedMethods());
router.use(roomRoutes.routes()).use(roomRoutes.allowedMethods());

export default router;