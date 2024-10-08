import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UsersRepository';
import AppError from 'src/api/middlewares/errors/AppError';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from 'src/api/config/auth';

interface IRequest {
  email: string;
  password: string;
}

export default class CreateSessionsService {
  public async createService({ email, password }: IRequest): Promise<string> {
    const userRepository = getCustomRepository(UserRepository);

    const userr = await userRepository.findByEmail(email);

    if (!userr) {
      throw new AppError(
        'Incorrect email/password combination',
        'Bad request',
        400,
      );
    }

    const passwordConfirmed = await compare(password, userr.password);

    if (!passwordConfirmed) {
      throw new AppError(
        'Incorrect email/password combination',
        'Bad request',
        400,
      );
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: String(userr.id),
      expiresIn: authConfig.jwt.expiresIn,
    });

    return token;
  }
}
