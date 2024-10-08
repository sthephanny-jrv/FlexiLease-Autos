import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ReserveController from '../controller/ReserveContoller';
import isAuthenticated from 'src/api/middlewares/authentication/isAuthenticated';

const reserveRouter = Router();
const reserveController = new ReserveController();

reserveRouter.post(
  '/reserve',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      carId: Joi.number().integer().required(),
    },
  }),
  reserveController.create,
);

reserveRouter.get('/reserve', isAuthenticated, reserveController.list);

reserveRouter.get(
  '/reserve/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  reserveController.show,
);

reserveRouter.put(
  '/reserve/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      startDate: Joi.string().optional(),
      endDate: Joi.string().optional(),
      carId: Joi.number().integer().optional(),
    },
  }),
  reserveController.update,
);

reserveRouter.delete(
  '/reserve/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  reserveController.delete,
);

export default reserveRouter;
