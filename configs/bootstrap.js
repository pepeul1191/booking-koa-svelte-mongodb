// configs/bootstrap.js
import Router from 'koa-router';
import commonController from '../application/controllers/common_controller.js';
import systemController from '../application/controllers/systems_controller.js';
import roomController from '../application/controllers/rooms_controller.js';

import Room from '../application/models/room.js'; 
import Reservation from '../application/models/reservation.js';

const router = new Router();

// Montar los controladores
router.use(commonController.routes()).use(commonController.allowedMethods());
router.use(systemController.routes()).use(systemController.allowedMethods());
router.use(roomController.routes()).use(roomController.allowedMethods());

export default router;