import express, { application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import loginRoutes from './routes/login.routes'
import tareaRoutes from './routes/tarea.routes'
import usuarioRoute from './routes/usuario.route'
import clienteRoute from './routes/cliente.routes'
import imagenRoute from './routes/imagen.routes'
import jornadaRoute from './routes/jornada.routes'
import movimientoRoute from './routes/movimiento.routes'
import Helmet from 'helmet';
import rateLimit from 'express-rate-limit'
import { TokenMiddleware } from './configs/TokenMiddleware';

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	// max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	// windowMs: 10000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	// standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	// legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message:'Cantidad de solicitudes exedio la capacidad por el tiempo.'
})

const app = express();

app.use(cors({
    exposedHeaders: ['Authorization']
}));
// app.options('*', cors());

app.use(morgan('dev'));
// app.use(cors());

app.use(express.json())

app.use((err:any, req:any, res:any, next:any) => {
	if (err) {
	  console.error('Invalid Request data')
	  res.send('Petición de request invalido')
	} else {
	  next()
	}
  })

app.use(Helmet());
app.use(limiter);
app.use(TokenMiddleware)

app.use('/micliente/api/v3',loginRoutes);
app.use('/micliente/api/v3',tareaRoutes);
app.use('/micliente/api/v3',usuarioRoute);
app.use('/micliente/api/v3',clienteRoute);
app.use('/micliente/api/v3',imagenRoute);
app.use('/micliente/api/v3',jornadaRoute);
app.use('/micliente/api/v3',movimientoRoute);

export default app;