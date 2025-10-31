// index.js
import Koa from 'koa';
import render from 'koa-ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'koa-static';
import session from 'koa-session';
import 'dotenv/config';
import { koaBody } from 'koa-body';
import middlewares from './configs/middlewares.js';
import helpers from './configs/helpers.js';
import bootstrap from './configs/bootstrap.js'; 
import connectDB from './configs/database.js'; // Importar la conexión a la BD

const app = new Koa();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta public
app.use(serve(path.join(__dirname, 'public')));

// Configure and use koa-body middleware
app.use(koaBody({
  multipart: true,
  urlencoded: true,
  formidable: {
    uploadDir: './uploads'
  }
}));

// Configurar el middleware de sesión
app.keys = ['tu_clave_secreta'];
const SESSION_CONFIG = {
  key: 'koa:sess', // clave de la cookie
  maxAge: 86400000, // 24 horas
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
app.use(session(SESSION_CONFIG, app));

// helpers
app.use(helpers.flash);
app.use(helpers.loadEnv);

// Usar el middlewares
app.use(middlewares.logger);
app.use(middlewares.headers);

// Configurar EJS
render(app, {
  root: path.join(__dirname, 'views'), // Ruta a las vistas
  layout: false, // Si no quieres usar un layout
  viewExt: 'ejs', // Extensión de las vistas
  cache: false, // Desactivar caché en desarrollo
});

// Usar el router configurado en bootstrap
app.use(bootstrap.routes()).use(bootstrap.allowedMethods());

// Usar el middleware notFound
app.use(middlewares.notFound);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // 1. Conectar a la base de datos PRIMERO
    console.log('🔄 Conectando a la base de datos...');
    await connectDB();
    console.log('✅ Base de datos conectada exitosamente');

    // 2. Iniciar el servidor DESPUÉS de conectar a la BD
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar el servidor
startServer();