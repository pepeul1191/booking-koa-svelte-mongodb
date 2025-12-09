// Funciones del controlador (solo lógica, sin configuración de rutas)

export const renderApplication = async (ctx) => {
  await ctx.render('common/application', { 
    mensaje: '¡Hola, Koa con EJS y controladores!' 
  });
};

export const renderTest = async (ctx) => {
  await ctx.render('common/test', { 
    mensaje: '¡Hola, Koa con EJS y controladores!' 
  });
};

export const renderSignIn = async (ctx) => {
  var messages = ""; 
  await ctx.render('/common/sign-in', { messages: messages }); 
};

export const handleSignIn = async (ctx) => {
  const { username, password } = ctx.request.body;
  console.log(ctx.request.body);
  
  if(process.env.USERNAME === '' || process.env.PASSWORD === ''){
    ctx.flashError('Ambos campos deben de estar llenos');
    ctx.redirect('sign-in');
    return;
  }
  else if(process.env.USERNAME === username && process.env.PASSWORD === password){
    ctx.session.authenticated = true;
    ctx.flashSuccess('Has iniciado sesión correctamente');
    ctx.redirect('/');
    return;
  } else {
    ctx.flashError('Usuario y/o contraseña incorrectos');
    ctx.redirect('sign-in');
  } 
};

export const handleSignOut = async (ctx) => {
  // Destruir la sesión
  ctx.flashSuccess('Has cerrado sesión correctamente');
  ctx.session = null;
  
  ctx.redirect('/sign-in');
};