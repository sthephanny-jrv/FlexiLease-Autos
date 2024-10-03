import AppError from 'src/api/middlewares/errors/AppError';
import { getCustomRepository } from 'typeorm';
import CarsRepository from '../typeorm/repositories/CarsRepository';
import Car from '../typeorm/entities/Car';
import CarDTO from '../dto/CarDTO';

interface IRequest {
  model: string;
  color: string;
  year: number;
  valuePerDay: number;
  acessories: { name: string }[];
  numberOfPassengers: number;
}

interface CarQuery {
  year?: number;
  color?: string;
  model?: string;
  numberOfPassengers?: number;
  limit?: number;
  offset?: number;
}

export interface CustomRequest extends Request {
  query: CarQuery;
}

export default class CarService {
  public async createService({
    model,
    color,
    year,
    valuePerDay,
    acessories,
    numberOfPassengers,
  }: IRequest): Promise<Car> {
    const carRepository = getCustomRepository(CarsRepository);

    if (acessories.length == 0) {
      throw new AppError(
        `You must have at least ONE accessory`,
        'Bad request',
        400,
      );
    }

    const namesAccessory = acessories.map(accessory => accessory.name);
    const duplicates = namesAccessory.filter(
      (name, index, arr) => arr.indexOf(name) !== index,
    );

    if (duplicates.length > 0) {
      throw new AppError(
        `There can be no repeated accessories`,
        'Bad request',
        400,
      );
    }

    if (year < 1950 || year > 2023) {
      throw new AppError(
        `The car's year of manufacture must be between 1950 and 2023`,
        'Bad request',
        400,
      );
    }

    const car = carRepository.create({
      model,
      color,
      year,
      valuePerDay,
      acessories: namesAccessory,
      numberOfPassengers,
    });

    await carRepository.save(car);

    return car;
  }

  public async listService(
    request: CustomRequest,
  ): Promise<{
    cars: CarDTO[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const carRepository = getCustomRepository(CarsRepository);

    const {
      year,
      color,
      model,
      numberOfPassengers,
      limit = 10,
      offset = 0,
    } = request.query;

    const query: {
      year?: number;
      color?: string;
      model?: string;
      numberOfPassengers?: number;
    } = {};
    if (year) query.year = year;
    if (color) query.color = color;
    if (model) query.model = model;
    if (numberOfPassengers) query.numberOfPassengers = numberOfPassengers;

    const total = await carRepository.count(query);

    const cars = await carRepository.find({
      where: query,
      take: Number(limit), //máximo de registros
      skip: Number(offset), //quantos registros devem ser pulados para começar
    });

    const carsDTO = cars.map(car => new CarDTO(car));

    return {
      cars: carsDTO,
      total,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  public async deleteService(id: number): Promise<void> {
    const carRepository = getCustomRepository(CarsRepository);

    const car = await carRepository.findById(id);

    if (!car) {
      throw new AppError(`Car not found`, 'Not Found', 404);
    }

    await carRepository.remove(car);
  }

  public async showCar(id: number): Promise<Car> {
    const carRepository = getCustomRepository(CarsRepository);

    const car = await carRepository.findById(id);

    if (!car) {
      throw new AppError('Car not found', 'Not Found', 404);
    }

    return car;
  }

  public async updateCar(
    model: string,
    color: string,
    year: number,
    valuePerDay: number,
    acessories: { name: string }[],
    numberOfPassengers: number,
    id: number,
  ): Promise<Car> {
    const carRepository = getCustomRepository(CarsRepository);

    const car = await carRepository.findById(id);

    if (!car) {
      throw new AppError(`Car not found`, 'Not Found', 404);
    }

    if (acessories.length == 0) {
      throw new AppError(
        `You must have at least ONE accessory`,
        'Bad request',
        400,
      );
    }

    const namesAccessory = acessories.map(accessory => accessory.name);
    const duplicates = namesAccessory.filter(
      (name, index, arr) => arr.indexOf(name) !== index,
    );

    if (duplicates.length > 0) {
      throw new AppError(
        `There can be no repeated accessories`,
        'Bad request',
        400,
      );
    }

    if (year < 1950 || year > 2023) {
      throw new AppError(
        `The car's year of manufacture must be between 1950 and 2023`,
        'Bad request',
        400,
      );
    }

    car.model = model;
    car.color = color;
    car.year = year;
    car.valuePerDay = valuePerDay;
    car.acessories = namesAccessory;
    car.numberOfPassengers = numberOfPassengers;

    await carRepository.save(car);

    const carUpdated = await carRepository.findById(id);

    return carUpdated;
  }

  public async specificUpdateCar(id: number, name: string): Promise<Car> {
    const carRepository = getCustomRepository(CarsRepository);

    const car = await carRepository.findById(id);

    if (!car) {
      throw new AppError('Car not found', 'Not Found', 404);
    }

    if (car.acessories.includes(name)) {
      car.acessories = car.acessories.filter(accessory => accessory !== name);
    } else {
      car.acessories.push(name);
    }

    await carRepository.save(car);

    const updatedCar = await carRepository.findById(id);

    return updatedCar;
  }
}
