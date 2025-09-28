import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Users Service funcionando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Users Service corriendo en puerto ${PORT}`));
