import { Router } from 'express';

import carsRouter from '../modules/cars/routes/cars.routes';
import usersRouter from '../modules/users/routes/users.routes';

const routes = Router();

routes.use('/', carsRouter);
routes.use('/', usersRouter);

export default routes;
