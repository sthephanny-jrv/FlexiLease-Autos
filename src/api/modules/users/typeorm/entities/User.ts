import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  cpf: string;

  @Column()
  birth: string;

  @Column()
  cep: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  qualified: boolean;

  @Column()
  neighbordhood: string;

  @Column()
  street: string;

  @Column()
  complement: string;

  @Column()
  city: string;

  @Column()
  uf: string;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}

export default User;
