import { Router } from 'express';

import carsRouter from '../modules/cars/routes/cars.routes';

const routes = Router();

routes.use('/', carsRouter);

export default routes;
