import express, { application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import loginRoutes from './routes/login.routes'
import turnoRoutes from './routes/turno.routes'
import asignacionRoute from './routes/asignacion.routes'

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

app.use('/webhook-bg/api/v1',loginRoutes);
app.use('/webhook-bg/api/v1',turnoRoutes);
app.use('/webhook-bg/api/v1',asignacionRoute);

export default app;