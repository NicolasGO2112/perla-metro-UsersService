import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Inicializa la aplicación de Express
const app = express();

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware para parsear solicitudes JSON
app.use(express.json());

/**
 * Rutas del servicio de usuarios
 * Todas las rutas definidas en userRoutes estarán bajo /users
 */
app.use('/users', userRoutes);

/**
 * @route GET /
 * @description Ruta raíz para verificar que el servicio está funcionando
 * @access Público
 */
app.get('/', (req, res) => {
  res.send('Users Service funcionando');
});

// Configuración del puerto
const PORT = process.env.PORT || 4000;

/**
 * Inicializa el servidor y escucha en el puerto definido
 */
app.listen(PORT, () => console.log(`Users Service corriendo en puerto ${PORT}`));
