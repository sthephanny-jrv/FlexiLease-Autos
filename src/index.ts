import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import './database/connection.ts';
import routes from '../src/api/routes';
import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import AppError from './api/middlewares/errors/AppError';

import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerPath = path.join(__dirname, '../FlexiLease-Autos-SWAGGER.yaml');
const swaggerDocument = YAML.load(swaggerPath);
app.use('/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/v1', routes);

app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.code).json({
        code: error.code,
        status: error.status,
        message: error.message,
      });
    }

    console.log(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
