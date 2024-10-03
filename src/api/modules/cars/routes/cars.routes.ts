import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import CarsController from '../controller/CarsController';
import isAuthenticated from 'src/api/middlewares/authentication/isAuthenticated';

const carsRouter = Router();
const carsController = new CarsController();

carsRouter.get('/car', isAuthenticated, carsController.list);

carsRouter.post(
  '/car',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      model: Joi.string().required(),
      color: Joi.string().required(),
      year: Joi.number().integer().required(),
      valuePerDay: Joi.number().precision(2).required(),
      acessories: Joi.array()
        .items(Joi.object({ name: Joi.string().required() }))
        .required(),
      numberOfPassengers: Joi.number().integer().required(),
    },
  }),
  carsController.create,
);

carsRouter.delete(
  '/car/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  carsController.delete,
);

carsRouter.get(
  '/car/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
  }),
  carsController.show,
);

carsRouter.put(
  '/car/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      model: Joi.string().optional(),
      color: Joi.string().optional(),
      year: Joi.number().integer().optional(),
      valuePerDay: Joi.number().precision(2).optional(),
      acessories: Joi.array()
        .items(Joi.object({ name: Joi.string().required() }))
        .optional(),
      numberOfPassengers: Joi.number().integer().optional(),
    },
  }),
  carsController.update,
);

carsRouter.patch(
  '/car/:id',
  isAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
    },
  }),
  carsController.specificUpdate,
);

export default carsRouter;
