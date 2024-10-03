import { Request, Response } from 'express';
import CarService from '../service/CarService';
import CarDTO from '../dto/CarDTO';
import { CustomRequest } from '../service/CarService';
import AppError from 'src/api/middlewares/errors/AppError';

export default class CarsController {
  public async create(request: Request, response: Response): Promise<void> {
    const {
      model,
      color,
      year,
      valuePerDay,
      acessories,
      numberOfPassengers,
    } = request.body;

    const carService = new CarService();

    const car = await carService.createService({
      model,
      color,
      year,
      valuePerDay,
      acessories,
      numberOfPassengers,
    });

    const carDTO = new CarDTO(car);
    response.status(201).json(carDTO);
  }

  public async list(
    request: CustomRequest,
    response: Response,
  ): Promise<Response> {
    const carService = new CarService();

    const cars = await carService.listService(request);

    return response.status(200).json(cars);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const carService = new CarService();

    const idCar = Number(id);
    await carService.deleteService(idCar);
    return response.status(204).send('Car deleted');
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const carService = new CarService();
    const idCar = Number(id);

    const car = await carService.showCar(idCar);

    return response.status(200).json(car);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const id = parseInt(request.params.id);
    const {
      model,
      color,
      year,
      valuePerDay,
      acessories,
      numberOfPassengers,
    } = request.body;

    const carService = new CarService();

    const car = await carService.updateCar(
      model,
      color,
      year,
      valuePerDay,
      acessories,
      numberOfPassengers,
      id,
    );

    const carDTO = new CarDTO(car);
    return response.status(200).json(carDTO);
  }

  public async specificUpdate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const id = parseInt(request.params.id);
    const { name } = request.body;

    if (!name) {
      throw new AppError(
        'Accessory description is required',
        'Bad request',
        400,
      );
    }

    const carService = new CarService();
    const car = await carService.specificUpdateCar(id, name);

    const carDTO = new CarDTO(car);
    return response.status(200).json(carDTO);
  }
}
