// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRouter from './api'; // Importa el enrutador principal

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

// Aquí se registra el enrutador principal con el prefijo '/api'
// Esto crea la ruta completa: /api + /dashboard + /stats
app.use('/api', mainRouter); 

export default app;