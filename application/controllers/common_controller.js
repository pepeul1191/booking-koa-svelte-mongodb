// application/controllers/common_controller.js
import Router from 'koa-router';
import { requireLogin, redirectIfLoggedIn } from '../../configs/middlewares.js';

const router = new Router();

// Definir la ruta principal
router.get('/', requireLogin, async (ctx) => {
  await ctx.render('common/application', { mensaje: '¡Hola, Koa con EJS y controladores!' });
});

router.get('/test', requireLogin, async (ctx) => {
  await ctx.render('common/test', { mensaje: '¡Hola, Koa con EJS y controladores!' });
});

// Definir otra ruta
router.get('/sign-in', redirectIfLoggedIn, async (ctx) => {
  var messages = ""; 
  await ctx.render('/common/sign-in', { messages: messages }); 
});

router.post('/sign-in', async (ctx) => {
  const { username, password } = ctx.request.body;
  console.log(ctx.request.body);
  if(process.env.USERNAME === '' || process.env.PASSWORD === ''){
    ctx.flashError('Ambos campos deben de ester llenos');
    ctx.redirect('sign-in');
    return;
  }
  else if(process.env.USERNAME === username && process.env.PASSWORD === password){
    ctx.session.authenticated = true;
    ctx.flashSuccess('Has iniciado sesión correctamente');
    ctx.redirect('/');
    return;
  }else{
    ctx.flashError('Usuario y/o contraseña incorrectos');
    ctx.redirect('sign-in');
  } 
  return;
});

router.get('/sign-out', async (ctx) => {
  // Destruir la sesión
  ctx.flashSuccess('Has cerrado sesión correctamente');
  ctx.session = null;
  
  ctx.redirect('/sign-in');
});

export default router;
