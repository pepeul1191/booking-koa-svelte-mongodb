// application/controllers/system_controller.js
import Router from 'koa-router';
//import systemsService from '../services/systems_service.js'; 

const router = new Router();
/*
router.get('/api/v1/systems', async (ctx) => {
  const result = await systemsService.getAllSystems(); 
  ctx.status = result.status ? 200 : 500; 
  ctx.body = result; 
});

router.get('/api/v1/systems/:id', async (ctx) => {
  const { id } = ctx.params; 
  const result = await systemsService.getSystemById(id); 
  ctx.status = result.status ? 200 : (result.error == 'NotFound' ? 404 : 500); 
  ctx.body = result; 
});
*/
export default router;
