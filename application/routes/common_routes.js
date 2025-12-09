import Router from 'koa-router';
import { 
  renderApplication, 
  renderTest, 
  renderSignIn,
  handleSignIn,
  handleSignOut 
} from '../controllers/common_controller.js'; // Importaciones nombradas
import { requireLogin, redirectIfLoggedIn } from '../../configs/middlewares.js';

const router = new Router();

// Definir las rutas utilizando las funciones importadas
router.get('/', requireLogin, renderApplication);
router.get('/test', requireLogin, renderTest);
router.get('/sign-in', redirectIfLoggedIn, renderSignIn);
router.post('/sign-in', handleSignIn);
router.get('/sign-out', handleSignOut);

export default router;