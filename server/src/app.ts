// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet'; // Importar Helmet
import mainRouter from './api'; // Importa el enrutador principal

dotenv.config();
const app: Application = express();

// Usar Helmet para establecer cabeceras de seguridad.
// Es recomendable ponerlo al principio de la cadena de middlewares.
app.use(helmet());

app.use(cors());
app.use(express.json());

// Aquí se registra el enrutador principal con el prefijo '/api'
// Esto crea la ruta completa: /api + /dashboard + /stats
app.use('/api', mainRouter); 

export default app;