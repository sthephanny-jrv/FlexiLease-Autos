import AppError from 'src/api/middlewares/errors/AppError';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import CarDTO from '../dto/CarDTO';

interface IRequest {
  name: string;
  cpf: string;
  birth: string;
  cep: string;
  email: string;
  password: string;
}

export default class UserService {
  public async createService({
    name,
    cpf,
    birth,
    cep,
    email,
    password,
  }: IRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = userRepository.create({
      name,
      cpf,
      birth,
      cep,
      email,
      password,
    });

    await userRepository.save(user);

    return user;
  }
}
