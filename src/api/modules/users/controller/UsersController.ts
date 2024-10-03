import { Request, Response } from 'express';
import UserService from '../service/UserService';
import UserDTO from '../dto/UserDTO';

export default class UserController {
  public async create(request: Request, response: Response): Promise<void> {
    const { name, cpf, birth, cep, email, password } = request.body;

    const userService = new UserService();

    const user = await userService.createService({
      name,
      cpf,
      birth,
      cep,
      email,
      password,
    });

    const userDTO = new UserDTO(user);
    response.status(201).json(userDTO);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const id = request.user.id; //Pegando o id que veio do token

    const userService = new UserService();
    const idUser = Number(id);

    const user = await userService.showUser(idUser);

    const userDTO = new UserDTO(user);
    return response.status(200).json(userDTO);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const id = request.user.id;
    const userService = new UserService();

    const idUser = Number(id);
    await userService.deleteService(idUser);

    return response.status(204).send('Car deleted');
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const id = parseInt(request.user.id);
    const {
      name,
      cpf,
      birth,
      cep,
      email,
      password,
      neighbordhood,
      street,
      complement,
      city,
      uf,
    } = request.body;

    const userService = new UserService();

    const user = await userService.updateUser(
      name,
      cpf,
      birth,
      cep,
      email,
      password,
      neighbordhood,
      street,
      complement,
      city,
      uf,
      id,
    );

    const userDTO = new UserDTO(user);
    return response.status(200).json(userDTO);
  }
}
