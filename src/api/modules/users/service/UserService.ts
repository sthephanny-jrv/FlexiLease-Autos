import { getCustomRepository } from 'typeorm';
import UserRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import AppError from 'src/api/middlewares/errors/AppError';
import axios from 'axios';
import { hash } from 'bcryptjs';

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

    function isValidDate(dateString: string): boolean {
      const dateRegex = /^\d{2}[-\/]\d{2}[-\/]\d{4}$/;
      return dateRegex.test(dateString);
    }

    if (!isValidDate(birth)) {
      throw new AppError(
        'Invalid date format. Use DD/MM/YYYY',
        'Bad Request',
        400,
      );
    }

    const standardizedBirth = birth.replace(/\//g, '-');

    const [day, month, year] = standardizedBirth.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    let qualified = false;
    if (age >= 18) {
      qualified = true;
    }

    const formattedCpf = cpf.replace(/[^\d]/g, '');

    if (!this.isValidCpf(formattedCpf)) {
      throw new AppError('Invalid CPF', 'Bad request', 400);
    }

    const existingCpf = await userRepository.findOne({
      where: { cpf: formattedCpf },
    });

    if (existingCpf) {
      throw new AppError('CPF already exists', 'Bad request', 400);
    }

    const existingEmail = await userRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new AppError('Email already exists', 'Bad request', 400);
    }

    const viaCepUrl = `https://viacep.com.br/ws/${cep.replace('-', '')}/json`;
    const { data } = await axios.get(viaCepUrl);

    if (!data || data.erro) {
      throw new AppError('Invalid CEP', 'Bad request', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      cpf: formattedCpf,
      birth: `${day.toString().padStart(2, '0')}-${month
        .toString()
        .padStart(2, '0')}-${year}`,
      cep,
      email,
      password: hashedPassword,
      qualified,
      neighbordhood: data.bairro,
      street: data.logradouro,
      complement: data.complemento,
      city: data.localidade,
      uf: data.uf,
    });

    await userRepository.save(user);

    return user;
  }

  public isValidCpf(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, '');

    // Verifica se o CPF tem 11 dígitos ou é uma sequência repetida (ex.: 111.111.111-11)
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }

    // Valida os dois dígitos verificadores
    const calcCheckDigit = (digits: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < digits.length; i++) {
        total += parseInt(digits[i]) * (factor - i);
      }
      const remainder = total % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstCheckDigit = calcCheckDigit(cpf.substring(0, 9), 10);
    const secondCheckDigit = calcCheckDigit(cpf.substring(0, 10), 11);

    return (
      firstCheckDigit === parseInt(cpf[9]) &&
      secondCheckDigit === parseInt(cpf[10])
    );
  }

  public async showUser(id: number): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 'Not Found', 404);
    }

    return user;
  }

  public async deleteService(id: number): Promise<void> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError(`User not found`, 'Not Found', 404);
    }

    await userRepository.remove(user);
  }

  public async updateUser(
    name: string,
    cpf: string,
    birth: string,
    cep: string,
    email: string,
    password: string,
    neighbordhood: string,
    street: string,
    complement: string,
    city: string,
    uf: string,
    id: number,
  ): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 'Not Found', 404);
    }

    const standardizedBirth = birth.replace(/\//g, '-');

    const [day, month, year] = standardizedBirth.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    let qualified = false;
    if (age >= 18) {
      qualified = true;
    }

    const formattedCpf = cpf.replace(/[^\d]/g, '');

    if (!this.isValidCpf(formattedCpf)) {
      throw new AppError('Invalid CPF', 'Bad request', 400);
    }

    const existingCpf = await userRepository.findOne({
      where: { cpf: formattedCpf },
    });

    if (existingCpf && existingCpf.id !== id) {
      throw new AppError('CPF already exists', 'Bad request', 400);
    }

    const existingEmail = await userRepository.findOne({
      where: { email },
    });

    if (existingEmail && existingEmail.id !== id) {
      throw new AppError('Email already exists', 'Bad request', 400);
    }

    const viaCepUrl = `https://viacep.com.br/ws/${cep.replace('-', '')}/json`;
    const { data } = await axios.get(viaCepUrl);

    if (!data || data.erro) {
      throw new AppError('Invalid CEP', 'Bad request', 400);
    }

    if (password) {
      const hashedPassword = await hash(password, 8);
      user.password = hashedPassword;
    }

    user.name = name;
    user.cpf = formattedCpf;
    user.birth = `${day
      .toString()
      .padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
    user.cep = cep;
    user.email = email;
    user.qualified = qualified;
    user.neighbordhood = data.bairro;
    user.street = data.logradouro;
    user.complement = data.complemento;
    user.city = data.localidade;
    user.uf = data.uf;

    await userRepository.save(user);

    const userUpdated = await userRepository.findById(id);

    return userUpdated;
  }
}
