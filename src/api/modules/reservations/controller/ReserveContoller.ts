import { Request, Response } from 'express';
import ReserveService, { CustomRequest2 } from '../service/ReserveService';
import ReserveDTO from '../dto/ReserveDTO';

export default class CarsController {
  public async create(request: Request, response: Response): Promise<void> {
    const { startDate, endDate, carId } = request.body;
    const id = request.user.id;
    const idUser = Number(id);

    const reserveService = new ReserveService();

    const reserve = await reserveService.createService({
      startDate,
      endDate,
      idUser,
      carId,
    });

    const reserveDTO = new ReserveDTO(reserve);
    response.status(201).json(reserveDTO);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;
    const idUser = Number(id);
    const reserveId = request.params.id;
    const idReserve = Number(reserveId);

    const reserveService = new ReserveService();

    const reserve = await reserveService.showReserve(idUser, idReserve);

    const reserveDTO = new ReserveDTO(reserve);
    return response.status(200).json(reserveDTO);
  }

  public async list(
    request: CustomRequest2,
    response: Response,
  ): Promise<Response> {
    const id = request.user.id;
    const idUser = Number(id);

    const reserveService = new ReserveService();
    const reservations = await reserveService.listService(idUser, request);

    return response.status(200).json(reservations);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;
    const idUser = Number(id);
    const reserveId = request.params.id;
    const idReserve = Number(reserveId);

    const { startDate, endDate, carId } = request.body;

    const reserveService = new ReserveService();

    const reserve = await reserveService.updateReserve(
      idUser,
      idReserve,
      startDate,
      endDate,
      carId,
    );

    const reserveDTO = new ReserveDTO(reserve);
    return response.status(200).json(reserveDTO);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;
    const idUser = Number(id);
    const reserveId = request.params.id;
    const idReserve = Number(reserveId);

    const reserveService = new ReserveService();

    await reserveService.deleteService(idUser, idReserve);
    return response.status(204).send('Car deleted');
  }
}
