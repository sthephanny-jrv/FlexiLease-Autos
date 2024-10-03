import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import UsersController from '../controller/UsersController';
import SessionsController from '../auth/SessionsController';
import isAuthenticated from 'src/api/middlewares/authentication/isAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const sessionsController = new SessionsController();

usersRouter.post(
  '/user',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      cpf: Joi.string().required(),
      birth: Joi.string().required(),
      cep: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30).required(),
    },
  }),
  usersController.create,
);

usersRouter.get('/user', isAuthenticated, usersController.show);
usersRouter.delete('/user', isAuthenticated, usersController.delete);

usersRouter.put(
  '/user',
  isAuthenticated,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().optional(),
      cpf: Joi.string().optional(),
      birth: Joi.string().optional(),
      cep: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().min(6).max(30).optional(),
      neighbordhood: Joi.string().allow('').optional(),
      street: Joi.string().allow('').optional(),
      complement: Joi.string().allow('').optional(),
      city: Joi.string().optional(),
      uf: Joi.string().optional(),
    },
  }),
  usersController.update,
);

// SESSION ROUTES

usersRouter.post(
  '/auth',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default usersRouter;
