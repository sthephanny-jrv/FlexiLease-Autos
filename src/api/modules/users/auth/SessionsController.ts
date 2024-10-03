import { Request, Response } from 'express';
import CreateSessionsService from './CreateSessinService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;

    const createSession = new CreateSessionsService();

    const loguin = await createSession.createService({
      email,
      password,
    });

    const token = { 'accessToken:': loguin };

    response.status(200).json(token);
  }
}
