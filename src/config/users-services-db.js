/**
 * Módulo de configuración de la conexión a la base de datos PostgreSQL.
 * Utiliza la librería `pg` para manejar conexiones y `dotenv` para cargar variables de entorno.
 */

import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const { Pool } = pkg;

/**
 * Pool de conexiones a PostgreSQL.
 * - La URL de conexión se obtiene desde la variable de entorno DATABASE_URL.
 * - Se habilita SSL y se desactiva la verificación de certificados (necesario en Render con certificados autofirmados).
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;
