import AppError from 'src/api/middlewares/errors/AppError';
import { Between, getCustomRepository, Not } from 'typeorm';
import ReserveRepository from '../typeorm/repositories/ReserveRepository';
import Reserve from '../typeorm/entities/Reserve';
import CarsRepository from '../../cars/typeorm/repositories/CarsRepository';
import UsersRepository from '../../users/typeorm/repositories/UsersRepository';
import ReserveDTO from '../dto/ReserveDTO';

interface IRequest {
  startDate: string;
  endDate: string;
  idUser: number;
  carId: number;
}

interface CarQuery2 {
  startDate?: string;
  endDate?: string;
  carId?: number;
  limit?: number;
  offset?: number;
}

export interface CustomRequest2 extends Request {
  user: {
    id: number;
  };
  query: CarQuery2;
}

export default class ReserveService {
  public async createService({
    startDate,
    endDate,
    idUser,
    carId,
  }: IRequest): Promise<Reserve> {
    const reserveRepository = getCustomRepository(ReserveRepository);
    const carRepository = getCustomRepository(CarsRepository);
    const userRepository = getCustomRepository(UsersRepository);

    const car = await carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 'Not Found', 404);
    }

    const user = await userRepository.findById(idUser);
    const majority = user?.qualified;
    if (majority == false) {
      throw new AppError('Underage user', 'Forbidden', 401);
    }

    function isValidDate(dateString: string): boolean {
      const dateRegex = /^\d{2}[-\/]\d{2}[-\/]\d{4}$/;
      return dateRegex.test(dateString);
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      throw new AppError(
        'Invalid date format. Use DD/MM/YYYY',
        'Bad Request',
        400,
      );
    }

    const startDateFormated = startDate.replace(/\//g, '-');
    const endDateFormated = endDate.replace(/\//g, '-');

    const [day1, month1, year1] = startDateFormated.split('-').map(Number);
    const startDateDate = new Date(year1, month1 - 1, day1);

    const [day2, month2, year2] = endDateFormated.split('-').map(Number);
    const endDateDate = new Date(year2, month2 - 1, day2);

    const time = endDateDate.getTime() - startDateDate.getTime();
    const days = time / (1000 * 60 * 60 * 24);

    const valuePerDay = car.valuePerDay;
    const finalValue = valuePerDay * days;

    if (startDateDate > endDateDate) {
      throw new AppError(
        'Start date must be earlier than end date',
        'Bad Request',
        400,
      );
    }

    const existingReserveForCar = await reserveRepository.findOne({
      where: {
        carId,
        startDate: Between(startDateFormated, endDateFormated),
        endDate: Between(startDateFormated, endDateFormated),
      },
    });

    if (existingReserveForCar) {
      throw new AppError(
        'Car already reserved for the selected dates',
        'Conflict',
        409,
      );
    }

    const existingReserveForUser = await reserveRepository.findOne({
      where: {
        userId: idUser,
        startDate: Between(startDateFormated, endDateFormated),
        endDate: Between(startDateFormated, endDateFormated),
      },
    });

    if (existingReserveForUser) {
      throw new AppError(
        'User already has a reservation for the selected dates',
        'Conflict',
        409,
      );
    }

    const reserve = reserveRepository.create({
      startDate: `${day1
        .toString()
        .padStart(2, '0')}-${month1.toString().padStart(2, '0')}-${year1}`,
      endDate: `${day2
        .toString()
        .padStart(2, '0')}-${month2.toString().padStart(2, '0')}-${year2}`,
      finalValue,
      userId: idUser,
      carId,
    });

    await reserveRepository.save(reserve);

    return reserve;
  }

  public async showReserve(
    idUser: number,
    reserveId: number,
  ): Promise<Reserve> {
    const reserveRepository = getCustomRepository(ReserveRepository);

    const reserve = await reserveRepository.findByUserIdReserveId(
      idUser,
      reserveId,
    );

    if (!reserve) {
      throw new AppError(
        'Reservation not found, user does not own this reservation',
        'Not Found',
        404,
      );
    }

    return reserve;
  }

  public async listService(
    userId: number,
    request: CustomRequest2,
  ): Promise<{
    reserves: ReserveDTO[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const reserveRepository = getCustomRepository(ReserveRepository);

    const { startDate, endDate, carId, limit = 10, offset = 0 } = request.query;

    const query: {
      startDate?: string;
      endDate?: string;
      carId?: number;
      userId?: number;
    } = { userId };
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;
    if (carId) query.carId = carId;

    const total = await reserveRepository.count(query);

    const reserves = await reserveRepository.find({
      where: query,
      take: Number(limit),
      skip: Number(offset),
    });

    const reservesDTO = reserves.map(reserve => new ReserveDTO(reserve));

    return {
      reserves: reservesDTO,
      total,
      limit: Number(limit),
      offset: Number(offset),
    };
  }

  public async updateReserve(
    idUser: number,
    idReserve: number,
    startDate?: string,
    endDate?: string,
    carId?: number,
  ): Promise<Reserve> {
    const reserveRepository = getCustomRepository(ReserveRepository);
    const carRepository = getCustomRepository(CarsRepository);

    const reserve = await reserveRepository.findByUserIdReserveId(
      idUser,
      idReserve,
    );

    if (!reserve) {
      throw new AppError(
        'Reservation not found, user does not own this reservation',
        'Not Found',
        404,
      );
    }

    let car;
    if (carId) {
      car = await carRepository.findById(carId);

      if (!car) {
        throw new AppError('Car not found', 'Not Found', 404);
      }

      reserve.carId = carId;
    } else {
      car = await carRepository.findById(reserve.carId);
      if (!car) {
        throw new AppError(
          'Car not found for the current reservation',
          'Not Found',
          404,
        );
      }
    }

    function isValidDate(dateStr: string): boolean {
      const regex = /^\d{2}-\d{2}-\d{4}$/;
      if (!regex.test(dateStr)) {
        return false;
      }
      const [day, month, year] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    }

    function stringToDate(dateStr: string): Date {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    if (startDate && !endDate) {
      if (!isValidDate(startDate)) {
        throw new AppError(
          'Invalid start date format. Use DD/MM/YYYY',
          'Bad Request',
          400,
        );
      }

      const startDateDate = stringToDate(startDate);

      if (startDateDate > stringToDate(reserve.endDate)) {
        throw new AppError(
          'Start date must be earlier than the existing end date',
          'Bad Request',
          400,
        );
      }

      reserve.startDate = startDate;

      const existingReserveForCar = await reserveRepository.findOne({
        where: {
          carId: reserve.carId,
          startDate: Between(
            startDateDate.toISOString(),
            stringToDate(reserve.endDate).toISOString(),
          ),
          id: Not(reserve.id),
        },
      });

      if (existingReserveForCar) {
        throw new AppError(
          'Car already reserved for the selected dates',
          'Conflict',
          409,
        );
      }
    }

    if (!startDate && endDate) {
      if (!isValidDate(endDate)) {
        throw new AppError(
          'Invalid end date format. Use DD/MM/YYYY',
          'Bad Request',
          400,
        );
      }

      const endDateDate = stringToDate(endDate);

      if (stringToDate(reserve.startDate) > endDateDate) {
        throw new AppError(
          'End date must be later than the existing start date',
          'Bad Request',
          400,
        );
      }

      reserve.endDate = endDate;

      const existingReserveForCar = await reserveRepository.findOne({
        where: {
          carId: reserve.carId,
          endDate: Between(
            stringToDate(reserve.startDate).toISOString(),
            endDateDate.toISOString(),
          ),
          id: Not(reserve.id),
        },
      });

      if (existingReserveForCar) {
        throw new AppError(
          'Car already reserved for the selected dates',
          'Conflict',
          409,
        );
      }
    }

    if (startDate && endDate) {
      const startDateDate = stringToDate(startDate);
      const endDateDate = stringToDate(endDate);

      if (startDateDate > endDateDate) {
        throw new AppError(
          'Start date must be earlier than end date',
          'Bad Request',
          400,
        );
      }

      reserve.startDate = startDate;
      reserve.endDate = endDate;

      const valuePerDay = car.valuePerDay;
      const days =
        (endDateDate.getTime() - startDateDate.getTime()) /
        (1000 * 60 * 60 * 24);
      reserve.finalValue = valuePerDay * days;

      const existingReserveForCar = await reserveRepository.findOne({
        where: {
          carId: reserve.carId,
          startDate: Between(
            startDateDate.toISOString(),
            endDateDate.toISOString(),
          ),
          id: Not(reserve.id),
        },
      });

      if (existingReserveForCar) {
        throw new AppError(
          'Car already reserved for the selected dates',
          'Conflict',
          409,
        );
      }

      const existingReserveForUser = await reserveRepository.findOne({
        where: {
          userId: idUser,
          startDate: Between(
            startDateDate.toISOString(),
            endDateDate.toISOString(),
          ),
          id: Not(reserve.id),
        },
      });

      if (existingReserveForUser) {
        throw new AppError(
          'User already has a reservation for the selected dates',
          'Conflict',
          409,
        );
      }
    }

    await reserveRepository.save(reserve);
    const reserveUpdated = await reserveRepository.findById(idReserve);

    return reserveUpdated;
  }

  public async deleteService(idUser: number, reserveId: number): Promise<void> {
    const reserveRepository = getCustomRepository(ReserveRepository);

    const reserve = await reserveRepository.findByUserIdReserveId(
      idUser,
      reserveId,
    );

    if (!reserve) {
      throw new AppError(
        'Reservation not found, user does not own this reservation',
        'Not Found',
        404,
      );
    }

    await reserveRepository.remove(reserve);
  }
}
