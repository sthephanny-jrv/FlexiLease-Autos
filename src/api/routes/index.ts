import { Router } from 'express';

import carsRouter from '../modules/cars/routes/cars.routes';
import usersRouter from '../modules/users/routes/users.routes';
import reserveRouter from '../modules/reservations/routes/reserve.routes';

const routes = Router();

routes.use('/', carsRouter);
routes.use('/', usersRouter);
routes.use('/', reserveRouter);

export default routes;
