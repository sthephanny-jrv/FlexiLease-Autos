import User from '../typeorm/entities/User';

class UserDTO {
  name: string;
  cpf: string;
  birth: string;
  cep: string;
  email: string;
  qualified: boolean;
  neighbordhood: string;
  street: string;
  complement: string;
  city: string;
  uf: string;

  constructor(user: User) {
    this.name = user.name;
    this.cpf = user.cpf;
    this.birth = user.birth;
    this.cep = user.cep;
    this.email = user.email;
    this.qualified = user.qualified;
    this.neighbordhood = user.neighbordhood;
    this.street = user.street;
    this.complement = user.complement;
    this.city = user.city;
    this.uf = user.uf;
  }
}

export default UserDTO;
